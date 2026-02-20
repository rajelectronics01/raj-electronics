import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    href?: string;
    target?: string;
}

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    children,
    href,
    ...props
}: ButtonProps) {
    const classes = cn(styles.btn, styles[variant], styles[size], className);

    if (href) {
        const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');

        if (isExternal) {
            return (
                <a href={href} className={classes} {...(props as any)}>
                    {children}
                </a>
            );
        }

        return (
            <Link href={href} className={classes} {...(props as any)}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
}
