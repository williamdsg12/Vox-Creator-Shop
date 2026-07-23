import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && !apiKey.includes('sua-chave')) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateScript(data: { productName: string; category?: string; targetAudience?: string; goal?: string }) {
    if (!data.productName) {
      throw new BadRequestException('O nome do produto é obrigatório.');
    }

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Você é a Vox IA, o copiloto definitivo de conversão para Live Commerce no TikTok Shop. Crie um roteiro de live de alta conversão estruturado em: Gancho nos primeiros 3 segundos, Quebra de Objeção, Apresentação da Oferta Única e Chamada para Ação (CTA) para o carrinho amarelo.',
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
      } catch (err) {
        // Fallback gracefully on API error
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

  async generateSampleRequest(data: { productName: string; creatorName?: string; followerCount?: string }) {
    if (!data.productName) {
      throw new BadRequestException('O nome do produto é obrigatório.');
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

  private getFallbackScript(productName: string): string {
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
}
