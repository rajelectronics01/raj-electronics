"use client";

import { useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import OrdersTab from '@/components/admin/OrdersTab';
import HeroAdminTab from '@/components/admin/HeroAdminTab';
import GalleryAdminTab from '@/components/admin/GalleryAdminTab';
import DashboardOverview from '@/components/admin/DashboardOverview';
import styles from './page.module.css';

export default function AdminPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'hero' | 'gallery'>('overview');

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedProduct(null);
        alert('Product saved successfully!');
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setActiveTab('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setSelectedProduct(null);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveTab('overview')}
                            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid ' + (activeTab === 'overview' ? '#002366' : '#e2e8f0'), fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'overview' ? '#002366' : '#fff', color: activeTab === 'overview' ? '#fff' : '#475569' }}
                        >
                            🏠 Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid ' + (activeTab === 'orders' ? '#002366' : '#e2e8f0'), fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#002366' : '#fff', color: activeTab === 'orders' ? '#fff' : '#475569' }}
                        >
                            📦 Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid ' + (activeTab === 'products' ? '#002366' : '#e2e8f0'), fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'products' ? '#002366' : '#fff', color: activeTab === 'products' ? '#fff' : '#475569' }}
                        >
                            🛒 Products
                        </button>
                        <button
                            onClick={() => setActiveTab('hero')}
                            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid ' + (activeTab === 'hero' ? '#002366' : '#e2e8f0'), fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'hero' ? '#002366' : '#fff', color: activeTab === 'hero' ? '#fff' : '#475569' }}
                        >
                            🖼️ Banners
                        </button>
                        <button
                            onClick={() => setActiveTab('gallery')}
                            style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid ' + (activeTab === 'gallery' ? '#002366' : '#e2e8f0'), fontWeight: 600, cursor: 'pointer', backgroundColor: activeTab === 'gallery' ? '#002366' : '#fff', color: activeTab === 'gallery' ? '#fff' : '#475569' }}
                        >
                            📸 Gallery
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        Log Out
                    </button>
                </div>
                
                {activeTab === 'overview' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <DashboardOverview />
                    </div>
                )}
                {activeTab === 'products' && (
                    <div className={styles.layout}>
                        <div className={styles.formSection}>
                            <ProductForm onSuccess={handleSuccess} initialData={selectedProduct} onCancel={handleCancel} />
                        </div>
                        <div className={styles.listSection}>
                            <ProductList refreshTrigger={refreshTrigger} onEdit={handleEdit} onDeleteSuccess={handleSuccess} />
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <OrdersTab />
                    </div>
                )}
                {activeTab === 'hero' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <HeroAdminTab />
                    </div>
                )}
                {activeTab === 'gallery' && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <GalleryAdminTab />
                    </div>
                )}
            </div>
        </div>
    );
}
