export interface Product {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    price: number;
    originalPrice?: number;
    images: string[];
    features: string[];
    isFeatured: boolean;
    description?: string;
}

export type Category = "Air Conditioners" | "Air Coolers" | "Televisions" | "Refrigerators" | "Washing Machines" | "Home Appliances";

export const BRANDS = ["Lloyd", "Whirlpool", "Crompton", "Orient", "TG Smart"];
