# Portfólio Pessoal - Roberto Vicente da Silva

Este é o repositório do meu portfólio pessoal, desenvolvido para apresentar minhas habilidades, projetos e experiência como Desenvolvedor Full-Stack. O site foi construído com tecnologias modernas, focando em uma experiência de usuário limpa, responsiva e profissional.

## ✨ Funcionalidades

- **Design Responsivo**: Totalmente adaptável a desktops, tablets e dispositivos móveis.
- **Navegação Intuitiva**: Header fixo com links que levam suavemente às seções da página.
- **Seções Detalhadas**:
  - **Início**: Apresentação inicial e call-to-action.
  - **Sobre Mim**: Perfil profissional e resumo da experiência.
  - **Serviços**: Descrição dos serviços oferecidos com ícones ilustrativos.
  - **Habilidades**: Exibição dinâmica de tecnologias com ícones do [Skill Icons](https://skillicons.dev/).
  - **Projetos**: Carrossel interativo para exibir os principais trabalhos.
  - **Contato**: Formulário para contato direto.
- **Componentes Reutilizáveis**: Construído com uma arquitetura baseada em componentes para fácil manutenção e escalabilidade.
- **Contato Rápido**: Botão flutuante do WhatsApp para comunicação instantânea.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **Frontend**:
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
- **Estilização**:
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
- **Roteamento**:
  - [React Router](https://reactrouter.com/)
- **Ícones**:
  - [Lucide React](https://lucide.dev/)
- **Carrossel**:
  - [Embla Carousel](https://www.embla-carousel.com/)

## 📂 Estrutura do Projeto

O projeto segue uma estrutura organizada para facilitar a manutenção:

```
/
├── public/              # Arquivos estáticos (imagens, fontes)
├── src/
│   ├── components/      # Componentes reutilizáveis (Header, Footer, Cards)
│   │   └── ui/          # Componentes base do shadcn/ui
│   ├── pages/           # Páginas principais da aplicação (Index, NotFound)
│   ├── lib/             # Funções utilitárias
│   ├── App.tsx          # Configuração de rotas
│   ├── main.tsx         # Ponto de entrada da aplicação
│   └── globals.css      # Estilos globais e configuração do Tailwind
├── package.json         # Dependências e scripts do projeto
└── tailwind.config.ts   # Configurações do Tailwind CSS
```

## 🏁 Como Executar Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

**1. Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Abra [http://localhost:8080](http://localhost:8080) no seu navegador para ver o projeto em execução.

## 🛠️ Como Personalizar

Você pode facilmente adaptar este portfólio para seu uso pessoal:

- **Informações Pessoais**: Altere os textos nos arquivos `src/components/HeroSection.tsx` e `src/components/AboutSection.tsx`.
- **Projetos**: Modifique o array `projects` em `src/components/PortfolioSection.tsx` para adicionar seus próprios projetos.
- **Habilidades**: Atualize o objeto `skills` em `src/components/SkillsSection.tsx` com as tecnologias que você domina.
- **Contato**: Atualize as informações de contato em `src/components/ContactSection.tsx` e o link do WhatsApp em `src/components/FloatingWhatsApp.tsx`.
- **Imagens**: Substitua as imagens de placeholder na pasta `public/` pelas suas.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.