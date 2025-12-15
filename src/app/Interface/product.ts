export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;      
    featured: boolean;       
    discount: number;        
    hasHappyHour: boolean;   
    
    recommendedFor?: number; 
    labels?: string[];
    
    imageUrl?: string;    
}