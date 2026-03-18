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
    isFeatured?: boolean;
    description?: string;
}

export type Category = 
    "Air Conditioners" | 
    "Split AC" | 
    "Window AC" | 
    "Tower AC" | 
    "Air Coolers" | 
    "Televisions" | 
    "Refrigerators" | 
    "Washing Machines" | 
    "Home Appliances" | 
    "Water Dispensers" | 
    "Chest Freezers" | 
    "Mobile Phones";

export const BRANDS = [
    "Lloyd", "Whirlpool", "Crompton", "Orient", "TG Smart",
    "Samsung", "Daikin", "Carrier", "Bluestar", "Sansui",
    "LG", "Voltas", "Mitsubishi", "O-General", "Hitachi",
    "Panasonic", "Godrej", "Haier", "Videocon"
];
