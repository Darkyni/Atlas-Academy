"use client";
import { Activity, Atom, ArrowUpRight, Code2, Compass, Globe2, Landmark, Scale } from "lucide-react";

type Subject = {id:string;title:string;desc:string;tag:string};
const visuals: Record<string,{icon:typeof Scale;code:string;stat:string;accent:string}> = {
  direito:{icon:Scale,code:"01",stat:"Instituições · normas · direitos",accent:"law"},
  "economia-financas":{icon:Activity,code:"02",stat:"Mercados · capital · escolhas",accent:"eco"},
  "tecnologia-ia":{icon:Code2,code:"03",stat:"Computação · IA · segurança",accent:"tech"},
  "historia-geopolitica":{icon:Globe2,code:"04",stat:"Tempo · território · poder",accent:"history"},
  "filosofia-pensamento":{icon:Landmark,code:"05",stat:"Ideias · ética · argumentos",accent:"philo"},
  "ciencias-matematica":{icon:Atom,code:"06",stat:"Natureza · números · método",accent:"science"}
};
export default function KnowledgeMap({subjects,onSelect}:{subjects:Subject[];onSelect:(id:string)=>void}){
 return <section className="knowledge-map" aria-labelledby="knowledge-map-title">
  <div className="knowledge-map-head"><div><div className="eyebrow">CARTOGRAFIA DO SABER · ATLAS</div><h2 id="knowledge-map-title">Explore os territórios do conhecimento</h2><p>Cada território abre uma trilha própria, com aulas, leituras, vídeos, exercícios e desafios.</p></div><div className="map-compass"><Compass size={24}/><span>N · 06</span></div></div>
  <div className="knowledge-map-canvas">
   <div className="map-grid-lines" aria-hidden="true"/><div className="atlas-knowledge-core" aria-hidden="true"><div className="core-orbit orbit-one"/><div className="core-orbit orbit-two"/><div className="core-cube"><span/><span/><span/><b>A.</b></div><small>KNOWLEDGE ENGINE</small></div><svg className="map-connectors" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true"><path d="M160 100 L500 210 L840 100 M160 100 L160 325 L500 210 L840 325 L840 100 M160 325 L500 390 L840 325"/><path className="map-route-highlight" d="M160 100 L500 210 L840 325"/><circle cx="500" cy="210" r="7"/><circle cx="160" cy="100" r="4"/><circle cx="840" cy="100" r="4"/><circle cx="160" cy="325" r="4"/><circle cx="840" cy="325" r="4"/></svg>
   <div className="knowledge-map-grid">{subjects.map(subject=>{const visual=visuals[subject.id]??visuals.direito;const Icon=visual.icon;return <button type="button" key={subject.id} className={`knowledge-territory territory-${visual.accent}`} onClick={()=>onSelect(subject.id)}><span className="territory-code">SETOR {visual.code}</span><span className="territory-icon"><Icon size={23}/></span><strong>{subject.title}</strong><span className="territory-desc">{subject.desc}</span><span className="territory-meta">{visual.stat}</span><span className="territory-open">Explorar território <ArrowUpRight size={14}/></span><span className="territory-coordinate">{visual.code} / ATLAS</span></button>})}</div>
  </div>
  <div className="knowledge-map-foot"><span><i/> 06 departamentos ativos</span><span>SELECIONE UM TERRITÓRIO PARA COMEÇAR</span></div>
 </section>
}
