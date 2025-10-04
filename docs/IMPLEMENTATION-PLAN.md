# 🚀 Plano de Implementação - Melhorias do Painel Admin

**Data de Início:** 03/10/2025  
**Status:** 🟡 Em Andamento

---

## 📋 Checklist de Implementação

### ✅ Fase 0: Organização do Projeto

- [x] Criar pasta `docs/` para documentação
- [x] Criar pasta `docs/sql-scripts/` para scripts SQL
- [x] Mover arquivos de documentação para `docs/`
- [x] Mover scripts SQL para `docs/sql-scripts/`
- [x] Criar este plano de implementação
- [ ] Commit: "chore: organizar estrutura do projeto e documentação"

---

### ✅ Fase 1: Sistema de Moderação de Comentários

**Prioridade:** ⭐⭐⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Baixa

#### Tarefas:

- [x] Criar página `src/pages/admin/ManageComments.tsx`
- [x] Adicionar rota no `App.tsx`
- [x] Adicionar menu no `AdminLayout.tsx`
- [x] Implementar listagem de comentários
- [x] Implementar filtros (todos, pendentes, aprovados, spam)
- [x] Adicionar ações: aprovar, rejeitar, excluir, marcar spam
- [x] Criar componente de resposta rápida
- [x] Adicionar notificação de novos comentários
- [x] Testar todas as funcionalidades
- [x] Commit: "feat: adicionar sistema de moderação de comentários"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** 078c20b

#### Arquivos a criar/modificar:

- `src/pages/admin/ManageComments.tsx` (novo)
- `src/App.tsx` (modificar)
- `src/components/admin/AdminLayout.tsx` (modificar)

---

### ✅ Fase 2: Analytics Avançado

**Prioridade:** ⭐⭐⭐⭐⭐  
**Tempo Estimado:** 3-4 horas  
**Complexidade:** Média

#### Tarefas:

- [x] Criar componente `src/components/admin/AdvancedAnalytics.tsx`
- [x] Adicionar gráfico de linha com comparação de períodos
- [x] Adicionar gráfico de barras interativo
- [x] Implementar filtros de data (7, 30, 90 dias)
- [x] Adicionar métricas de conversão
- [x] Criar gráfico de pizza para fontes de tráfego
- [x] Implementar exportação de dados (CSV)
- [x] Integrar no Dashboard
- [x] Testar todas as visualizações
- [x] Commit: "feat: adicionar analytics avançado no dashboard"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** c446191

#### Arquivos a criar/modificar:

- `src/components/admin/AdvancedAnalytics.tsx` (novo)
- `src/pages/admin/Dashboard.tsx` (modificar)  
  **Complexidade:** Média

#### Tarefas:

- [ ] Criar componente `src/components/admin/AdvancedAnalytics.tsx`
- [ ] Adicionar gráfico de tendências (7, 30, 90 dias)
- [ ] Implementar comparação entre períodos
- [ ] Adicionar métricas de posts mais populares
- [ ] Criar visualização de origem de tráfego
- [ ] Implementar taxa de conversão de leads
- [ ] Adicionar filtros de período
- [ ] Criar cards de métricas detalhadas
- [ ] Integrar no Dashboard
- [ ] Testar todos os gráficos
- [ ] Commit: "feat: adicionar analytics avançado no dashboard"

#### Arquivos a criar/modificar:

- `src/components/admin/AdvancedAnalytics.tsx` (novo)
- `src/components/admin/ConversionRateChart.tsx` (novo)
- `src/components/admin/PopularPostsChart.tsx` (novo)
- `src/pages/admin/Dashboard.tsx` (modificar)

---

### ✅ Fase 3: Central de Notificações

**Prioridade:** ⭐⭐⭐⭐  
**Tempo Estimado:** 3-4 horas  
**Complexidade:** Média

#### Tarefas:

- [x] Criar tabela `notifications` no Supabase
- [x] Criar componente `src/components/admin/NotificationCenter.tsx`
- [x] Implementar dropdown de notificações no header
- [x] Adicionar badge com contador
- [x] Criar tipos de notificação (lead, comentário, meta)
- [x] Implementar marcação de lido/não lido
- [x] Adicionar som/toast de nova notificação
- [x] Criar página de histórico
- [x] Implementar configurações de preferências
- [x] Testar em tempo real
- [x] Commit: "feat: adicionar central de notificações em tempo real"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** 70b9445

#### Arquivos a criar/modificar:

- `supabase/migrations/0009_criar_tabela_notifications.sql` (novo)
- `src/components/admin/NotificationCenter.tsx` (novo)
- `src/components/admin/NotificationBell.tsx` (novo)
- `src/pages/admin/Notifications.tsx` (novo)
- `src/components/admin/AdminLayout.tsx` (modificar)
- `src/App.tsx` (modificar)

---

### � Fase 4: Sistema de Agendamento de Posts

**Prioridade:** ⭐⭐⭐⭐  
**Tempo Estimado:** 3-4 horas  
**Complexidade:** Média

#### Tarefas:

- [x] Adicionar campo `status` e `scheduled_at` na tabela posts
- [x] Criar componente de seleção de data/hora
- [x] Implementar salvamento como rascunho
- [x] Adicionar preview antes de agendar
- [x] Criar fila de publicação visual
- [x] Implementar publicação automática (edge function)
- [x] Adicionar filtros por status (rascunho, agendado, publicado)
- [x] Criar notificação ao publicar
- [x] Testar agendamento e publicação
- [x] Commit: "feat: adicionar sistema de agendamento de posts"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** 4c7b86e

#### Arquivos a criar/modificar:

- `supabase/migrations/0010_adicionar_agendamento_posts.sql` (novo)
- `supabase/functions/publish-scheduled-posts/index.ts` (novo)
- `src/components/admin/PostScheduler.tsx` (novo)
- `src/pages/admin/ManageBlog.tsx` (modificar)

---

### ✅ Fase 5: Gestão de SEO

**Prioridade:** ⭐⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Média

#### Tarefas:

- [x] Criar componente `src/components/admin/SEOEditor.tsx`
- [x] Adicionar campos de meta tags
- [x] Implementar preview do Google
- [x] Implementar preview do Facebook/LinkedIn
- [x] Criar análise de SEO score
- [x] Adicionar sugestões de melhorias
- [x] Implementar contador de caracteres
- [x] Integrar no editor de posts
- [x] Testar previews
- [x] Commit: "feat: adicionar gestão de SEO com previews"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** 965f7d5

#### Arquivos a criar/modificar:

- `src/components/admin/SEOEditor.tsx` (novo)
- `src/components/admin/GooglePreview.tsx` (novo)
- `src/components/admin/SocialPreview.tsx` (novo)
- `src/components/admin/SEOScore.tsx` (novo)
- `supabase/migrations/0011_adicionar_campos_seo_posts.sql` (novo)
- `src/pages/admin/ManageBlog.tsx` (modificar)

---

### ✅ Fase 6: Busca Global

**Prioridade:** ⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Média

#### Tarefas:

- [x] Criar componente `src/components/admin/GlobalSearch.tsx`
- [x] Implementar busca em posts, projetos, leads
- [x] Adicionar atalho de teclado (Ctrl+K)
- [x] Criar modal de resultados
- [x] Implementar agrupamento por tipo
- [x] Adicionar highlighting de termos
- [x] Criar histórico de buscas
- [x] Integrar no header do admin
- [x] Adicionar debounce na busca
- [x] Badges de tipo e status
- [x] Commit: "feat: adicionar busca global com Ctrl+K"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** 873aee2

#### Arquivos criados/modificados:

- `src/components/admin/GlobalSearch.tsx` (novo)
- `src/components/admin/AdminLayout.tsx` (modificado)

---

### ✏️ Fase 7: Editor de Posts Aprimorado

**Prioridade:** ⭐⭐⭐⭐  
**Tempo Estimado:** 3-4 horas  
**Complexidade:** Alta

#### Tarefas:

- [x] Instalar dependências do editor (react-quill ou similar)
- [x] Criar componente `src/components/admin/RichTextEditor.tsx`
- [x] Implementar toolbar com formatação
- [x] Adicionar suporte a Markdown
- [x] Implementar preview em tempo real
- [x] Adicionar upload de imagens inline
- [x] Criar atalhos de teclado (Ctrl+B, Ctrl+I, etc)
- [x] Implementar contador de palavras
- [x] Adicionar auto-save (draft automático)
- [x] Integrar no ManageBlog.tsx
- [x] Criar MarkdownPreview.tsx
- [x] Testar todas as funcionalidades
- [x] Commit: "feat: adicionar editor de posts aprimorado com WYSIWYG"

**Status:** ✅ Concluído  
**Data:** 03/10/2025  
**Commit:** [pendente]

#### Arquivos criados/modificados:

- `src/components/admin/RichTextEditor.tsx` (novo)
- `src/components/admin/MarkdownPreview.tsx` (novo)
- `src/pages/admin/ManageBlog.tsx` (modificar)
- `package.json` (adicionar dependências)

---

### � Fase 8: Backup e Restauração

**Prioridade:** ⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Baixa

#### Tarefas:

- [ ] Criar página `src/pages/admin/Profile.tsx`
- [ ] Implementar edição de dados pessoais
- [ ] Adicionar upload de foto de perfil
- [ ] Criar formulário de troca de senha
- [ ] Implementar configurações de notificações
- [ ] Adicionar histórico de atividades
- [ ] Mostrar sessões ativas
- [ ] Integrar no menu do admin
- [ ] Testar todas as edições
- [ ] Commit: "feat: adicionar página de perfil do administrador"

#### Arquivos a criar/modificar:

- `src/pages/admin/Profile.tsx` (novo)
- `src/components/admin/ProfileSettings.tsx` (novo)
- `src/components/admin/PasswordChange.tsx` (novo)
- `src/components/admin/AdminLayout.tsx` (modificar)

---

### 🏷️ Fase 8: Sistema de Tags e Categorias

**Prioridade:** ⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Baixa

#### Tarefas:

- [ ] Criar tabelas `tags` e `post_tags` no Supabase
- [ ] Criar página `src/pages/admin/ManageTags.tsx`
- [ ] Implementar CRUD de tags
- [ ] Adicionar seletor de tags no editor de posts
- [ ] Criar filtro por tags
- [ ] Implementar tag cloud
- [ ] Adicionar sugestões automáticas
- [ ] Mostrar tags populares
- [ ] Testar associações
- [ ] Commit: "feat: adicionar sistema de tags e categorias"

#### Arquivos a criar/modificar:

- `docs/sql-scripts/create-tags-system.sql` (novo)
- `src/pages/admin/ManageTags.tsx` (novo)
- `src/components/admin/TagSelector.tsx` (novo)
- `src/pages/admin/ManageBlog.tsx` (modificar)

---

### 📊 Fase 9: Relatórios Exportáveis

**Prioridade:** ⭐⭐⭐  
**Tempo Estimado:** 2-3 horas  
**Complexidade:** Média

#### Tarefas:

- [ ] Criar componente `src/components/admin/ReportGenerator.tsx`
- [ ] Implementar exportação em CSV
- [ ] Implementar exportação em PDF
- [ ] Adicionar seletor de período
- [ ] Criar templates de relatórios
- [ ] Implementar gráficos para PDF
- [ ] Adicionar agendamento de relatórios
- [ ] Testar exportações
- [ ] Commit: "feat: adicionar geração de relatórios exportáveis"

#### Arquivos a criar/modificar:

- `src/components/admin/ReportGenerator.tsx` (novo)
- `src/utils/reportExport.ts` (novo)
- `src/pages/admin/Dashboard.tsx` (modificar)

---

### 🌓 Fase 10: Modo Escuro/Claro Toggle

**Prioridade:** ⭐⭐  
**Tempo Estimado:** 1-2 horas  
**Complexidade:** Baixa

#### Tarefas:

- [ ] Criar context `src/contexts/ThemeContext.tsx`
- [ ] Implementar toggle no header
- [ ] Adicionar persistência no localStorage
- [ ] Criar temas claro e escuro
- [ ] Atualizar todas as cores
- [ ] Testar em todas as páginas
- [ ] Commit: "feat: adicionar modo escuro/claro no admin"

#### Arquivos a criar/modificar:

- `src/contexts/ThemeContext.tsx` (novo)
- `src/components/admin/ThemeToggle.tsx` (novo)
- `src/components/admin/AdminLayout.tsx` (modificar)

---

## 📊 Status Geral

| Fase | Nome                  | Prioridade | Status          | Data Conclusão |
| ---- | --------------------- | ---------- | --------------- | -------------- |
| 0    | Organização           | ⭐⭐⭐⭐⭐ | 🟡 Em andamento | -              |
| 1    | Moderação Comentários | ⭐⭐⭐⭐⭐ | ⚪ Pendente     | -              |
| 2    | Analytics Avançado    | ⭐⭐⭐⭐⭐ | ⚪ Pendente     | -              |
| 3    | Notificações          | ⭐⭐⭐⭐   | ⚪ Pendente     | -              |
| 4    | Agendamento Posts     | ⭐⭐⭐⭐   | ⚪ Pendente     | -              |
| 5    | Gestão SEO            | ⭐⭐⭐⭐   | ⚪ Pendente     | -              |
| 6    | Busca Global          | ⭐⭐⭐     | ⚪ Pendente     | -              |
| 7    | Perfil Admin          | ⭐⭐⭐     | ⚪ Pendente     | -              |
| 8    | Tags e Categorias     | ⭐⭐⭐     | ⚪ Pendente     | -              |
| 9    | Relatórios            | ⭐⭐⭐     | ⚪ Pendente     | -              |
| 10   | Modo Escuro           | ⭐⭐       | ⚪ Pendente     | -              |

---

## 🎯 Legenda de Status

- ⚪ **Pendente** - Ainda não iniciado
- 🟡 **Em Andamento** - Sendo implementado
- 🟢 **Concluído** - Implementado e testado
- 🔴 **Bloqueado** - Aguardando dependência
- ⏸️ **Pausado** - Temporariamente suspenso

---

## 📝 Notas de Implementação

### Convenções:

- Todos os commits seguem o padrão Conventional Commits
- Testes devem ser realizados antes de cada commit
- Documentação deve ser atualizada conforme necessário
- Cada fase deve ser independente sempre que possível

### Dependências:

- Supabase configurado e funcionando
- Node.js e pnpm instalados
- Ambiente de desenvolvimento configurado

---

**Última Atualização:** 03/10/2025 às 14:30
