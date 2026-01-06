import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPosts() {
    try {
        console.log('🌱 Iniciando seed de posts...');

        // ID do usuário admin criado anteriormente
        const ADMIN_USER_ID = '36f2bd35-3553-4408-b572-c253d0aa17d1';

        const posts = [
            {
                id: '59cb58b6-de2e-4fbb-a414-9bf3a31a68dc',
                title: '🏆 Dos Boxes à Pista Virtual: Como Aplicamos Programação Orientada a Objetos no Simulador de F1',
                slug: 'sepphiteam-f1-simulador-java',
                content: '<p>Recentemente, durante as aulas de Programação Orientada a Objetos com o Professor Felipe Pestana, embarquei no desenvolvimento de um projeto que colocou a teoria em prática de forma emocionante: o Simulador de Temporada de Fórmula 1 - Sepphi Team F1.</p><p><br></p><blockquote>Obs: somos dois apaixonados por fórmula 1 e eu gostei muito desse exercício.</blockquote><p><br></p><p>O objetivo, inspirado por um exercício inicial, era construir um sistema robusto em Java capaz de simular uma temporada completa de F1, incluindo equipes, carros, pilotos, engenheiros, chefes de equipe e, claro, as corridas. Mais do que apenas código, este projeto foi uma prova de fogo para os pilares da POO.</p><p><br></p><p>Link para o repositório:</p><p><a href="https://github.com/RobertoSilvaDevFullStack/SepphiTeamF1" rel="noopener noreferrer" target="_blank">RobertoSilvaDevFullStack/SepphiTeamF1</a></p>',
                excerpt: 'SepphiTeam F1 é um simulador de corridas em Java que reproduz disputas entre pilotos e gestão de temporadas. Ideal para estudar lógica de simulação, classes de domínio e testes.',
                coverImageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/sepphiteam-f1-simulador-java/sepphiteam-f1-simulador-java-1760573050940.jpeg',
                status: 'published',
                metaTitle: '🏆 Dos Boxes à Pista Virtual: Como Aplicamos Programação Orientada a Objetos no Simulador de F1',
                metaDescription: 'SepphiTeam F1 é um simulador de corridas em Java que reproduz disputas entre pilotos e gestão de temporadas.',
                authorId: ADMIN_USER_ID,
            },
            {
                id: '7bf1ea28-2e60-4610-a824-c7ec26dff2d8',
                title: 'Bastidores do Meu Portfólio: Uma Jornada Full-Stack',
                slug: 'bastidores-do-meu-portfolio-uma-jornada-full-stack',
                content: '<p>Olá! Bem-vindo aos bastidores do meu portfólio. Este não é apenas um site para mostrar meus projetos; é, em si, um dos meus projetos mais importantes.</p><h2>O Ponto de Partida: Planejamento e Tecnologia</h2><p>Todo bom projeto começa com um plano. O objetivo era claro: criar um portfólio que fosse mais do que um currículo online.</p>',
                excerpt: 'Descubra o processo completo de planejamento, desenvolvimento e evolução do meu portfólio pessoal.',
                coverImageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/bastidores-do-meu-portfolio-uma-jornada-full-stack/bastidores-do-meu-portfolio-uma-jornada-full-stack-1757547243047.jpeg',
                status: 'published',
                metaTitle: 'Bastidores do Meu Portfólio: Uma Jornada Full-Stack',
                metaDescription: 'Como construí meu portfólio profissional com React, Node.js e PostgreSQL',
                authorId: ADMIN_USER_ID,
            },
            {
                id: 'ace6ee97-fc0e-4aa1-bae0-2094cf8cd01f',
                title: 'Construindo uma Experiência Digital Focada em Comunicação Eficaz',
                slug: 'construindo-experiencia-digital-comunicacao-eficaz',
                content: '<h2><strong>Introdução</strong></h2><p><strong>Objetivo:</strong> construir uma presença digital que reflita meu trabalho em oratória e comunicação corporativa.</p>',
                excerpt: 'Como estruturei e otimizei o site para oratória e comunicação corporativa, com foco em performance.',
                coverImageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/construindo-experiencia-digital-comunicacao-eficaz/construindo-experiencia-digital-comunicacao-eficaz-1764355967337.jpeg',
                status: 'published',
                metaTitle: 'Construindo uma Experiência Digital Focada em Comunicação Eficaz',
                metaDescription: 'Como estruturei e otimizei o site para oratória e comunicação corporativa',
                authorId: ADMIN_USER_ID,
            },
            {
                id: 'eda81ffb-46be-4ed7-846f-414f35ed46bf',
                title: 'Como Criei um Gerador de Prompts COSTAR com FastAPI, Supabase e Multi-AI: Da Ideia ao Deploy na Railway',
                slug: 'gerador-prompts-costar-fastapi-supabase-multi-ai-railway',
                content: '<h1>Como Criei um Gerador de Prompts COSTAR</h1><p>Sistema completo com 5 provedores de IA integrados.</p>',
                excerpt: 'Desenvolvi um sistema completo de geração de prompts COSTAR integrando 5 provedores de IA.',
                coverImageUrl: 'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/gerador-prompts-costar-fastapi-supabase-multi-ai-railway/gerador-prompts-costar-fastapi-supabase-multi-ai-railway-1759533532446.jpeg',
                status: 'published',
                metaTitle: 'Como Criei um Gerador de Prompts COSTAR com FastAPI e Multi-AI',
                metaDescription: 'Sistema completo de geração de prompts COSTAR com 5 provedores de IA',
                authorId: ADMIN_USER_ID,
            },
        ];

        console.log(`📝 Criando ${posts.length} posts...`);

        for (const postData of posts) {
            const post = await prisma.post.upsert({
                where: { id: postData.id },
                update: postData,
                create: postData,
            });
            console.log(`✅ Post criado: ${post.title}`);
        }

        console.log('\n🎉 Seed concluído com sucesso!');
        console.log(`📊 Total de posts: ${posts.length}`);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedPosts();
