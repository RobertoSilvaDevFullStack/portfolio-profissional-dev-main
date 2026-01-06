-- Script para popular o banco de dados com posts do blog
-- Execute este script no banco de dados PostgreSQL do Railway

INSERT INTO "Post" (
  "id", 
  "title", 
  "slug", 
  "content", 
  "excerpt", 
  "coverImageUrl", 
  "published", 
  "featured",
  "metaTitle",
  "metaDescription",
  "createdAt",
  "updatedAt"
) VALUES 
(
  '59cb58b6-de2e-4fbb-a414-9bf3a31a68dc',
  '🏆 Dos Boxes à Pista Virtual: Como Aplicamos Programação Orientada a Objetos no Simulador de F1',
  'sepphiteam-f1-simulador-java',
  '<p>Recentemente, durante as aulas de Programação Orientada a Objetos com o Professor Felipe Pestana, embarquei no desenvolvimento de um projeto que colocou a teoria em prática de forma emocionante: o Simulador de Temporada de Fórmula 1 - Sepphi Team F1.</p><p><br></p><blockquote>Obs: somos dois apaixonados por fórmula 1 e eu gostei muito desse exercício.</blockquote><p><br></p><p>O objetivo, inspirado por um exercício inicial, era construir um sistema robusto em Java capaz de simular uma temporada completa de F1, incluindo equipes, carros, pilotos, engenheiros, chefes de equipe e, claro, as corridas. Mais do que apenas código, este projeto foi uma prova de fogo para os pilares da POO.</p>',
  'SepphiTeam F1 é um simulador de corridas em Java que reproduz disputas entre pilotos e gestão de temporadas. Ideal para estudar lógica de simulação, classes de domínio e testes.',
  'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/sepphiteam-f1-simulador-java/sepphiteam-f1-simulador-java-1760573050940.jpeg',
  true,
  true,
  '🏆 Dos Boxes à Pista Virtual: Como Aplicamos Programação Orientada a Objetos no Simulador de F1',
  'SepphiTeam F1 é um simulador de corridas em Java que reproduz disputas entre pilotos e gestão de temporadas.',
  '2025-10-16 00:26:47.700072+00',
  '2025-10-16 00:26:47.700072+00'
),
(
  '7bf1ea28-2e60-4610-a824-c7ec26dff2d8',
  'Bastidores do Meu Portfólio: Uma Jornada Full-Stack',
  'bastidores-do-meu-portfolio-uma-jornada-full-stack',
  '<p>Olá! Bem-vindo aos bastidores do meu portfólio. Este não é apenas um site para mostrar meus projetos; é, em si, um dos meus projetos mais importantes. Neste artigo, vou detalhar toda a jornada de criação, desde a primeira linha de código até a infraestrutura dinâmica que o alimenta hoje.</p><h2>O Ponto de Partida: Planejamento e Tecnologia</h2><p>Todo bom projeto começa com um plano. O objetivo era claro: criar um portfólio que fosse mais do que um currículo online. Ele precisava ser rápido, moderno, fácil de atualizar e, acima de tudo, um reflexo das minhas habilidades como desenvolvedor full-stack.</p>',
  'Descubra o processo completo de planejamento, desenvolvimento e evolução do meu portfólio pessoal. Uma análise detalhada da stack de tecnologia, dos desafios e das funcionalidades.',
  'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/bastidores-do-meu-portfolio-uma-jornada-full-stack/bastidores-do-meu-portfolio-uma-jornada-full-stack-1757547243047.jpeg',
  true,
  true,
  'Bastidores do Meu Portfólio: Uma Jornada Full-Stack',
  'Como construí meu portfólio profissional com React, Node.js e PostgreSQL',
  '2025-09-10 23:21:00.722027+00',
  '2025-09-10 23:21:00.722027+00'
),
(
  'ace6ee97-fc0e-4aa1-bae0-2094cf8cd01f',
  'Construindo uma Experiência Digital Focada em Comunicação Eficaz',
  'construindo-experiencia-digital-comunicacao-eficaz',
  '<h2><strong>Introdução</strong></h2><p><strong>Objetivo:</strong> construir uma presença digital que reflita meu trabalho em oratória e comunicação corporativa, com foco em performance, acessibilidade e conversão.</p><p><strong>Contexto:</strong> centralizar conteúdos, depoimentos e páginas de serviços, servindo como canal principal de relacionamento e geração de oportunidades.</p>',
  'Como estruturei e otimizei o site para oratória e comunicação corporativa, com foco em performance, acessibilidade e conversão.',
  'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/construindo-experiencia-digital-comunicacao-eficaz/construindo-experiencia-digital-comunicacao-eficaz-1764355967337.jpeg',
  true,
  false,
  'Construindo uma Experiência Digital Focada em Comunicação Eficaz',
  'Como estruturei e otimizei o site para oratória e comunicação corporativa',
  '2025-11-28 19:01:27.394993+00',
  '2025-11-28 19:01:27.394993+00'
),
(
  'eda81ffb-46be-4ed7-846f-414f35ed46bf',
  'Como Criei um Gerador de Prompts COSTAR com FastAPI, Supabase e Multi-AI: Da Ideia ao Deploy na Railway',
  'gerador-prompts-costar-fastapi-supabase-multi-ai-railway',
  '<article><header><h1>Como Criei um Gerador de Prompts COSTAR com FastAPI, Supabase e Multi-AI</h1><p class="subtitle">Da concepção à produção: um sistema completo com 5 provedores de IA</p></header><section><h2>🎯 O Que É o Projeto</h2><p>O <strong>Gerador de Prompt COSTAR</strong> é uma aplicação web completa que automatiza a criação de prompts estruturados usando a metodologia COSTAR.</p></section></article>',
  'Desenvolvi um sistema completo de geração de prompts COSTAR integrando 5 provedores de IA, sistema de autenticação e dashboard administrativo.',
  'https://ltgckmcgapyftkivellw.supabase.co/storage/v1/object/public/blog-assets/gerador-prompts-costar-fastapi-supabase-multi-ai-railway/gerador-prompts-costar-fastapi-supabase-multi-ai-railway-1759533532446.jpeg',
  true,
  true,
  'Como Criei um Gerador de Prompts COSTAR com FastAPI, Supabase e Multi-AI',
  'Sistema completo de geração de prompts COSTAR com 5 provedores de IA',
  '2025-10-03 23:19:50.852513+00',
  '2025-10-03 23:19:50.852513+00'
)
ON CONFLICT (id) DO UPDATE SET
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "excerpt" = EXCLUDED."excerpt",
  "coverImageUrl" = EXCLUDED."coverImageUrl",
  "published" = EXCLUDED."published",
  "featured" = EXCLUDED."featured",
  "metaTitle" = EXCLUDED."metaTitle",
  "metaDescription" = EXCLUDED."metaDescription",
  "updatedAt" = CURRENT_TIMESTAMP;
