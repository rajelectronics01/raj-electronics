"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { MenuIcon, XIcon, PhoneIcon, SearchIcon, ChevronDownIcon, UserIcon, ShoppingCartIcon } from '@/components/icons/Icons';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading: userLoading, logout } = useUser();
    const { setIsOpen: setCartOpen, totalItems } = useCart();

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            closeMenu();
        }
    };

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
                { name: 'Chest Freezers', href: '/category/chest-freezers' },
                { name: 'Microwaves', href: '/category/microwaves' },
                { name: 'Water Dispensers', href: '/category/water-dispensers' },
                { name: 'Small Appliances', href: '/category/kitchen-appliances' }
            ]
        },
        {
            title: 'HOME CARE',
            links: [
                { name: 'Washing Machines', href: '/category/washing-machines' },
                { name: 'Geysers', href: '/category/geysers' }
            ]
        },
        {
            title: 'GADGETS & MOBILES',
            links: [
                { name: 'Mobile Phones', href: '/category/mobile-phones' },
                { name: 'Smartphones', href: '/category/mobile-phones' },
            ]
        }
    ];

    return (
        <header className={styles.headerWrapper}>
            {/* Very Top Announcement Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarContainer}>
                    <p className={styles.topBarText}>🏆 Top Dealer for ACs, TVs, Coolers & Home Appliances in Secunderabad & Hyderabad. Best Prices Guaranteed.</p>
                    <div className={styles.topBarLinks}>
                        <Link href="/admin" aria-label="Admin Panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                            <UserIcon width={16} height={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Sticky Header */}
            <div className={cn(styles.mainHeader, isScrolled ? styles.scrolled : '')}>
                {/* --- DESKTOP CONTAINER --- */}
                <div className={styles.desktopContainer}>
                    <Link href="/" className={styles.logoContainer} onClick={closeMenu}>
                        <Image
                            src="/logo.png"
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
                        <form className={styles.searchBar} onSubmit={handleSearch}>
                            <SearchIcon width={18} height={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        
                        <button 
                            className={styles.cartBtn} 
                            onClick={() => setCartOpen(true)}
                            aria-label="Open cart"
                        >
                            <ShoppingCartIcon width={22} height={22} />
                            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
                        </button>

                        <a href="tel:+919290748866" className={styles.callButton}>
                            <span className={styles.callIconWrap}><PhoneIcon width={18} height={18} /></span>
                            <span className={styles.callText}>Call Us</span>
                        </a>
                    </div>
                </div>

                {/* --- MOBILE CONTAINER (Vijay Sales Style) --- */}
                <div className={styles.mobileContainer}>
                    <div className={styles.mobileTopRow}>
                        <div className={styles.mobileLeftActions}>
                            <button className={styles.mobileHamburger} onClick={toggleMenu} aria-label="Menu">
                                <MenuIcon width={26} height={26} />
                            </button>
                        </div>
                        
                        <Link href="/" className={styles.mobileLogoContainer} onClick={closeMenu}>
                            <Image 
                                src="/logo.png" 
                                alt="Logo" 
                                width={32} 
                                height={32} 
                                className={styles.mobileLogoImage}
                            />
                            <h1 className={styles.mobileBrandTitle}>Raj Electronics</h1>
                        </Link>
                        
                        <div className={styles.mobileRightActions}>
                            <Link href="/admin" aria-label="Admin/User Profile" className={styles.mobileIconBtn}>
                                <UserIcon width={24} height={24} />
                            </Link>
                            <button className={styles.mobileIconBtn} onClick={() => setCartOpen(true)} aria-label="Open cart">
                                <ShoppingCartIcon width={24} height={24} />
                                {totalItems > 0 && <span className={styles.cartBadgeMobile}>{totalItems}</span>}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.mobileSearchRow}>
                        <form className={styles.mobileFullSearchForm} onSubmit={handleSearch}>
                            <SearchIcon width={20} height={20} className={styles.mobileSearchIcon} />
                            <input
                                type="text"
                                placeholder="Search for phone, TV, home appliances..."
                                className={styles.mobileFullSearchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Advanced Mobile Menu Drawer */}
            <div className={cn(styles.mobileDrawerWrapper, isMenuOpen ? styles.open : '')}>
                <div className={cn(styles.mobileDrawerOverlay, isMenuOpen ? styles.open : '')} onClick={closeMenu} />
                <div className={cn(styles.mobileDrawer, isMenuOpen ? styles.open : '')}>
                    <div className={styles.drawerHeader}>
                        <div className={styles.drawerLogo}>
                            <Image src="/logo.png" alt="Logo" width={32} height={32} />
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
