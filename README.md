# 🚀 Portfólio Profissional - Roberto Vicente da Silva

> Portfólio moderno com painel administrativo completo, desenvolvido com React, TypeScript e Supabase.

[![Status](https://img.shields.io/badge/Status-Produção-success)](https://github.com/RobertoSilvaDevFullStack/portfolio-profissional-dev-main)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ Visão Geral

Portfólio profissional completo com sistema de blog, gerenciamento de projetos, sistema de comentários e um **painel administrativo robusto** com 10 módulos avançados para gestão de conteúdo, analytics, moderação e muito mais.

### 🎯 Funcionalidades Principais

#### 🌐 Website Público

- **Design Responsivo**: Totalmente adaptável a todos os dispositivos
- **Navegação Intuitiva**: Header fixo com scroll suave
- **Blog Interativo**: Sistema de posts com comentários e curtidas
- **Portfólio Dinâmico**: Showcase de projetos com carrossel
- **Formulário de Contato**: Sistema de leads integrado
- **SEO Otimizado**: Meta tags dinâmicas e Open Graph
- **WhatsApp Float**: Botão flutuante para contato rápido

#### 🔐 Painel Administrativo (10 Módulos)

1. **Dashboard Principal**

   - Métricas em tempo real (visitas, posts, projetos, leads)
   - Gráficos de analytics
   - Acesso rápido às funcionalidades

2. **Dashboard Customizável** ⭐ NOVO

   - Drag & drop de widgets
   - 6 widgets configuráveis
   - Persistência de layout
   - Totalmente responsivo

3. **Gestão de Blog**

   - Editor WYSIWYG com Markdown
   - Agendamento de posts
   - Gestão de SEO por post
   - Preview em tempo real

4. **Gestão de Projetos**

   - CRUD completo
   - Upload de imagens
   - Status e tags

5. **Moderação de Comentários**

   - Aprovação/rejeição
   - Marcação de spam
   - Resposta rápida
   - Filtros avançados

6. **Central de Notificações**

   - Notificações em tempo real
   - Badge com contador
   - Filtros por tipo e status
   - Navegação contextual

7. **Gestão de Leads**

   - Visualização de contatos
   - Status de atendimento
   - Notas e follow-up

8. **Busca Global**

   - Atalho Ctrl+K / Cmd+K
   - Busca em múltiplas tabelas
   - Resultados agrupados

9. **Backup e Restauração**

   - Export/Import de dados
   - Backup versionado
   - Validação de dados

10. **Logs de Auditoria**
    - Histórico completo de ações
    - Filtros avançados
    - Export de logs
    - Diff de alterações

## 🚀 Stack Tecnológica

### Frontend

- **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6.3.4](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Roteamento**: [React Router v6](https://reactrouter.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Carrossel**: [Embla Carousel](https://www.embla-carousel.com/)
- **Editor**: [react-quill](https://github.com/zenoamaro/react-quill)
- **Grid Layout**: [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Datas**: [date-fns](https://date-fns.org/) (ptBR)

### Backend & Infraestrutura

- **BaaS**: [Supabase](https://supabase.com/)
  - PostgreSQL Database
  - Authentication
  - Realtime Subscriptions
  - Edge Functions
  - Storage
- **Segurança**: Row Level Security (RLS)
- **Deploy**: [Vercel](https://vercel.com/) (recomendado)

### Ferramentas de Desenvolvimento

- **Package Manager**: pnpm
- **Linter**: ESLint
- **Formatter**: Prettier (implícito)
- **Git**: Conventional Commits

## 📂 Estrutura do Projeto

```
portfolio-profissional-dev-main/
├── 📚 docs/                          # Documentação
│   ├── sql-scripts/                  # Migrations SQL
│   ├── ADMIN-IMPROVEMENTS.md         # Sugestões de melhorias
│   ├── IMPLEMENTATION-PLAN.md        # Plano de implementação
│   ├── RESUMO-FASES-IMPLEMENTADAS.md # Resumo das 10 fases
│   ├── PROJETO-FINALIZADO.md         # Documento de conclusão
│   └── *.md                          # Outras documentações
│
├── 🎨 public/                        # Assets estáticos
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── 💻 src/
│   ├── components/                   # Componentes React
│   │   ├── admin/                   # 🔐 Admin components
│   │   │   ├── AdminLayout.tsx      # Layout base do admin
│   │   │   ├── GlobalSearch.tsx     # Busca global (Ctrl+K)
│   │   │   ├── RichTextEditor.tsx   # Editor WYSIWYG
│   │   │   ├── NotificationBell.tsx # Notificações realtime
│   │   │   └── VisitChart.tsx       # Gráfico de visitas
│   │   │
│   │   ├── comments/                # 💬 Sistema de comentários
│   │   │   ├── CommentsSection.tsx
│   │   │   ├── Comment.tsx
│   │   │   └── CommentForm.tsx
│   │   │
│   │   ├── ui/                      # 🎨 shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ components)
│   │   │
│   │   ├── AboutSection.tsx         # Seções do site público
│   │   ├── BlogSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SEO.tsx                  # Meta tags dinâmicas
│   │   └── FloatingWhatsApp.tsx
│   │
│   ├── contexts/                    # ⚙️ React Contexts
│   │   └── AuthContext.tsx          # Autenticação
│   │
│   ├── hooks/                       # 🎣 Custom Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/                # 🔌 Integrações
│   │   └── supabase/
│   │       └── client.ts            # Cliente Supabase
│   │
│   ├── lib/                         # 📦 Utilities
│   │   └── utils.ts
│   │
│   ├── pages/                       # 📄 Páginas
│   │   ├── admin/                   # 🔐 Painel Admin
│   │   │   ├── Dashboard.tsx        # Dashboard principal
│   │   │   ├── CustomDashboard.tsx  # Dashboard customizável ⭐
│   │   │   ├── ManageBlog.tsx       # Gestão de posts
│   │   │   ├── ManageProjects.tsx   # Gestão de projetos
│   │   │   ├── ManageComments.tsx   # Moderação
│   │   │   ├── ManageLeads.tsx      # Gestão de leads
│   │   │   ├── Notifications.tsx    # Notificações
│   │   │   ├── Backup.tsx           # Backup/Restore
│   │   │   └── AuditLogs.tsx        # Logs de auditoria
│   │   │
│   │   ├── Index.tsx                # Homepage
│   │   ├── BlogPost.tsx             # Página de post
│   │   ├── Login.tsx                # Login admin
│   │   └── NotFound.tsx             # 404
│   │
│   ├── utils/                       # 🛠️ Helpers
│   │   └── toast.ts
│   │
│   ├── App.tsx                      # 🚀 Router config
│   ├── main.tsx                     # Entry point
│   ├── globals.css                  # Estilos globais
│   └── vite-env.d.ts
│
├── 🗄️ supabase/                     # Supabase config
│   ├── functions/                   # Edge Functions
│   │   └── publish-scheduled-posts/ # Publicação automática
│   │
│   └── migrations/                  # Database migrations
│       ├── 0001_*.sql
│       ├── 0002_*.sql
│       └── 0012_criar_tabela_audit_logs.sql
│
├── 📝 Configurações
│   ├── .env.example                 # Exemplo de env vars
│   ├── components.json              # shadcn/ui config
│   ├── eslint.config.js             # ESLint
│   ├── postcss.config.js            # PostCSS
│   ├── tailwind.config.ts           # Tailwind CSS
│   ├── tsconfig.json                # TypeScript
│   ├── vite.config.ts               # Vite
│   ├── vercel.json                  # Vercel deploy
│   ├── package.json                 # Dependencies
│   ├── pnpm-lock.yaml               # Lock file
│   ├── AI_RULES.md                  # Regras para IA
│   └── README.md                    # Este arquivo
```

## 🏁 Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (recomendado) ou npm
- Conta no [Supabase](https://supabase.com)

### Instalação

**1. Clone o repositório:**

```bash
git clone https://github.com/RobertoSilvaDevFullStack/portfolio-profissional-dev-main.git
cd portfolio-profissional-dev-main
```

**2. Instale as dependências:**

```bash
pnpm install
# ou
npm install
```

**3. Configure as variáveis de ambiente:**

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**4. Configure o banco de dados:**

No painel do Supabase, execute as migrations SQL da pasta `supabase/migrations/` em ordem numérica (0001 até 0012).

**5. Inicie o servidor:**

```bash
pnpm dev
# ou
npm run dev
```

Acesse:

- **Site público**: http://localhost:8080
- **Painel admin**: http://localhost:8080/admin

### Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para produção
pnpm preview      # Preview da build
pnpm lint         # Executa ESLint
```

## 🔧 Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização e projeto
3. Anote a **URL do projeto** e **chave anônima**

### 2. Configurar Variáveis

Copie as credenciais para `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Executar Migrations

No painel do Supabase (SQL Editor), execute em ordem:

```bash
supabase/migrations/
├── 0001_*.sql  # Políticas do bucket blog-assets
├── 0002_*.sql  # Políticas do bucket project-assets
├── 0003_*.sql  # Tabela profiles
├── 0004_*.sql  # Trigger de perfil automático
├── 0005_*.sql  # Tabela comments
├── 0006_*.sql  # Tabela comment_likes
└── 0012_*.sql  # Tabela audit_logs (logs de auditoria)
```

### 4. Configurar Buckets

No Supabase Storage, crie os buckets:

- `blog-assets` (público)
- `project-assets` (público)
- `site-assets` (público)

### 5. Edge Function (Opcional)

Para agendamento de posts:

```bash
# Instale o CLI
npm install -g supabase

# Deploy da função
cd supabase/functions/publish-scheduled-posts
supabase functions deploy publish-scheduled-posts
```

### Estrutura do Banco

**Tabelas principais:**

- `posts` - Posts do blog
- `projects` - Projetos do portfólio
- `leads` - Contatos/leads
- `comments` - Comentários dos posts
- `comment_likes` - Curtidas nos comentários
- `profiles` - Perfis de usuários
- `page_visits` - Analytics de visitas
- `notifications` - Notificações do sistema
- `audit_logs` - Logs de auditoria ⭐

**Recursos:**

- ✅ Row Level Security (RLS) habilitado
- ✅ Realtime subscriptions configuradas
- ✅ Triggers automáticos
- ✅ Índices otimizados
- ✅ Função de cleanup automático

## � Documentação

Toda a documentação do projeto está na pasta `docs/`:

| Documento                         | Descrição                          |
| --------------------------------- | ---------------------------------- |
| **PROJETO-FINALIZADO.md**         | 🎉 Documento de conclusão oficial  |
| **RESUMO-FASES-IMPLEMENTADAS.md** | 📊 Resumo detalhado das 10 fases   |
| **IMPLEMENTATION-PLAN.md**        | 📋 Plano de implementação original |
| **ADMIN-IMPROVEMENTS.md**         | 💡 Sugestões de melhorias futuras  |
| **sql-scripts/**                  | 🗄️ Migrations SQL do Supabase      |

### Guias Rápidos

#### Como usar o Dashboard Customizável

```
1. Acesse /admin/custom-dashboard
2. Arraste widgets para reorganizar
3. Redimensione pelas bordas
4. Clique em "Configurar Widgets" para mostrar/ocultar
5. Clique em "Salvar Layout" para persistir
6. Use "Resetar" para voltar ao padrão
```

#### Como usar a Busca Global

```
1. Pressione Ctrl+K (ou Cmd+K no Mac)
2. Digite o termo de busca
3. Navegue com ↑↓
4. Pressione Enter para ir ao item
5. Esc para fechar
```

#### Como agendar um post

```
1. Acesse /admin/blog
2. Crie ou edite um post
3. Selecione data/hora futura
4. Salve como "scheduled"
5. Edge function publica automaticamente
```

## 🎯 Recursos Destacados

### 🎨 Dashboard Customizável

O dashboard permite personalização completa:

- **6 Widgets disponíveis**: Stats cards + gráficos
- **Drag & Drop**: Reorganize livremente
- **Resize**: Ajuste o tamanho de cada widget
- **Persistência**: Layout salvo no localStorage
- **Responsive**: Adapta-se a qualquer tela

### ✏️ Editor WYSIWYG

Editor rico com suporte a Markdown:

- **Toolbar completa**: Negrito, itálico, links, imagens, listas
- **3 modos**: Editor / Preview / Markdown
- **Auto-save**: Ctrl+S para salvar
- **Contador**: Palavras e caracteres
- **Dark theme**: Totalmente integrado

### 🔍 Busca Global

Busca rápida em todo o admin:

- **Atalho**: Ctrl+K / Cmd+K
- **Multi-tabela**: Posts, projetos, leads
- **Agrupada**: Resultados por categoria
- **Navegação**: Por teclado ou mouse

### 📊 Logs de Auditoria

Rastreamento completo de ações:

- **Histórico**: Todas as operações registradas
- **Diff**: Comparação old_data vs new_data
- **Filtros**: Por ação, entidade, usuário
- **Export**: JSON para análise externa

### 💾 Backup e Restauração

Sistema robusto de backup:

- **Export completo**: Todas as tabelas em JSON
- **Export individual**: Por tabela
- **Versionado**: Timestamp em cada backup
- **Import validado**: Previne dados corrompidos

## � Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RobertoSilvaDevFullStack/portfolio-profissional-dev-main)

**Passo a passo:**

1. Faça fork do repositório
2. Conecte seu GitHub ao Vercel
3. Importe o projeto
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy! 🚀

### Outras Plataformas

O projeto também funciona em:

- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas etapas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração sem mudança de comportamento
test: adiciona ou atualiza testes
chore: tarefas de build/config
```

## 📊 Status do Projeto

```
✅ Website Público: 100% Completo
✅ Painel Admin: 100% Completo (10/10 módulos)
✅ Sistema de Blog: 100% Completo
✅ Sistema de Comentários: 100% Completo
✅ Analytics: 100% Completo
✅ Documentação: 100% Completa
```

### Roadmap Futuro (Opcional)

Sugestões para expansão:

- [ ] Sistema de Tags e Categorias
- [ ] Perfil do Administrador
- [ ] Relatórios em PDF
- [ ] Modo Claro/Escuro Toggle
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Testes Automatizados

## �📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Roberto Vicente da Silva**

- 💼 Full Stack Developer
- 🌐 [Portfólio](https://seu-portfolio.vercel.app)
- 📧 Email: [Contato via portfólio]
- 💻 GitHub: [@RobertoSilvaDevFullStack](https://github.com/RobertoSilvaDevFullStack)

## 🙏 Agradecimentos

Tecnologias e ferramentas que tornaram este projeto possível:

- [React Team](https://react.dev/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- Toda a comunidade open source! 💙

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

**Desenvolvido com 💙 e ☕**

[⬆ Voltar ao topo](#-portfólio-profissional---roberto-vicente-da-silva)

</div>
