"use client";

import React from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { ShoppingCartIcon } from "@/components/icons/Icons";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    category: string;
  };
  style?: React.CSSProperties;
  className?: string; // Add className
}

export default function AddToCart({ product, style, className }: AddToCartProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.png",
      quantity: 1,
      category: product.category
    };
    addItem(item);
  };

  if (className) {
    return (
      <button className={className} style={style} onClick={handleAdd}>
        <ShoppingCartIcon width={20} height={18} /> Add to Cart
      </button>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      variant="outline"
      style={{ 
        flex: 1, 
        width: '100%', 
        borderColor: '#0f172a', 
        color: '#0f172a',
        ...style 
      }}
    >
      <ShoppingCartIcon width={20} height={18} style={{ marginRight: '10px' }} /> 
      Add to Cart
    </Button>
  );
}
