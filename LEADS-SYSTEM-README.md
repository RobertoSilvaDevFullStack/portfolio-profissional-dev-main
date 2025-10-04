# 📊 Sistema de Gerenciamento de Leads

Sistema completo para gerenciar os contatos recebidos através do formulário de contato do portfolio.

## 🎯 Funcionalidades

### ✅ Lista de Leads

- Visualização de todos os leads cadastrados
- Informações exibidas: nome, email, telefone, data de cadastro e status
- Ordenação por data (mais recentes primeiro)
- Contadores de total de leads

### 🏷️ Sistema de Status

Os leads podem ter os seguintes status:

- **Novo** (new): Lead acabou de se cadastrar
- **Contatado** (contacted): Já foi feito o primeiro contato
- **Qualificado** (qualified): Lead demonstrou interesse real
- **Convertido** (converted): Lead virou cliente/projeto

### 🔍 Filtros e Busca

- Filtro por status para organizar os leads
- Visualização rápida da quantidade de leads por categoria

### 📋 Detalhes do Lead

Ao clicar em um lead, você pode ver:

- Informações completas (nome, email, telefone, mensagem)
- Data e hora exatos do cadastro
- Ações rápidas:
  - Enviar email direto
  - Abrir conversa no WhatsApp
  - Excluir lead

### 📥 Exportação

- Exportar todos os leads para arquivo CSV
- Formato compatível com Excel e Google Sheets
- Inclui todos os dados: nome, email, telefone, mensagem e data

### 🗑️ Gerenciamento

- Excluir leads com confirmação de segurança
- Interface intuitiva e responsiva
- Design consistente com o restante do painel admin

## 📁 Estrutura de Arquivos

```
src/
├── pages/admin/
│   └── ManageLeads.tsx       # Página principal de gerenciamento
├── components/admin/
│   ├── AdminLayout.tsx        # Layout com menu atualizado
│   └── DeleteConfirmationDialog.tsx  # Dialog de confirmação
└── App.tsx                    # Rotas atualizadas

supabase/migrations/
└── 0007_adicionar_coluna_status_na_tabela_leads.sql
```

## 🔧 Configuração

### 1. Executar Migração do Banco de Dados

Execute o script SQL no Supabase para adicionar a coluna de status:

```sql
-- Arquivo: supabase/migrations/0007_adicionar_coluna_status_na_tabela_leads.sql
```

Passos:

1. Acesse o Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole e execute o conteúdo do arquivo de migração
4. Verifique se aparece ✅ confirmando a criação

### 2. Estrutura da Tabela Leads

A tabela `leads` deve ter os seguintes campos:

```sql
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Acessar o Sistema

1. Faça login no painel admin: `/login`
2. No menu lateral, clique em "Gerenciar Leads"
3. Você será redirecionado para `/admin/leads`

## 🎨 Interface

### Cards de Estatísticas

- Total de leads cadastrados
- Filtro por status com dropdown

### Tabela de Leads

| Nome | Email          | Telefone        | Data             | Status  | Ações |
| ---- | -------------- | --------------- | ---------------- | ------- | ----- |
| João | joao@email.com | (11) 99999-9999 | 03/10/2025 14:30 | 🔵 Novo | 👁️ 🗑️ |

### Ações Disponíveis

- 👁️ **Ver Detalhes**: Abre modal com informações completas
- 🗑️ **Excluir**: Remove o lead após confirmação

### Modal de Detalhes

- Nome completo e data de cadastro formatada
- Email e telefone clicáveis (mailto: e tel:)
- Mensagem completa em área destacada
- Botões de ação:
  - ✉️ Enviar Email (abre cliente de email)
  - 📱 WhatsApp (abre WhatsApp Web/App)

## 🚀 Uso no Dia a Dia

### Fluxo Recomendado

1. **Novos Leads**

   - Verificar leads com status "Novo"
   - Ler a mensagem e avaliar o interesse
   - Entrar em contato via email ou WhatsApp

2. **Atualização de Status**

   - Após primeiro contato: mudar para "Contatado"
   - Se houver interesse real: "Qualificado"
   - Fechou negócio: "Convertido"

3. **Análise**

   - Usar filtros para ver leads por status
   - Exportar relatórios em CSV
   - Acompanhar taxa de conversão

4. **Limpeza**
   - Excluir leads spam ou duplicados
   - Manter base organizada

## 📊 Exportação de Dados

### Formato CSV

O arquivo exportado contém:

```csv
Nome,Email,Telefone,Mensagem,Data
"João Silva","joao@email.com","(11) 99999-9999","Mensagem aqui","03/10/2025 14:30"
```

### Como Usar

1. Clique no botão "Exportar CSV"
2. Arquivo será baixado automaticamente
3. Abra no Excel, Google Sheets ou qualquer editor de planilhas

## 🔒 Segurança

- ✅ Apenas usuários autenticados podem acessar
- ✅ Proteção via ProtectedRoute
- ✅ Confirmação antes de excluir
- ✅ RLS (Row Level Security) no Supabase
- ✅ Dados sensíveis protegidos

## 🎯 Benefícios

1. **Organização**

   - Todos os contatos em um só lugar
   - Sistema de status para acompanhamento
   - Filtros para encontrar leads específicos

2. **Produtividade**

   - Ações rápidas (email, WhatsApp)
   - Exportação para análise externa
   - Interface intuitiva e rápida

3. **Análise**

   - Contador no dashboard
   - Histórico de contatos
   - Possibilidade de gerar relatórios

4. **Profissionalismo**
   - Não perde nenhum contato
   - Resposta mais rápida
   - Melhor gestão do funil de vendas

## 🐛 Troubleshooting

### Não aparecem leads

1. Verifique se o formulário de contato está funcionando
2. Confirme que a tabela `leads` existe no Supabase
3. Verifique as políticas RLS da tabela

### Erro ao exportar CSV

1. Verifique se há leads cadastrados
2. Teste em outro navegador
3. Limpe o cache do navegador

### Erro ao excluir lead

1. Verifique permissões no Supabase
2. Confirme que você está autenticado
3. Veja o console para mensagens de erro

## 📝 Próximas Melhorias

- [ ] Adicionar notas aos leads
- [ ] Histórico de interações
- [ ] Email templates automáticos
- [ ] Dashboard de conversão
- [ ] Integração com CRM
- [ ] Notificações de novos leads
- [ ] Busca por nome/email
- [ ] Tags personalizadas

## 🤝 Contribuição

Para melhorias ou sugestões, abra uma issue ou PR no repositório.

---

**Desenvolvido com ❤️ para melhor gestão de contatos e leads do portfolio**
