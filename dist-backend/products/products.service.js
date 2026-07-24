"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
let ProductsService = class ProductsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.initialProducts = [
            {
                id: 'prod-1',
                title: 'Martelete Rompedor SDS-Plus 800W Professional',
                category: 'Ferramentas',
                price: 389.90,
                commission_rate: 18.5,
                gmv: 'R$ 142.500',
                weekly_growth: 145,
                sales_today: 480,
                sales_yesterday: 195,
                score_ia: 98,
                image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
            },
            {
                id: 'prod-2',
                title: 'Kit Serum Clareador de Niacinamida 10% + Zinco',
                category: 'Beleza & Skincare',
                price: 79.90,
                commission_rate: 25.0,
                gmv: 'R$ 98.200',
                weekly_growth: 88,
                sales_today: 310,
                sales_yesterday: 165,
                score_ia: 94,
                image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
            },
            {
                id: 'prod-3',
                title: 'Fone de Ouvido Bluetooth TWS Pro Canceling',
                category: 'Eletrônicos',
                price: 129.90,
                commission_rate: 20.0,
                gmv: 'R$ 215.000',
                weekly_growth: 210,
                sales_today: 620,
                sales_yesterday: 200,
                score_ia: 96,
                image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
            },
            {
                id: 'prod-4',
                title: 'Mini Processador Elétrico de Alimentos USB',
                category: 'Cozinha',
                price: 49.90,
                commission_rate: 22.0,
                gmv: 'R$ 64.100',
                weekly_growth: 72,
                sales_today: 240,
                sales_yesterday: 140,
                score_ia: 89,
                image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
            },
            {
                id: 'prod-5',
                title: 'Cinta Modeladora Compressão Máxima TikTok Trend',
                category: 'Moda Feminina',
                price: 89.90,
                commission_rate: 30.0,
                gmv: 'R$ 310.800',
                weekly_growth: 320,
                sales_today: 890,
                sales_yesterday: 212,
                score_ia: 99,
                image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
            },
        ];
    }
    async getRadarProducts(query) {
        let items = [...this.initialProducts];
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            items = items.filter((p) => p.title.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower));
        }
        if (query.category && query.category !== 'all') {
            items = items.filter((p) => p.category.toLowerCase() === query.category.toLowerCase());
        }
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const paginatedItems = items.slice(startIndex, startIndex + limit);
        return {
            products: paginatedItems,
            total: items.length,
            page,
            limit,
            totalPages: Math.ceil(items.length / limit),
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProductsService);
//# sourceMappingURL=products.service.js.map