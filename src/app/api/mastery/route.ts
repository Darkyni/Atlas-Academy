import { NextRequest, NextResponse } from "next/server";

const dimensions = ["explain", "relate", "question", "apply", "transfer"] as const;
const dimensionLabels: Record<(typeof dimensions)[number], string> = {
  explain: "Explicar",
  relate: "Relacionar",
  question: "Questionar",
  apply: "Aplicar",
  transfer: "Transferir"
};

type Evaluation = {
  scores: Record<(typeof dimensions)[number], number>;
  evidence: Record<(typeof dimensions)[number], string>;
  gaps: Record<(typeof dimensions)[number], string>;
  next_steps: string[];
  overall: string;
};

function isEvaluation(value: unknown): value is Evaluation {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Evaluation;
  return dimensions.every((key) =>
    Number.isInteger(candidate.scores?.[key]) && candidate.scores[key] >= 0 && candidate.scores[key] <= 3 &&
    typeof candidate.evidence?.[key] === "string" &&
    typeof candidate.gaps?.[key] === "string"
  ) && Array.isArray(candidate.next_steps) && candidate.next_steps.every((step) => typeof step === "string") && typeof candidate.overall === "string";
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "A avaliação assistida por IA ainda não está configurada. Configure OPENAI_API_KEY no ambiente do servidor. Suas respostas não foram avaliadas nem receberam nota." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const course = String(body.course ?? "").trim().slice(0, 180);
    const lesson = String(body.lesson ?? "").trim().slice(0, 180);
    const objective = String(body.objective ?? "").trim().slice(0, 1200);
    const context = String(body.context ?? "").trim().slice(0, 6000);
    const responses = body.responses as Record<string, unknown> | undefined;
    if (!course || !lesson || !responses || !dimensions.every((key) => typeof responses[key] === "string" && (responses[key] as string).trim().length >= 40 && (responses[key] as string).length <= 2500)) {
      return NextResponse.json({ error: "Preencha as cinco respostas com pelo menos 40 caracteres cada. O limite é 2.500 caracteres por resposta." }, { status: 400 });
    }

    const input = dimensions.map((key) => `${dimensionLabels[key]}:\n${String(responses[key]).trim()}`).join("\n\n");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        text: { format: { type: "json_object" } },
        max_output_tokens: 1400,
        instructions: `Você é avaliador formativo do ATLAS Academy. Avalie evidências de aprendizagem, não a eloquência, tamanho ou concordância com uma opinião. Responda em português brasileiro, com rigor, justiça e linguagem construtiva. Considere o nível iniciante. Não invente evidências ausentes. Uma resposta curta, vaga ou que apenas repete a pergunta não merece pontuação alta. Atribua uma nota independente de 0 a 3 para cada dimensão: 0 = não demonstrado/ausente; 1 = inicial, fragmentado ou com erros importantes; 2 = adequado, correto em linhas gerais e com alguma autonomia; 3 = avançado, preciso, bem fundamentado e capaz de lidar com limites/nuances. Para explicar, verifique clareza e precisão conceitual. Para relacionar, verifique conexão válida e explicada. Para questionar, verifique pressupostos, evidências, limites ou contra-argumentos. Para aplicar, verifique uso do conhecimento na solução do caso. Para transferir, verifique adaptação para contexto novo. Não atribua domínio avançado por mera confiança declarada. Produza SOMENTE um objeto JSON com: scores (chaves explain, relate, question, apply, transfer, valores inteiros 0-3); evidence (as mesmas chaves, uma frase específica que cite o que a resposta demonstrou); gaps (as mesmas chaves, uma lacuna concreta ou 'Nenhuma lacuna relevante identificada'); next_steps (3 a 5 ações curtas, específicas e praticáveis); overall (síntese geral com ressalva de que é uma avaliação formativa assistida por IA, sujeita a revisão humana). Não diga que a pessoa domina a disciplina inteira: avalie apenas esta atividade.` ,
        input: `Curso: ${course}\nAula: ${lesson}\nObjetivo: ${objective}\nContexto da aula: ${context}\n\nRESPOSTAS DO ESTUDANTE:\n${input}`
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "Falha ao avaliar as respostas." }, { status: response.status });
    const output = (data.output || []).flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || []).filter((part: { type?: string }) => part.type === "output_text").map((part: { text?: string }) => part.text || "").join("\n");
    let parsed: unknown;
    try { parsed = JSON.parse(output); } catch { return NextResponse.json({ error: "A avaliação retornou um formato inválido. Tente novamente." }, { status: 502 }); }
    if (!isEvaluation(parsed)) return NextResponse.json({ error: "A avaliação não passou pela validação de estrutura. Nenhuma nota foi registrada." }, { status: 502 });
    return NextResponse.json({ evaluation: parsed, evaluatedAt: new Date().toISOString(), model: process.env.OPENAI_MODEL || "gpt-4.1-mini" });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a avaliação. Suas respostas permanecem no formulário até você sair da página." }, { status: 500 });
  }
}
