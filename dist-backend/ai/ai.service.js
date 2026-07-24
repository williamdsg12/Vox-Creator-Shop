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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let AiService = class AiService {
    constructor(configService) {
        this.configService = configService;
        this.openai = null;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && !apiKey.includes('sua-chave')) {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateScript(data) {
        if (!data.productName) {
            throw new common_1.BadRequestException('O nome do produto é obrigatório.');
        }
        if (this.openai) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: this.configService.get('OPENAI_MODEL') || 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é a Vox IA, o copiloto definitivo de conversão para Live Commerce no TikTok Shop. Crie um roteiro de live de alta conversão estruturado em: Gancho nos primeiros 3 segundos, Quebra de Objeção, Apresentação da Oferta Única e Chamada para Ação (CTA) para o carrinho amarelo.',
                        },
                        {
                            role: 'user',
                            content: `Gere um roteiro completo de live commerce para o produto: ${data.productName}. Categoria: ${data.category || 'Geral'}. Objetivo: ${data.goal || 'Vendas rápidas'}.`,
                        },
                    ],
                });
                return {
                    script: response.choices[0]?.message?.content || this.getFallbackScript(data.productName),
                    generatedAt: new Date().toISOString(),
                    provider: 'openai',
                };
            }
            catch (err) {
                return {
                    script: this.getFallbackScript(data.productName),
                    generatedAt: new Date().toISOString(),
                    provider: 'vox-copilot-engine',
                };
            }
        }
        return {
            script: this.getFallbackScript(data.productName),
            generatedAt: new Date().toISOString(),
            provider: 'vox-copilot-engine',
        };
    }
    async generateSampleRequest(data) {
        if (!data.productName) {
            throw new common_1.BadRequestException('O nome do produto é obrigatório.');
        }
        const creator = data.creatorName || 'Criador de Conteúdo';
        const followers = data.followerCount || '15k+';
        const message = `Olá equipe de marca! Me chamo ${creator}, crio conteúdo no TikTok para mais de ${followers} seguidores apaixonados. Notei o grande potencial do ${data.productName} e gostaria de solicitar uma amostra grátis para apresentar o produto em primeira mão com um cupom exclusivo na minha próxima Live. Posso enviar meu endereço de entrega?`;
        return {
            message,
            productName: data.productName,
            generatedAt: new Date().toISOString(),
        };
    }
    getFallbackScript(productName) {
        return `🔥 ROTEIRO VOX IA — HIGH CONVERSION LIVE (TIKTOK SHOP)

1. GANCHO VISUAL (0s - 3s)
"Para tudo! Se você tá vendo essa live agora, você deu muita sorte porque o ${productName} acabou de entrar com estoque limitado!"

2. QUEBRA DE OBJEÇÃO (3s - 15s)
"Muita gente me pergunta se realmente funciona ou se vale a pena... Eu testei ao vivo e a diferença é absurda. Olha a qualidade disso aqui!"

3. DEMONSTRAÇÃO PRÁTICA (15s - 45s)
"Vou mostrar agora na prática como o ${productName} resolve seu problema sem complicação. É prático, rápido e o acabamento é profissional!"

4. PUSH DE ESCASSEZ E CTA (45s - 60s)
"Temos apenas 15 unidades no carrinho amarelo aqui embaixo com frete grátis liberado! Clica no ícone do carrinho agora antes que esgote!"`;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map