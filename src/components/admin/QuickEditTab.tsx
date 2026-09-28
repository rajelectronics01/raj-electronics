"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './QuickEditTab.module.css';

type Row = {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: string;
    originalPrice: string;
    inStock: boolean;
    isFeatured: boolean;
    image?: string;
};

type ApiProduct = {
    id: string;
    name?: string;
    brand?: string;
    category?: string;
    price?: number | null;
    originalPrice?: number | null;
    inStock?: boolean;
    isFeatured?: boolean;
    images?: string[];
};

type EditableField = Exclude<keyof Row, 'id' | 'image'>;

// Text columns in on-screen order; used for Enter / arrow-key navigation.
const TEXT_COLUMNS: EditableField[] = ['name', 'brand', 'category', 'price', 'originalPrice'];

const toRow = (p: ApiProduct): Row => ({
    id: p.id,
    name: p.name ?? '',
    brand: p.brand ?? '',
    category: p.category ?? '',
    price: p.price != null ? String(p.price) : '',
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
    inStock: p.inStock ?? true,
    isFeatured: p.isFeatured ?? false,
    image: p.images?.[0],
});

export default function QuickEditTab() {
    const [original, setOriginal] = useState<Record<string, Row>>({});
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const [externalImages, setExternalImages] = useState(0);
    const [rehosting, setRehosting] = useState<string | null>(null);

    const checkExternalImages = async () => {
        try {
            const res = await fetch('/api/admin/rehost-images', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) setExternalImages(data.images ?? 0);
        } catch {
            // Non-essential; the table still works without this banner.
        }
    };

    // Copies images hotlinked from other sites into our storage, a batch at a time.
    const rehostImages = async () => {
        const skip: string[] = [];
        let copied = 0;
        setRehosting('Starting…');
        try {
            for (;;) {
                const res = await fetch('/api/admin/rehost-images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ skip }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to move images');
                copied += data.copied;
                skip.push(...data.failed);
                setRehosting(`Moved ${copied} images… ${data.remaining} products left`);
                if (data.remaining === 0) break;
            }
            setMessage({
                type: skip.length ? 'error' : 'ok',
                text: `Moved ${copied} images to our storage.${skip.length ? ` ${skip.length} could not be downloaded (the original links were kept) — re-upload those by hand.` : ''}`,
            });
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to move images' });
        } finally {
            setRehosting(null);
            await load();
            await checkExternalImages();
        }
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products', { cache: 'no-store' });
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error(data?.error || 'Failed to load products');
            const loaded = (data as ApiProduct[]).map(toRow);
            setRows(loaded);
            setOriginal(Object.fromEntries(loaded.map((r: Row) => [r.id, r])));
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to load products' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); checkExternalImages(); }, []);

    const changedFields = (row: Row): Partial<Row> => {
        const before = original[row.id];
        if (!before) return {};
        return Object.fromEntries(
            (Object.keys(row) as (keyof Row)[])
                .filter((k) => k !== 'id' && k !== 'image' && row[k] !== before[k])
                .map((k) => [k, row[k]])
        ) as Partial<Row>;
    };

    const dirtyRows = useMemo(
        () => rows.filter((r) => Object.keys(changedFields(r)).length > 0),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rows, original]
    );

    // Warn before closing the tab with unsaved edits.
    useEffect(() => {
        if (dirtyRows.length === 0) return;
        const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [dirtyRows.length]);

    const categories = useMemo(
        () => Array.from(new Set(Object.values(original).map((r) => r.category).filter(Boolean))).sort(),
        [original]
    );

    const visibleRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter((r) =>
            (!category || original[r.id]?.category === category) &&
            (!q || `${r.name} ${r.brand} ${r.category}`.toLowerCase().includes(q))
        );
    }, [rows, search, category, original]);

    const updateCell = (id: string, field: EditableField, value: string | boolean) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const save = async () => {
        if (dirtyRows.length === 0 || saving) return;

        const bad = dirtyRows.find((r) => r.price === '' || isNaN(Number(r.price)) || !r.name.trim());
        if (bad) {
            setMessage({ type: 'error', text: `Check "${bad.name || 'unnamed product'}": name and a valid price are required.` });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const updates = dirtyRows.map((r) => {
                const { price, originalPrice, ...rest } = changedFields(r);
                return {
                    id: r.id,
                    ...rest,
                    ...(price !== undefined && { price: Number(price) }),
                    ...(originalPrice !== undefined && { originalPrice: originalPrice === '' ? null : Number(originalPrice) }),
                };
            });
            const res = await fetch('/api/products/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Save failed');

            setOriginal((prev) => {
                const next = { ...prev };
                dirtyRows.forEach((r) => { next[r.id] = r; });
                return next;
            });
            setMessage({ type: 'ok', text: `Saved ${data.saved} product${data.saved === 1 ? '' : 's'}. The website is updated.` });
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Save failed' });
        } finally {
            setSaving(false);
        }
    };

    const discard = () => {
        if (!window.confirm(`Discard changes to ${dirtyRows.length} product(s)?`)) return;
        setRows((prev) => prev.map((r) => original[r.id] ?? r));
        setMessage(null);
    };

    // Ctrl/Cmd+S saves, like a spreadsheet.
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    // Enter / ↓ moves to the same column in the next row, ↑ to the previous row.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, col: EditableField) => {
        let target = -1;
        if (e.key === 'Enter' || e.key === 'ArrowDown') target = rowIndex + (e.shiftKey && e.key === 'Enter' ? -1 : 1);
        else if (e.key === 'ArrowUp') target = rowIndex - 1;
        else return;

        e.preventDefault();
        const next = tableRef.current?.querySelector<HTMLInputElement>(
            `input[data-row="${target}"][data-col="${col}"]`
        );
        if (next) { next.focus(); next.select(); }
    };

    const isChanged = (row: Row, field: EditableField) => original[row.id] && row[field] !== original[row.id][field];

    const discountPct = (row: Row) => {
        const p = Number(row.price), m = Number(row.originalPrice);
        return m > 0 && p > 0 && m > p ? Math.round(((m - p) / m) * 100) : null;
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <div className={styles.filters}>
                    <input
                        className={styles.search}
                        placeholder="Search name, brand, category…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All categories</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className={styles.count}>{visibleRows.length} of {rows.length} products</span>
                </div>
                <div className={styles.actions}>
                    {dirtyRows.length > 0 && (
                        <button className={styles.discard} onClick={discard} disabled={saving}>Discard</button>
                    )}
                    <button className={styles.save} onClick={save} disabled={saving || dirtyRows.length === 0}>
                        {saving ? 'Saving…' : dirtyRows.length > 0 ? `Save ${dirtyRows.length} change${dirtyRows.length === 1 ? '' : 's'}` : 'No changes'}
                    </button>
                </div>
            </div>

            <p className={styles.hint}>
                Click any cell to edit. <kbd>Enter</kbd> / <kbd>↓</kbd> jumps to the next product, <kbd>↑</kbd> goes back,
                <kbd>Ctrl</kbd>+<kbd>S</kbd> saves everything. Edited cells turn yellow until saved.
            </p>

            {externalImages > 0 && (
                <div className={styles.notice}>
                    <span>
                        {rehosting ?? `${externalImages} product images are loaded from other websites (Amazon, Flipkart…). Move them to our own storage so they never break and Google credits us.`}
                    </span>
                    <button className={styles.save} onClick={rehostImages} disabled={!!rehosting || dirtyRows.length > 0}>
                        {rehosting ? 'Moving…' : 'Move images'}
                    </button>
                </div>
            )}

            {message && (
                <div className={message.type === 'ok' ? styles.ok : styles.error}>{message.text}</div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table} ref={tableRef}>
                    <thead>
                        <tr>
                            <th></th>
                            <th className={styles.nameCol}>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price (₹)</th>
                            <th>MRP (₹)</th>
                            <th>Off</th>
                            <th>In stock</th>
                            <th>Featured</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRows.map((row, i) => {
                            const off = discountPct(row);
                            const rowDirty = dirtyRows.some((r) => r.id === row.id);
                            return (
                                <tr key={row.id} className={rowDirty ? styles.dirtyRow : undefined}>
                                    <td>
                                        {row.image
                                            // eslint-disable-next-line @next/next/no-img-element -- 32px admin thumbnail
                                            ? <img src={row.image} alt="" className={styles.thumb} />
                                            : <div className={styles.thumb} />}
                                    </td>
                                    {TEXT_COLUMNS.map((col) => (
                                        <td key={col} className={col === 'name' ? styles.nameCol : undefined}>
                                            <input
                                                className={`${styles.cell} ${col === 'price' || col === 'originalPrice' ? styles.num : ''} ${isChanged(row, col) ? styles.changed : ''}`}
                                                type="text"
                                                inputMode={col === 'price' || col === 'originalPrice' ? 'decimal' : undefined}
                                                value={row[col] as string}
                                                data-row={i}
                                                data-col={col}
                                                onChange={(e) => updateCell(row.id, col, e.target.value)}
                                                onFocus={(e) => e.target.select()}
                                                onKeyDown={(e) => handleKeyDown(e, i, col)}
                                            />
                                        </td>
                                    ))}
                                    <td className={styles.off}>{off != null ? `${off}%` : '—'}</td>
                                    <td className={styles.center}>
                                        <input
                                            type="checkbox"
                                            checked={row.inStock}
                                            onChange={(e) => updateCell(row.id, 'inStock', e.target.checked)}
                                        />
                                    </td>
                                    <td className={styles.center}>
                                        <input
                                            type="checkbox"
                                            checked={row.isFeatured}
                                            onChange={(e) => updateCell(row.id, 'isFeatured', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
