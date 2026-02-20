"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { MenuIcon, XIcon, PhoneIcon } from '@/components/icons/Icons';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Initial scroll check and event listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Check immediately in case page is already scrolled on load
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/category/all' },
        { name: 'Gallery', href: '/#gallery' },
        { name: 'Categories', href: '#' },
        { name: 'About', href: '/#about' },
        { name: 'Contact', href: '/#contact' },
    ];

    const megaMenuData = [
        {
            title: 'COOLING',
            links: [
                { name: 'Air Conditioners', href: '/category/air-conditioners' },
                { name: 'Air Coolers', href: '/category/air-coolers' },
            ]
        },
        {
            title: 'HOME ENTERTAINMENT',
            links: [
                { name: 'LED TVs', href: '/category/televisions' },
                { name: 'Home Theaters', href: '/category/home-theaters' },
                { name: 'Soundbars', href: '/category/soundbars' },
            ]
        },
        {
            title: 'KITCHEN',
            links: [
                { name: 'Refrigerators', href: '/category/refrigerators' },
                { name: 'Microwaves', href: '/category/microwaves' },
                { name: 'Water Purifiers', href: '/category/water-purifiers' },
            ]
        },
        {
            title: 'HOME CARE',
            links: [
                { name: 'Washing Machines', href: '/category/washing-machines' },
                { name: 'Vacuum Cleaners', href: '/category/vacuum-cleaners' },
            ]
        }
    ];

    return (
        <>
            <header className={cn(styles.header, isScrolled ? styles.scrolled : '')}>
                <div className={styles.container}>
                    {/* Left Section - Brand */}
                    <div className={styles.leftSection}>
                        <Link href="/" className={styles.logoWrapper}>
                            <Image
                                src="/logo.png.png"
                                alt="Raj Electronics Logo"
                                fill
                                className={styles.logoImage}
                                sizes="50px"
                                priority
                            />
                        </Link>
                        <div className={styles.brandInfo}>
                            <Link href="/" className={styles.brandName} onClick={closeMenu}>
                                Raj Electronics
                            </Link>
                            <div className={styles.trustBadge}>
                                <span className={styles.ratingStars}>⭐ 4.9</span>
                                <span>(85+ Reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className={styles.desktopNav}>
                        {navLinks.map((link) => {
                            if (link.name === 'Categories') {
                                return (
                                    <div key={link.name} className={styles.navItemWithDropdown}>
                                        <button className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            {link.name} <span style={{ fontSize: '0.8em', marginLeft: '4px' }}>▼</span>
                                        </button>
                                        <div className={styles.megaMenu}>
                                            <div className={styles.megaMenuGrid}>
                                                {megaMenuData.map((category) => (
                                                    <div key={category.title} className={styles.megaMenuColumn}>
                                                        <h4 className={styles.megaMenuTitle}>{category.title}</h4>
                                                        <div className={styles.megaMenuList}>
                                                            {category.links.map((subLink) => (
                                                                <Link
                                                                    key={subLink.name}
                                                                    href={subLink.href}
                                                                    className={styles.megaMenuLink}
                                                                >
                                                                    {subLink.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(styles.navLink, pathname === link.href ? styles.active : '')}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section - Call to Action */}
                    <div className={styles.rightSection}>
                        <a href="tel:+919290748866" className={styles.ctaBtn}>
                            <PhoneIcon width={18} height={18} /> Call Now
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className={styles.mobileActions}>
                        <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
                            {isMenuOpen ? <XIcon /> : <MenuIcon />}
                        </Button>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    <div className={cn(styles.mobileNav, isMenuOpen ? styles.open : '')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>Menu</span>
                            <Button variant="ghost" onClick={closeMenu} size="sm"><XIcon /></Button>
                        </div>

                        {navLinks.map((link) => {
                            if (link.name === 'Categories') {
                                return (
                                    <div key={link.name} style={{ marginBottom: '10px' }}>
                                        <div className={styles.mobileNavLink} style={{ color: '#64748b', fontSize: '0.9rem', paddingBottom: '4px' }}>CATEGORIES</div>
                                        {megaMenuData.map((category) => (
                                            <div key={category.title} style={{ paddingLeft: '15px' }}>
                                                {category.links.map((subLink) => (
                                                    <Link
                                                        key={subLink.name}
                                                        href={subLink.href}
                                                        className={styles.mobileNavLink}
                                                        style={{ display: 'block', fontSize: '0.95rem', padding: '10px 15px', fontWeight: 500 }}
                                                        onClick={closeMenu}
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(styles.mobileNavLink, pathname === link.href ? styles.active : '')}
                                    onClick={closeMenu}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                            <a href="tel:+919290748866" className={styles.ctaBtn} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                marginTop: '10px'
                            }}>
                                <PhoneIcon width={18} height={18} /> Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={cn(styles.overlay, isMenuOpen ? styles.open : '')}
                onClick={closeMenu}
            />
        </>
    );
}
