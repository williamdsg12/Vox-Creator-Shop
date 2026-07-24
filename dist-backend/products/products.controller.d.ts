import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getRadar(search?: string, category?: string, page?: number, limit?: number): Promise<{
        products: {
            id: string;
            title: string;
            category: string;
            price: number;
            commission_rate: number;
            gmv: string;
            weekly_growth: number;
            sales_today: number;
            sales_yesterday: number;
            score_ia: number;
            image_url: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
