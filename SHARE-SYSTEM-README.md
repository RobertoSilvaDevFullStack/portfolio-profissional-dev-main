# 🚀 Sistema de Compartilhamento Social para Blog

Este sistema adiciona funcionalidades completas de compartilhamento para LinkedIn e Instagram nos artigos do blog, com geração automática de texto otimizado e tracking de métricas.

## 📋 Funcionalidades Implementadas

### ✨ Compartilhamento Inteligente

- **LinkedIn**: Texto profissional com hashtags relevantes
- **Instagram**: Texto otimizado para Stories e Posts
- **Geração Automática**: Criação de resumos personalizados
- **Cópia de Link**: Compartilhamento rápido da URL

### 📊 Analytics e Métricas

- Tracking de compartilhamentos por plataforma
- Estatísticas em tempo real
- Histórico de compartilhamentos
- Dashboard admin com métricas

### 🎨 Interface Otimizada

- Botões de compartilhamento em cada artigo
- Modal completo com preview e edição
- Compartilhamento rápido nos cards
- Design responsivo e acessível

## 🛠️ Instalação e Configuração

### 1. Configure o Banco de Dados

Execute o script SQL no Supabase para criar as tabelas de métricas:

```sql
-- Cole o conteúdo do arquivo setup-share-metrics.sql no SQL Editor do Supabase
```

### 2. Componentes Criados

#### Componentes Principais:

- `SocialShareButton.tsx` - Modal completo de compartilhamento
- `ShareSection.tsx` - Seção de compartilhamento nos artigos
- `QuickShare.tsx` - Dropdown de compartilhamento rápido
- `ShareAnalytics.tsx` - Dashboard de métricas (admin)

#### Hook Personalizado:

- `useShare.ts` - Lógica de compartilhamento e tracking

### 3. Como Usar

#### No Artigo do Blog:

```tsx
import ShareSection from "@/components/ShareSection";

// Dentro do componente BlogPost
<ShareSection post={post} />;
```

#### Nos Cards do Blog:

```tsx
import QuickShare from "@/components/QuickShare";

// Dentro do PostCard
<QuickShare post={post} />;
```

#### No Admin (Métricas):

```tsx
import ShareAnalytics from '@/components/admin/ShareAnalytics';

// Para ver métricas gerais
<ShareAnalytics showOverall={true} />

// Para métricas de um post específico
<ShareAnalytics postId={postId} />
```

## 🎯 Funcionalidades por Plataforma

### LinkedIn

- ✅ Texto profissional com insights
- ✅ Hashtags relevantes (#desenvolvimento #tecnologia)
- ✅ Link direto para o artigo
- ✅ Abertura automática do LinkedIn
- ✅ Sugestão de call-to-action

### Instagram

- ✅ Texto visual com emojis
- ✅ Hashtags populares para alcance
- ✅ Instrução "link no perfil"
- ✅ Cópia automática do texto
- ✅ Abertura do Instagram

### Compartilhamento Nativo (Mobile)

- ✅ Detecção automática de suporte
- ✅ Fallback para cópia de link
- ✅ Compatibilidade total mobile/desktop

## 📊 Métricas e Analytics

### Dados Coletados:

- Plataforma de compartilhamento
- Data/hora do compartilhamento
- Post compartilhado
- User Agent (opcional)
- Referrer (opcional)

### Views Disponíveis:

- `post_share_stats` - Estatísticas por post
- `overall_share_stats` - Estatísticas gerais

### Função SQL:

```sql
-- Registrar compartilhamento
SELECT log_share('post-id', 'linkedin', 'user-agent', 'referrer');
```

## 🎨 Customização

### Modificar Textos Padrão:

```typescript
// No arquivo useShare.ts
const createLinkedInText = (post: Post) => {
  return `🚀 ${post.title}
  
${post.excerpt}

✨ Principais insights:
• Sua customização aqui
• Adicione mais pontos
• Personalize a mensagem

📖 Leia completo: ${url}

#seushashtags #personalizados`;
};
```

### Adicionar Nova Plataforma:

1. Adicione no enum do banco: `platform IN ('linkedin', 'instagram', 'copy', 'nova_plataforma')`
2. Crie função no `useShare.ts`
3. Adicione ícone e configuração nos componentes

### Personalizar Cores/Estilo:

```tsx
// Exemplo para nova plataforma
const platformConfig = {
  nova_plataforma: {
    icon: NovoIcone,
    name: "Nova Plataforma",
    color: "bg-sua-cor hover:bg-sua-cor-hover",
    maxChars: 1000,
    // ...
  },
};
```

## 🔧 Troubleshooting

### Erro: Tabela share_metrics não existe

```bash
# Execute o script SQL no Supabase
# Arquivo: setup-share-metrics.sql
```

### Erro: Função log_share não encontrada

```sql
-- Verifique se a função foi criada corretamente
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'log_share';
```

### Métricas não aparecem

1. Verifique as políticas RLS no Supabase
2. Confirme se o usuário tem permissões adequadas
3. Teste com dados mock primeiro

## 📱 Testes

### Testar Compartilhamento:

1. Abra um artigo do blog
2. Clique em "Compartilhar"
3. Teste cada plataforma
4. Verifique se as métricas são registradas

### Testar Analytics:

1. Acesse a área admin
2. Vá para o dashboard de analytics
3. Verifique se as métricas aparecem
4. Teste filtros por post/período

## 🚀 Próximas Melhorias

- [ ] Integração com API do LinkedIn para posting automático
- [ ] Suporte para WhatsApp e Telegram
- [ ] Agendamento de posts
- [ ] Templates de texto personalizáveis
- [ ] Relatórios avançados com gráficos
- [ ] A/B testing para textos de compartilhamento
- [ ] Integração com Google Analytics

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do console do navegador
2. Confirme as configurações do Supabase
3. Teste com dados de exemplo primeiro
4. Consulte a documentação dos componentes

---

**Desenvolvido com ❤️ para maximizar o alcance dos seus artigos!**
