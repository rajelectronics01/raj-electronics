"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardOverview.module.css";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatter = new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    });

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard analytics...</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeBanner}>
                <div>
                    <h1>Welcome, Raj Electronics Admin</h1>
                    <p>Here's what's happening with your store today.</p>
                </div>
                <div className={styles.liveBadge}>● System Live</div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Revenue Today</div>
                    <div className={styles.statValue}>{formatter.format(stats.todayRevenue)}</div>
                    <div className={`${styles.statDiff} ${stats.todayOrders > 0 ? styles.pos : ''}`}>
                        {stats.todayOrders} new orders today
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Pending Deliveries</div>
                    <div className={styles.statValue}>{stats.pendingOrders}</div>
                    <div className={styles.statDiff}>Requires attention</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Sales (All-time)</div>
                    <div className={styles.statValue}>{formatter.format(stats.totalRevenue)}</div>
                    <div className={styles.statDiff}>From {stats.totalOrders} orders</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Inventory</div>
                    <div className={styles.statValue}>{stats.totalProducts}</div>
                    <div className={styles.statDiff}>Products managed</div>
                </div>
            </div>

            <div className={styles.recentActivity}>
                <h3>Dashboard Tips</h3>
                <div className={styles.tipsGrid}>
                    <div className={styles.tipItem}>
                        <h4>📦 Manage Orders</h4>
                        <p>Go to the Orders tab to see customer details, addresses, and update delivery status.</p>
                    </div>
                    <div className={styles.tipItem}>
                        <h4>✨ Update Banners</h4>
                        <p>Use the Hero Banner tab to change homepage slides for festivals like Holi or Diwali.</p>
                    </div>
                    <div className={styles.tipItem}>
                        <h4>🔍 SEO Keywords</h4>
                        <p>When adding products, ensure you include "Secunderabad" or "Hyderabad" in descriptions for better ranking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
