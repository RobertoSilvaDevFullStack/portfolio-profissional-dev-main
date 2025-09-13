import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("--- Início da Execução da Função ---");

    const accessToken = Deno.env.get("LINKEDIN_ACCESS_TOKEN");
    const authorUrn = Deno.env.get("LINKEDIN_AUTHOR_URN");
    const landingPageUrl = Deno.env.get("Landing page");

    if (!accessToken || !authorUrn || !landingPageUrl) {
      console.error("ERRO CRÍTICO: Segredos do ambiente não configurados.");
      throw new Error("As credenciais do LinkedIn ou a URL da Landing Page não foram configuradas como segredos.");
    }
    console.log("LOG: Segredos do ambiente carregados.");

    // Validação do formato do Author URN
    if (!authorUrn.startsWith("urn:li:person:") && !authorUrn.startsWith("urn:li:organization:")) {
        console.error(`ERRO: O formato do LINKEDIN_AUTHOR_URN ('${authorUrn}') é inválido.`);
        throw new Error("O formato do LINKEDIN_AUTHOR_URN é inválido. Deve começar com 'urn:li:person:' ou 'urn:li:organization:'.");
    }
    console.log("LOG: Formato do Author URN é válido.");

    const { record: post } = await req.json();
    console.log("LOG: Payload do webhook recebido:", JSON.stringify(post, null, 2));

    if (!post || !post.title || !post.slug) {
      console.error("ERRO: Payload do webhook inválido.");
      throw new Error("Payload do webhook inválido. 'record' com 'title' e 'slug' são necessários.");
    }

    const cleanedLandingPageUrl = landingPageUrl.endsWith('/') ? landingPageUrl.slice(0, -1) : landingPageUrl;
    const postUrl = `${cleanedLandingPageUrl}/blog/${post.slug}`;
    
    let contentText = post.title;
    if (post.excerpt) {
      contentText += `\n\n${post.excerpt}`;
    }
    contentText += `\n\nLeia mais em: ${postUrl}`;
    console.log("LOG: Texto do post montado:", contentText);

    const requestBody = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: contentText,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };
    console.log("LOG: Corpo da requisição para o LinkedIn:", JSON.stringify(requestBody, null, 2));

    console.log("LOG: Enviando requisição para a API do LinkedIn...");
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(requestBody),
    });
    console.log(`LOG: Resposta do LinkedIn recebida com status: ${response.status}`);

    const responseBodyText = await response.text(); // Ler o corpo da resposta independentemente do status

    if (!response.ok) {
      console.error("ERRO da API do LinkedIn:", responseBodyText);
      throw new Error(`Erro ao postar no LinkedIn: ${responseBodyText}`);
    }

    console.log("LOG: Postagem no LinkedIn bem-sucedida:", responseBodyText);

    const responseData = JSON.parse(responseBodyText);
    return new Response(JSON.stringify({ message: "Post compartilhado no LinkedIn com sucesso!", data: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("--- ERRO GERAL NA FUNÇÃO ---");
    console.error(error.message);
    console.error("-----------------------------");
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})