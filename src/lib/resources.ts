export type ResourceKind = "PDF" | "Legislação" | "Artigo" | "Vídeo" | "Livro";
export type LearningResource = {
  id: string;
  title: string;
  author: string;
  institution: string;
  kind: ResourceKind;
  topic: string;
  description: string;
  url: string;
  lessonIds?: string[];
  access: "Acesso aberto" | "Página oficial" | "Consulta online";
  note?: string;
};

// Curadoria inicial: prioriza fontes públicas, acadêmicas e páginas de editoras.
// Links externos são mantidos como origem; o ATLAS não redistribui obras protegidas.
export const learningResources: LearningResource[] = [
  {
    id: "cf88-camara-2026", title: "Constituição da República Federativa do Brasil — edição 2026", author: "Brasil", institution: "Câmara dos Deputados · Edições Câmara", kind: "PDF", topic: "Constituição e Estado", description: "Edição oficial em PDF e EPUB, atualizada conforme as emendas indicadas no registro da Câmara. Consulte sempre a versão mais recente.", url: "https://bd.camara.leg.br/bd/items/3ca4ea13-190c-42a6-8786-d3b755f3b7b7", lessonIds: ["direito-05", "direito-06", "direito-07"], access: "Acesso aberto", note: "A página do acervo oferece os arquivos para leitura e download." 
  },
  {
    id: "constituicao-planalto", title: "Constituição Federal — texto compilado", author: "Brasil", institution: "Presidência da República · Planalto", kind: "Legislação", topic: "Constituição e direitos", description: "Texto constitucional e dispositivos organizados no portal oficial da legislação federal.", url: "https://www4.planalto.gov.br/legislacao/legis-federal/constituicao", lessonIds: ["direito-05", "direito-06", "direito-07"], access: "Consulta online"
  },
  {
    id: "codigo-civil", title: "Lei nº 10.406/2002 — Código Civil", author: "Brasil", institution: "Presidência da República · Planalto", kind: "Legislação", topic: "Direito civil", description: "Texto compilado do Código Civil brasileiro. Útil para observar como conceitos jurídicos aparecem em regras concretas.", url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm", lessonIds: ["direito-08"], access: "Consulta online"
  },
  {
    id: "lindb", title: "Decreto-Lei nº 4.657/1942 — Lei de Introdução às Normas do Direito Brasileiro", author: "Brasil", institution: "Presidência da República · Planalto", kind: "Legislação", topic: "Normas e interpretação", description: "Normas sobre vigência, aplicação, interpretação e integração do Direito brasileiro.", url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm", lessonIds: ["direito-03", "direito-04"], access: "Consulta online"
  },
  {
    id: "artigo-desigualdade-estado-direito", title: "A desigualdade e a subversão do Estado de Direito", author: "Oscar Vilhena Vieira", institution: "Sur — Revista Internacional de Direitos Humanos", kind: "Artigo", topic: "Estado de Direito e justiça", description: "Artigo acadêmico que examina como desigualdades persistentes podem afetar a imparcialidade e a integridade do Estado de Direito.", url: "https://www.scielo.br/j/sur/a/6b8m4wkLXMwkv8KQFmW8Nsy/abstract/?lang=pt", lessonIds: ["direito-01", "direito-02", "direito-04"], access: "Acesso aberto"
  },
  {
    id: "artigo-habermas", title: "Habermas: os fundamentos do Estado democrático de direito", author: "Aylton Barbieri Durão", institution: "Trans/Form/Ação · SciELO", kind: "Artigo", topic: "Democracia e instituições", description: "Discussão acadêmica sobre as relações entre Direito, política, soberania popular e legitimidade democrática.", url: "https://www.scielo.br/j/trans/a/xWbY9dstVR5sJkzgBnz8DGy/", lessonIds: ["direito-04", "direito-05", "direito-06"], access: "Acesso aberto"
  },
  {
    id: "artigo-estado-justica", title: "Do Estado de Direito ao Estado de Justiça", author: "João dos Passos Martins Neto e Bárbara Lebarbenchon Moura Thomaselli", institution: "Revista Sequência · SciELO", kind: "Artigo", topic: "Legalidade e justiça", description: "Examina sentidos formal e substantivo do Estado de Direito e sua relação com direitos e justiça.", url: "https://www.scielo.br/j/seq/a/L9xWGF46hdJLxzQyvt6GstH/?lang=pt", lessonIds: ["direito-02", "direito-04"], access: "Acesso aberto"
  },
  {
    id: "video-tv-justica", title: "Videoaulas e programas sobre Justiça e cidadania", author: "TV Justiça", institution: "Supremo Tribunal Federal", kind: "Vídeo", topic: "Instituições jurídicas", description: "Portal de vídeos para complementar o estudo de instituições, funcionamento da Justiça e temas jurídicos. Escolha conteúdos relacionados à aula em andamento.", url: "https://www.youtube.com/@TVJustica", lessonIds: ["direito-06", "direito-07", "direito-08", "direito-09"], access: "Página oficial"
  },
  {
    id: "video-senado", title: "Conteúdos educativos sobre Constituição e cidadania", author: "TV Senado", institution: "Senado Federal", kind: "Vídeo", topic: "Constituição e cidadania", description: "Vídeos institucionais e explicativos sobre processo legislativo, Constituição e vida democrática.", url: "https://www.youtube.com/@tvsenado", lessonIds: ["direito-05", "direito-06", "direito-07"], access: "Página oficial"
  },
  {
    id: "livro-reaIe", title: "Lições Preliminares de Direito", author: "Miguel Reale", institution: "Saraiva Jur", kind: "Livro", topic: "Introdução ao Direito", description: "Obra introdutória de referência para aprofundar fato, valor, norma e conceitos fundamentais. Consulte biblioteca ou catálogo editorial; não é disponibilizada aqui como PDF.", url: "https://www.saraiva.com.br/", lessonIds: ["direito-01", "direito-02", "direito-03"], access: "Página oficial", note: "Material protegido por direitos autorais. O link direciona ao catálogo da editora."
  },
  {
    id: "livro-nader", title: "Introdução ao Estudo do Direito", author: "Paulo Nader", institution: "Grupo GEN · Forense", kind: "Livro", topic: "Introdução ao Direito", description: "Referência de estudo para conceitos, fontes e estrutura do fenômeno jurídico. Consulte edição e disponibilidade no catálogo editorial.", url: "https://www.grupogen.com.br/", lessonIds: ["direito-01", "direito-03", "direito-04"], access: "Página oficial", note: "Material protegido por direitos autorais. O link direciona ao catálogo da editora."
  }
];

export const flashcards = [
  { front: "O que é Direito objetivo?", back: "O Direito considerado como conjunto organizado de normas e princípios reconhecidos por um ordenamento jurídico." },
  { front: "O que é direito subjetivo?", back: "Uma posição, faculdade ou poder jurídico atribuído a uma pessoa e protegido pelo ordenamento." },
  { front: "Legalidade e justiça são sinônimos?", back: "Não. Legalidade examina conformidade com o Direito vigente; justiça avalia a correção de uma decisão, regra ou distribuição segundo critérios normativos." },
  { front: "O que caracteriza o Estado de Direito?", back: "O exercício do poder público submetido a normas, competências, procedimentos e limites jurídicos, incluindo garantias fundamentais." },
  { front: "Qual a função da Constituição?", back: "Organizar o Estado, distribuir competências, estabelecer fundamentos e limitar o poder, além de reconhecer direitos e garantias." },
  { front: "O que significa separação de Poderes?", back: "Distribuição de funções estatais entre órgãos independentes e harmônicos, com mecanismos de controle recíproco." },
  { front: "Uma regra moral é automaticamente uma norma jurídica?", back: "Não. Moral e Direito podem se influenciar, mas a juridicidade depende do reconhecimento pelo ordenamento e de seus critérios institucionais." },
  { front: "Por que fatos e normas devem ser separados na análise jurídica?", back: "Porque é preciso identificar o que aconteceu, quais regras podem incidir e justificar a interpretação que conecta os fatos à conclusão." }
];
