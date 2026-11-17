# Financy

Aplicação full-stack para organização de finanças pessoais, com gestão de transações e categorias. Desafio prático da fase 3 da Pós Tech Developer 360 da Rocketseat.

## Tecnologias

**Back-end:** Node.js, TypeScript, GraphQL (Apollo Server + TypeGraphQL), Prisma e SQLite

**Front-end:** React, Vite, TypeScript, Apollo Client, Tailwind CSS, Radix UI, React Hook Form e Zod

## Como rodar

### Back-end

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Preencha o `JWT_SECRET` no `.env` com qualquer valor. A API sobe em `http://localhost:4000/graphql`.

### Front-end

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

No `.env` use `VITE_BACKEND_URL=http://localhost:4000/graphql`. A aplicação abre em `http://localhost:5173`.

## Funcionalidades

- Cadastro e login com JWT
- Cada usuário vê e gerencia apenas os próprios dados
- CRUD de transações com busca, filtros por tipo, categoria e período e paginação
- CRUD de categorias com ícone e cor
- Dashboard com saldo, receitas e despesas do mês, transações recentes e resumo por categoria
- Edição do nome no perfil
