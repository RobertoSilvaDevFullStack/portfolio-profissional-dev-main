import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProjects() {
    try {
        console.log('🌱 Iniciando seed de projetos...');

        const projects = [
            {
                id: '2a7a42d6-9344-462e-ba7a-13350c06d1dd',
                title: 'Site Janice Correia – Comunicação, Oratória e Performance ✨',
                description: '- 🎨 Design limpo e consistente com o branding\n- 📱 Layout totalmente responsivo e mobile-first\n- ⚡ Performance otimizada (imagens responsivas com <picture>, WebP/JPG, preload do hero)\n- 🗣️ Depoimentos com fluxo completo (cadastro, aprovação no admin e exibição na Home)\n- 📤 Upload seguro e entrega de mídia via API + /uploads\n- 🎞️ Transições acessíveis e suaves (direção, delay, threshold, stagger)\n- 🧭 Navegação clara entre serviços\n- 🔎 SEO preparado (metatags, títulos hierárquicos, conteúdo estruturado)\n- 🔐 Segurança com HTTPS e CORS bem configurados',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/site-janice-correia-comunicacao-corporativa-e-oratoria/site-janice-correia-comunicacao-corporativa-e-oratoria-1764357281155.jpeg',
                projectUrl: 'https://www.janicecorreia.com.br/',
                technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Express', 'PostgreSQL', 'Multer', 'Nginx/EasyPanel'],
            },
            {
                id: '3df2da72-f7c1-4761-8e26-37b2c08c8bbf',
                title: '🛒 Loja Dev - Sua Loja Virtual Completa!',
                description: 'Uma plataforma de e-commerce moderna e responsiva com:\n\n✨ Interface intuitiva e amigável\n🛍️ Sistema de catálogo de produtos\n🔐 Área administrativa segura\n📱 Design responsivo para todos os dispositivos\n🛒 Carrinho de compras integrado\n⚡ Performance otimizada',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/loja-dev-sua-loja-virtual-completa/loja-dev-sua-loja-virtual-completa-1757541837444.jpeg',
                projectUrl: 'https://loja-dev-hazel.vercel.app/index.html',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'GitHub', 'Vercel'],
            },
            {
                id: '4a6a29bf-7b3f-49c5-ae4c-ee58db2049cf',
                title: '🎬 Alura Play - Sua Plataforma de Vídeos',
                description: 'Uma plataforma de streaming moderna inspirada na Alura com:\n\n✨ Interface elegante e intuitiva tipo Netflix\n📺 Player de vídeo integrado e responsivo\n🔍 Sistema de busca e categorização de conteúdos\n📱 Design responsivo para todos os dispositivos\n🎨 UI/UX cuidadosamente elaborada\n⚡ Performance otimizada para streaming',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/alura-play-sua-plataforma-de-videos/alura-play-sua-plataforma-de-videos-1757543516234.jpeg',
                projectUrl: 'https://alura-play-kappa-five.vercel.app/',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Git', 'GitHub', 'Vercel'],
            },
            {
                id: '4f363059-bd97-448c-81a3-43517b42cd44',
                title: '🌠 Loja Meteora - E-commerce de Moda Moderno',
                description: 'Uma plataforma de e-commerce especializada em moda com:\n\n✨ Design elegante e contemporâneo\n👗 Catálogo de produtos organizado por categorias\n🔍 Sistema de busca e filtros avançados\n🛒 Carrinho de compras intuitivo\n📱 Layout totalmente responsivo\n⚡ Desempenho otimizado\n🔐 Sistema seguro de autenticação',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/loja-meteora-e-commerce-full-stack-com-angular/loja-meteora-e-commerce-full-stack-com-angular-1757540988775.jpeg',
                projectUrl: 'https://loja-meteora-bay.vercel.app/',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Bootstrap'],
            },
            {
                id: '6c22b39c-a7bc-418c-9fb0-3350297fcfff',
                title: 'SepphiTeam F1 — Simulador de Corridas e Gestão de Temporadas',
                description: 'SepphiTeam F1 é um simulador em Java que modela pilotos, carros, corridas e a classificação de uma temporada. Ideal para estudo de POO, simulação, testes e para estender com persistência ou UI.',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/sepphiteam-f1-simulador-de-corridas-e-gestao-de-temporadas/sepphiteam-f1-simulador-de-corridas-e-gestao-de-temporadas-1760575531610.jpeg',
                projectUrl: 'https://github.com/RobertoSilvaDevFullStack/SepphiTeamF1.git',
                technologies: ['Java', 'Maven'],
            },
            {
                id: '92f678cc-6c43-4cc4-ac84-1bf7a8d6d143',
                title: '🎮 Kahoot Marketing - Quiz Interativo em Tempo Real',
                description: 'Um quiz interativo estilo Kahoot otimizado para eventos e apresentações corporativas com:\n\n✨ Interface moderna e engajadora\n📱 Sistema dual: apresentador e participante\n⚡ Comunicação em tempo real via WebSocket\n📊 Visualização de dados dinâmica com gráficos\n🔗 QR Code integrado\n💾 PostgreSQL para persistência',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/kahoot-marketing/kahoot-marketing-1764357187445.jpeg',
                projectUrl: 'https://hotel-marketing-quiz-production.up.railway.app/',
                technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Railway', 'Recharts'],
            },
            {
                id: 'c44b5a0e-7c1b-4a6c-9764-d46ff1757179',
                title: '💆‍♀️ Calmaria Spa - Experiência Wellness Completa',
                description: 'Site institucional e sistema de agendamento para spa com:\n\n✨ Design relaxante e interface serena\n📅 Sistema de agendamento de serviços integrado\n👨‍💼 Área administrativa para gestão\n📱 Layout totalmente responsivo\n🔐 Autenticação segura de usuários\n💼 Painel de gerenciamento completo',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/projeto-calmaria-spa-plataforma-web-full-stack/projeto-calmaria-spa-plataforma-web-full-stack-1757541285325.jpeg',
                projectUrl: 'https://robertosilvadevfullstack.github.io/Projeto-Calmaria-Spa---Full-Stack/',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MySQL', 'Bootstrap'],
            },
            {
                id: 'c4659c62-643c-433c-a921-3160124634b8',
                title: '🚀 Elev Landing Page - Conversão e Performance',
                description: 'Uma landing page moderna e otimizada com:\n\n✨ Design limpo e focado em conversão\n📱 Layout totalmente responsivo e mobile-first\n⚡ Performance ultra-rápida e otimizada para SEO\n📧 Sistema de captura de leads integrado\n🎨 Elementos visuais impactantes\n📊 Preparada para analytics',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/elev-landing-page-projeto-de-altissima-conversao/elev-landing-page-projeto-de-altissima-conversao-1757540346249.jpeg',
                projectUrl: 'https://fernandaimobiliaria.com/',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'GitHub', 'Vercel'],
            },
            {
                id: 'dc526515-3ea1-4371-80cd-7c312f553b54',
                title: 'Gerador de Prompt COSTAR (FastAPI, Supabase, Multi-IA)',
                description: 'Sistema Full-Stack em produção (Railway) para criação e gestão de prompts estruturados (COSTAR). Inclui Área de Membros completa com autenticação Supabase (JWT), gestão de Quotas e Dashboard Admin. Sistema Multi-IA com failover automático, integrando Groq, Gemini, HuggingFace e Cohere.',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/gerador-de-prompt-costar-fastapi-supabase-multi-ia/gerador-de-prompt-costar-fastapi-supabase-multi-ia-1759972975195.jpeg',
                projectUrl: 'https://web-production-847de.up.railway.app/',
                technologies: ['Python', 'FastAPI', 'Supabase', 'PostgreSQL', 'JavaScript', 'HTML', 'CSS', 'Docker'],
            },
            {
                id: 'ff4d72cb-d0df-49e2-947a-a991d1dd2341',
                title: '🎨 Culturama Eventos - Acesse todos os eventos da cidade',
                description: 'Um projeto focado em mastering CSS Grid com:\n\n✨ Exemplos práticos e didáticos de Grid Layout\n📐 Layouts responsivos e criativos\n🧩 Demonstrações de posicionamento preciso\n📱 Design adaptativo para todos os dispositivos\n🎯 Foco em boas práticas e técnicas avançadas',
                imageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/project-assets/culturama-eventos-acesse-todos-os-eventos-da-cidade/culturama-eventos-acesse-todos-os-eventos-da-cidade-1757543465611.jpeg',
                projectUrl: 'https://praticando-grid-css.vercel.app/',
                technologies: ['HTML', 'CSS', 'Git', 'GitHub', 'Vercel'],
            },
        ];

        console.log(`📝 Criando ${projects.length} projetos...`);

        for (const projectData of projects) {
            const project = await prisma.project.upsert({
                where: { id: projectData.id },
                update: projectData,
                create: projectData,
            });
            console.log(`✅ Projeto criado: ${project.title}`);
        }

        console.log('\n🎉 Seed concluído com sucesso!');
        console.log(`📊 Total de projetos: ${projects.length}`);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedProjects();
