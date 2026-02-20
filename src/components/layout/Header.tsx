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
        { name: 'Categories', href: '/#categories' },
        { name: 'About', href: '/#about' },
        { name: 'Contact', href: '/#contact' },
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(styles.navLink, pathname === link.href ? styles.active : '')}
                            >
                                {link.name}
                            </Link>
                        ))}
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
                        {/* Mobile Drawer Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>Menu</span>
                            <Button variant="ghost" onClick={closeMenu} size="sm"><XIcon /></Button>
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(styles.mobileNavLink, pathname === link.href ? styles.active : '')}
                                onClick={closeMenu}
                            >
                                {link.name}
                            </Link>
                        ))}

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

            {/* Background Overlay for Mobile Menu */}
            <div
                className={cn(styles.overlay, isMenuOpen ? styles.open : '')}
                onClick={closeMenu}
            />
        </>
    );
}
