"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BookOpen, ExternalLink, FileText, FileDown, PlayCircle, Search, Scale, Filter, Bookmark, BookmarkCheck } from "lucide-react";
import { learningResources, type ResourceKind } from "@/lib/resources";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const filters = ["Todos", "PDF", "Legislação", "Artigo", "Vídeo", "Curso", "Livro"] as const;
const departments = ["Todos", "Direito e instituições", "Economia e Finanças", "Tecnologia e Inteligência Artificial", "História e Geopolítica", "Filosofia e Pensamento Crítico", "Ciências e Matemática", "Minha biblioteca"] as const;
type FilterKind = typeof filters[number];

function iconFor(kind: ResourceKind) {
  if (kind === "PDF") return FileDown;
  if (kind === "Vídeo") return PlayCircle;
  if (kind === "Legislação") return Scale;
  if (kind === "Livro" || kind === "Curso") return BookOpen;
  return FileText;
}

type UploadedResource = {
  id: string; title: string; author: string; institution: string; kind: ResourceKind;
  topic: string; department?: string; description: string; url: string; note?: string; access: "Acesso aberto" | "Página oficial" | "Consulta online";
};

export default function ResourceLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKind>("Todos");
  const [department, setDepartment] = useState<(typeof departments)[number]>("Todos");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedResource[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("atlas-library-bookmarks-v1");
      if (saved) setSavedIds(JSON.parse(saved));
    } catch { /* armazenamento local indisponível */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem("atlas-library-bookmarks-v1", JSON.stringify(savedIds)); }
    catch { /* armazenamento local indisponível */ }
  }, [savedIds]);

  function toggleSaved(id: string) {
    setSavedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  useEffect(() => {
    let cancelled = false;
    async function loadUploaded() {
      if (!supabase) return;
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase.from("learning_resources").select("id,title,author,institution,resource_type,description,topic,storage_path").eq("owner_id", userData.user.id).order("created_at", { ascending: false });
      if (!data || cancelled) return;
      const mapped = await Promise.all(data.filter(item => item.storage_path).map(async item => {
        const { data: signed } = await supabase!.storage.from("atlas-library").createSignedUrl(item.storage_path, 3600);
        return { id: item.id, title: item.title, author: item.author || "Material pessoal", institution: item.institution || "Biblioteca pessoal", kind: "PDF" as ResourceKind, topic: item.topic || "Arquivo pessoal", department: "Minha biblioteca", description: item.description || "Arquivo enviado para sua biblioteca privada.", url: signed?.signedUrl || "", access: "Acesso aberto" as const };
      }));
      if (!cancelled) setUploaded(mapped.filter(item => item.url));
    }
    void loadUploaded();
    return () => { cancelled = true; };
  }, []);

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage("");
    if (!supabase || !isSupabaseConfigured) { setUploadMessage("Configure e acesse sua conta Supabase para enviar arquivos privados."); return; }
    if (!file) { setUploadMessage("Escolha um arquivo PDF antes de enviar."); return; }
    if (file.type !== "application/pdf" || file.size > 50 * 1024 * 1024) { setUploadMessage("Envie um PDF de até 50 MB."); return; }
    setUploading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Entre na sua conta do ATLAS antes de enviar arquivos.");
      const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${userData.user.id}/${Date.now()}-${safeName}`;
      const { error: storageError } = await supabase.storage.from("atlas-library").upload(path, file, { contentType: "application/pdf", upsert: false });
      if (storageError) throw storageError;
      const { data: record, error: recordError } = await supabase.from("learning_resources").insert({ owner_id: userData.user.id, title: fileTitle.trim() || file.name.replace(/\.pdf$/i, ""), author: "Arquivo pessoal", institution: "Biblioteca pessoal", resource_type: "pdf", description: "PDF enviado pelo estudante.", topic: "Material pessoal", storage_path: path, access_level: "private" }).select("id").single();
      if (recordError) {
        await supabase.storage.from("atlas-library").remove([path]);
        throw recordError;
      }
      const { data: signed } = await supabase.storage.from("atlas-library").createSignedUrl(path, 3600);
      if (signed?.signedUrl) setUploaded(current => [{ id: record.id, title: fileTitle.trim() || file.name, author: "Arquivo pessoal", institution: "Biblioteca pessoal", kind: "PDF", topic: "Material pessoal", department: "Minha biblioteca", description: "PDF privado enviado por você. Link de acesso temporário.", url: signed.signedUrl, access: "Acesso aberto" }, ...current]);
      setFile(null); setFileTitle("");
      const input = document.getElementById("atlas-pdf-upload") as HTMLInputElement | null;
      if (input) input.value = "";
      setUploadMessage("PDF enviado para sua biblioteca privada.");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Não foi possível enviar o arquivo.");
    } finally { setUploading(false); }
  }

  const resources = useMemo(() => [...uploaded, ...learningResources].filter(resource => {
    const matchesFilter = filter === "Todos" || resource.kind === filter;
    const matchesDepartment = department === "Todos" || resource.department === department;
    const haystack = `${resource.title} ${resource.author} ${resource.institution} ${resource.topic} ${resource.description}`.toLocaleLowerCase("pt-BR");
    return matchesFilter && matchesDepartment && (!showSaved || savedIds.includes(resource.id)) && haystack.includes(query.toLocaleLowerCase("pt-BR"));
  }), [filter, department, query, uploaded, showSaved, savedIds]);
  const orderedResources = useMemo(() => {
    const order = departments.slice(1, 7);
    return [...resources].sort((a,b) => order.indexOf(a.department || "") - order.indexOf(b.department || "") || a.title.localeCompare(b.title, "pt-BR"));
  }, [resources]);

  return <section className="page-section resource-library-page">
    <div className="eyebrow">ACERVO MULTIMÍDIA CURADO</div>
    <h1>Biblioteca</h1>
    <p className="page-intro">Materiais selecionados para os seis departamentos. Priorize fontes primárias, universidades, órgãos públicos, repositórios acadêmicos e conteúdos abertos.</p>
    <div className="library-feature library-feature-v2"><BookOpen size={28}/><div><h2>Uma biblioteca com origem identificada.</h2><p>Prioridade para legislação oficial, publicações acadêmicas de acesso aberto, repositórios públicos e catálogos editoriais. O ATLAS identifica quando um item é PDF, artigo, livro ou vídeo.</p></div></div>
    <form className="library-upload" onSubmit={uploadFile}>
      <div><div className="eyebrow">SUA COLEÇÃO PARTICULAR</div><h2>Adicionar PDF à biblioteca</h2><p>Envie seus próprios materiais de estudo. Os arquivos ficam em um bucket privado e só sua conta pode acessá-los.</p></div>
      <div className="library-upload-fields"><input aria-label="Título do material" value={fileTitle} onChange={event => setFileTitle(event.target.value)} placeholder="Título do material (opcional)"/><input id="atlas-pdf-upload" type="file" accept="application/pdf,.pdf" onChange={event => setFile(event.target.files?.[0] || null)}/><button className="button button-dark" type="submit" disabled={uploading}>{uploading ? "Enviando..." : "Enviar PDF"}</button></div>
      {uploadMessage && <p className="upload-message" role="status">{uploadMessage}</p>}
      {!isSupabaseConfigured && <p className="upload-message">O envio de arquivos será habilitado depois de configurar o Supabase e executar a migração acadêmica v2.</p>}
    </form>
    <div className="library-controls">
      <label className="search-box"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por título, autor ou assunto..."/></label>
      <div className="library-filter-label"><Filter size={14}/> Tipo de material</div>
      <div className="library-filters">{filters.map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <button className={`library-saved-toggle ${showSaved ? "active" : ""}`} onClick={() => setShowSaved(value => !value)}>
        {showSaved ? <BookmarkCheck size={14}/> : <Bookmark size={14}/>} {showSaved ? "Exibindo salvos" : `Ver salvos (${savedIds.length})`}
      </button>
    </div>
    <div className="library-results-head"><strong>{resources.length} materiais encontrados</strong><span>{department === "Todos" ? "Acervo multidisciplinar" : department}</span></div>
    <div className="resource-grid-v2">{orderedResources.map((resource,index) => {
      const previousDepartment = orderedResources[index-1]?.department;
      const showDepartmentHeading = department === "Todos" && resource.department !== previousDepartment;
      const Icon = iconFor(resource.kind);
      return <div className="resource-group-wrap" key={resource.id}>{showDepartmentHeading && <div className="resource-group-heading"><span>{resource.department || "Acervo"}</span><i/></div>}<article className="resource-card-v2">
        <div className="resource-card-top"><div className="resource-icon-v2"><Icon size={19}/></div><div className="resource-card-actions"><span className={`resource-kind kind-${resource.kind.toLowerCase()}`}>{resource.kind}</span><button className={`resource-save-button ${savedIds.includes(resource.id) ? "saved" : ""}`} onClick={() => toggleSaved(resource.id)} aria-label={savedIds.includes(resource.id) ? "Remover dos salvos" : "Salvar material"} title={savedIds.includes(resource.id) ? "Remover dos salvos" : "Salvar material"}>{savedIds.includes(resource.id) ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}</button></div></div>
        <div className="resource-topic">{resource.department || "Acervo"} · {resource.topic}</div>
        <h2>{resource.title}</h2>
        <p className="resource-byline">{resource.author} · {resource.institution}</p>
        <p className="resource-description">{resource.description}</p>
        {resource.note && <p className="resource-note">{resource.note}</p>}
        <div className="resource-card-bottom"><span>{resource.access}</span><a href={resource.url} target="_blank" rel="noreferrer">Acessar material <ExternalLink size={13}/></a></div>
      </article></div>;
    })}</div>
    {resources.length === 0 && <div className="empty-state"><Search size={24}/><strong>Nenhum material encontrado</strong><span>Tente outro termo ou selecione outro tipo de material.</span></div>}
    <p className="source-note">Curadoria do ATLAS. Links, versões e condições de acesso podem mudar; confirme a atualização na instituição de origem. Livros comerciais são indicados por referência e catálogo, não disponibilizados ilegalmente para download.</p>
  </section>;
}
