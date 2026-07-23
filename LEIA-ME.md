# O que foi corrigido

Dois problemas, não só um:

1. **O backend nunca esteve no ar.** O frontend chamava `/api/v1/auth/register`, mas não existia
   nada respondendo nesse endereço em produção — a Vercel devolvia o próprio `index.html`, o que
   quebrava o cadastro/login.
2. **O "banco de dados" era só um array na memória** (`backend/src/common/supabase.service.ts`).
   Mesmo que o backend estivesse no ar, cada reinício apagaria todos os usuários cadastrados — e
   num ambiente serverless (que é o caso da Vercel) isso aconteceria toda hora. Reescrevi esse
   serviço e os outros 4 que dependiam dele para usar o Supabase de verdade, com as credenciais
   que já estavam no seu `.env.example`.

## Arquivos deste pacote

Copie estes arquivos por cima dos mesmos caminhos no seu projeto:

```
package.json                                     (raiz)
vercel.json                                       (raiz)
api/index.js                                      (novo)
backend/src/common/supabase.service.ts
backend/src/auth/auth.service.ts
backend/src/settings/settings.service.ts
backend/src/license/license.service.ts
backend/src/subscriptions/subscription.service.ts
backend/src/analytics/analytics.service.ts
```

## Passo a passo para colocar no ar (tudo grátis, mesmo projeto da Vercel)

1. **Rode o schema no Supabase** (se ainda não rodou): abra o SQL Editor do seu projeto Supabase
   e execute o conteúdo de `backend/database_schema.sql`. Isso cria as tabelas `users`, `plans`,
   `licenses`, `subscriptions`, `landing_settings` e `admin_logs`.

2. **Configure as variáveis de ambiente na Vercel** (Project Settings → Environment Variables).
   No mínimo, essas (pegue os valores reais no seu `backend/.env.example` / painel do Supabase):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (ex: `1d`)
   - `STRIPE_SECRET_KEY` / `MERCADOPAGO_ACCESS_TOKEN` / `OPENAI_API_KEY` (se for usar essas partes)

3. **Suba os arquivos deste pacote** para o seu repositório (substituindo os originais) e dê
   `git push`. A Vercel vai buildar de novo automaticamente.

4. Teste o cadastro em `https://voxcreatorshop.vercel.app/auth/register`.

## Um aviso importante de segurança

O seu `backend/.env.example` (e o `.env.example` da raiz) têm **chaves reais do Supabase
escritas dentro do arquivo** — incluindo a `SUPABASE_SERVICE_ROLE_KEY`, que dá acesso total ao
banco, ignorando qualquer regra de segurança. Se esse repositório já foi enviado pro GitHub
(mesmo em repo privado), o ideal é:
- Trocar (rotacionar) essa chave no painel do Supabase, e
- Colocar os valores reais só nas variáveis de ambiente da Vercel — nunca dentro de um arquivo
  `.env.example` que vai junto no código.

## O que eu NÃO mudei

- `products.service.ts` e `ai.service.ts` não usavam o banco em memória, então não mexi neles.
- O admin padrão (`admin@voxcreator.shop` / senha `admin123`) continua sendo criado automaticamente
  na primeira vez que o servidor sobe — troque essa senha depois de testar.
