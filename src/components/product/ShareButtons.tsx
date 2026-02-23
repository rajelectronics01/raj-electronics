"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface Props {
    productName: string;
    productBrand?: string;
}

export default function ShareButtons({ productName, productBrand }: Props) {
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const textToShare = `Check out the ${productBrand ? productBrand + ' ' : ''}${productName} at Raj Electronics, Secunderabad. Best price guaranteed!`;

    if (!url) return null;

    return (
        <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#4b5563' }}>Share this product:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                    variant="outline"
                    size="sm"
                    href={`https://wa.me/?text=${encodeURIComponent(textToShare + ' ' + url)}`}
                    target="_blank"
                    style={{ borderColor: '#25D366', color: '#25D366' }}
                >
                    WhatsApp
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    style={{ borderColor: '#1877F2', color: '#1877F2' }}
                >
                    Facebook
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    style={{ borderColor: '#1DA1F2', color: '#1DA1F2' }}
                >
                    Twitter
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                >
                    {copied ? '✅ Link Copied!' : '🔗 Copy Link'}
                </Button>
            </div>
        </div>
    );
}
