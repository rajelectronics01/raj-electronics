"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { XIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from "@/components/icons/Icons";
import styles from "./CartDrawer.module.css";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems, isOpen, setIsOpen } = useCart();
  const router = useRouter();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOpen(false);
    // If multiple items, we might need a general checkout, 
    // but the existing app uses /checkout/[productId].
    // For now, if one item, go to its checkout. If multiple, we might need a Cart page.
    if (items.length === 1) {
      router.push(`/checkout/${items[0].productId}`);
    } else {
      // Redirect to a general checkout/cart page (to be implemented)
      router.push('/checkout/cart'); 
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(styles.overlay, isOpen ? styles.overlayOpen : "")} 
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={cn(styles.drawer, isOpen ? styles.drawerOpen : "")}>
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingCartIcon width={24} height={24} />
            Your Cart ({totalItems})
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <XIcon width={24} height={24} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <h3 className={styles.emptyTitle}>Your cart is empty</h3>
              <p>Looks like you haven&apos;t added anything to your cart yet.</p>
              <button 
                className={styles.continueBtn}
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className={styles.cartList}>
              {items.map((item) => (
                <div key={item.productId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image 
                      src={item.image || "/placeholder.png"} 
                      alt={item.name} 
                      fill 
                      style={{ objectFit: 'contain', padding: '8px' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <button 
                        className={styles.itemRemove}
                        onClick={() => removeItem(item.productId)}
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    {item.category && <p className={styles.itemCategory}>{item.category}</p>}
                    
                    <div className={styles.itemFooter}>
                      <span className={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                      <div className={styles.quantityControls}>
                        <button 
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
