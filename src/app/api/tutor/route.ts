import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Tutor ainda não configurado. Adicione OPENAI_API_KEY ao ambiente do servidor." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const question = String(body.question ?? "").trim();
    const context = String(body.context ?? "").trim().slice(0, 6000);

    if (!question || question.length > 3000) {
      return NextResponse.json(
        { error: "Envie uma pergunta de até 3.000 caracteres." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "Você é o Tutor Acadêmico do ATLAS Academy. Responda em português brasileiro e parta do nível iniciante, aumentando a profundidade conforme a pergunta. Organize respostas complexas em: ideia central; explicação passo a passo; exemplo concreto; conexão com outras áreas; limites, controvérsias ou erros comuns; síntese; e uma pergunta de verificação. Diferencie fatos, interpretações, hipóteses e opiniões. Em temas científicos, jurídicos, econômicos e históricos, indique incertezas e não transforme simplificações em regras universais. Não invente autores, dados, URLs, estudos ou citações. Se não tiver segurança sobre uma fonte, diga que precisa ser verificada. Não substitua profissionais habilitados em decisões jurídicas, médicas ou financeiras individuais.",
        input: `Contexto de estudo:\n${context || "Não informado"}\n\nPergunta do estudante:\n${question}`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Falha ao consultar o tutor." },
        { status: response.status }
      );
    }

    const answer = (data.output || [])
      .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
      .filter((part: { type?: string }) => part.type === "output_text")
      .map((part: { text?: string }) => part.text || "")
      .join("\n");

    return NextResponse.json({ answer: answer || "Não foi possível obter uma resposta." });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar sua pergunta." }, { status: 500 });
  }
}
