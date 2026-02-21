"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { MenuIcon, XIcon, PhoneIcon, SearchIcon, ChevronDownIcon } from '@/components/icons/Icons';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const megaMenuData = [
        {
            title: 'COOLING',
            links: [
                { name: 'Air Conditioners', href: '/category/air-conditioners' },
                { name: 'Air Coolers', href: '/category/air-coolers' },
                { name: 'Fans', href: '/category/fans' }
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
                { name: 'Small Appliances', href: '/category/kitchen-appliances' }
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
        <header className={styles.headerWrapper}>
            {/* Very Top Announcement Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarContainer}>
                    <p className={styles.topBarText}>🎉 Free Installation & Delivery on Orders above ₹50,000*</p>
                    <div className={styles.topBarLinks}>
                        <Link href="/about">About Us</Link>
                        <span>|</span>
                        <a href="tel:+919290748866">Support: +91 9290748866</a>
                        <span>|</span>
                        <Link href="/admin">Admin Panel</Link>
                    </div>
                </div>
            </div>

            {/* Main Sticky Header */}
            <div className={cn(styles.mainHeader, isScrolled ? styles.scrolled : '')}>
                <div className={styles.container}>

                    {/* Left: Mobile Hamburger */}
                    <button className={styles.mobileHamburger} onClick={toggleMenu} aria-label="Menu">
                        <MenuIcon width={28} height={28} />
                    </button>

                    {/* Center/Left: Logo */}
                    <Link href="/" className={styles.logoContainer} onClick={closeMenu}>
                        <Image
                            src="/logo.png.png"
                            alt="Raj Electronics Logo"
                            width={42}
                            height={42}
                            className={styles.logoImage}
                            priority
                        />
                        <div className={styles.brandTitleWrap}>
                            <h1 className={styles.brandTitle}>Raj Electronics</h1>
                            <span className={styles.brandSubtitle}>Legacy Since 1995</span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className={styles.desktopNav}>
                        <Link href="/" className={cn(styles.navLink, pathname === '/' ? styles.active : '')}>Home</Link>
                        <Link href="/category/all" className={cn(styles.navLink, pathname === '/category/all' ? styles.active : '')}>Shop All</Link>

                        {/* Mega Menu Trigger */}
                        <div className={styles.navDropdownTrigger}>
                            <button className={styles.navLink}>
                                Categories <ChevronDownIcon width={16} height={16} className={styles.chevron} />
                            </button>
                            <div className={styles.megaMenuWrapper}>
                                <div className={styles.megaMenu}>
                                    {megaMenuData.map(group => (
                                        <div key={group.title} className={styles.megaMenuCol}>
                                            <h4 className={styles.megaMenuHeading}>{group.title}</h4>
                                            <ul className={styles.megaMenuList}>
                                                {group.links.map(link => (
                                                    <li key={link.name}>
                                                        <Link href={link.href} className={styles.megaMenuLink}>
                                                            {link.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/about" className={cn(styles.navLink, pathname === '/about' ? styles.active : '')}>About Us</Link>
                    </nav>

                    {/* Right: Actions */}
                    <div className={styles.actionItems}>
                        <div className={styles.searchBar}>
                            <SearchIcon width={18} height={18} className={styles.searchIcon} />
                            <input type="text" placeholder="Search products..." className={styles.searchInput} />
                        </div>
                        <button className={styles.mobileSearchBtn} aria-label="Search">
                            <SearchIcon width={24} height={24} />
                        </button>
                        <a href="tel:+919290748866" className={styles.callButton}>
                            <span className={styles.callIconWrap}><PhoneIcon width={18} height={18} /></span>
                            <span className={styles.callText}>Call Us</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Advanced Mobile Menu Drawer */}
            <div className={cn(styles.mobileDrawerWrapper, isMenuOpen ? styles.open : '')}>
                <div className={cn(styles.mobileDrawerOverlay, isMenuOpen ? styles.open : '')} onClick={closeMenu} />
                <div className={cn(styles.mobileDrawer, isMenuOpen ? styles.open : '')}>
                    <div className={styles.drawerHeader}>
                        <div className={styles.drawerLogo}>
                            <Image src="/logo.png.png" alt="Logo" width={32} height={32} />
                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0f172a' }}>Raj Electronics</span>
                        </div>
                        <button onClick={closeMenu} className={styles.closeBtn}><XIcon width={28} height={28} /></button>
                    </div>

                    <div className={styles.drawerBody}>
                        <Link href="/" className={styles.drawerLink} onClick={closeMenu}>Home</Link>
                        <Link href="/category/all" className={styles.drawerLink} onClick={closeMenu}>Shop All Products</Link>

                        {/* Mobile Accordion for Categories */}
                        <div className={styles.drawerAccordionGroup}>
                            <button
                                className={styles.drawerAccordionTrigger}
                                onClick={() => setActiveAccordion(activeAccordion === 'cats' ? null : 'cats')}
                            >
                                Browse Categories
                                <ChevronDownIcon
                                    width={20}
                                    height={20}
                                    className={cn(styles.accordionChevron, activeAccordion === 'cats' ? styles.rotated : '')}
                                />
                            </button>
                            <div className={cn(styles.drawerAccordionContent, activeAccordion === 'cats' ? styles.contentOpen : '')}>
                                {megaMenuData.map((group) => (
                                    <div key={group.title} className={styles.mobileGroupSpan}>
                                        <h5 className={styles.mobileGroupTitle}>{group.title}</h5>
                                        {group.links.map(link => (
                                            <Link key={link.name} href={link.href} className={styles.mobileGroupLink} onClick={closeMenu}>
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link href="/category/all" className={styles.drawerLink} onClick={closeMenu}>Top Brands</Link>
                        <Link href="/about" className={styles.drawerLink} onClick={closeMenu}>About Us</Link>
                        <Link href="/#contact" className={styles.drawerLink} onClick={closeMenu}>Contact</Link>
                    </div>

                    <div className={styles.drawerFooter}>
                        <a href="tel:+919290748866" className={styles.drawerCtaBtn}>
                            <PhoneIcon width={20} height={20} /> Call For Best Price
                        </a>
                        <p className={styles.drawerFooterText}>Mon - Sun: 10:30 AM to 9:30 PM</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
