"use client";
import { useEffect, useState } from "react";
import { BookOpenCheck, Brain, Check, ClipboardCheck, Save } from "lucide-react";

type Props={lessonId:string; reflectionPrompt:string; casePrompt:string};
type State={steps:string[];note:string;confidence:"low"|"medium"|"high"|""};
const steps=[{id:"theory",label:"Estudei a explicação teórica"},{id:"case",label:"Analisei o estudo de caso"},{id:"retrieval",label:"Respondi à questão sem consultar"},{id:"reflection",label:"Escrevi minha própria explicação"}];
export default function LessonWorkbench({lessonId,reflectionPrompt,casePrompt}:Props){
 const [state,setState]=useState<State>({steps:[],note:"",confidence:""});
 const [saved,setSaved]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(`atlas-workbench-${lessonId}`);if(raw)setState(JSON.parse(raw));else setState({steps:[],note:"",confidence:""});}catch{setState({steps:[],note:"",confidence:""});}setSaved(false);},[lessonId]);
 function update(next:State){setState(next);setSaved(false);}
 function save(){try{localStorage.setItem(`atlas-workbench-${lessonId}`,JSON.stringify(state));setSaved(true);}catch{setSaved(false);}}
 const done=state.steps.length;
 return <section className="lesson-workbench">
  <div className="eyebrow">OFICINA DE APRENDIZAGEM · SUA SESSÃO</div><h2>Transforme leitura em domínio</h2>
  <p>Marque cada etapa somente depois de realizá-la. Seu registro fica salvo neste navegador e ajuda a manter um método consistente.</p>
  <div className="workbench-progress"><span style={{width:`${done/steps.length*100}%`}}/></div>
  <div className="workbench-checklist">{steps.map(item=><label key={item.id} className={state.steps.includes(item.id)?"is-done":""}><input type="checkbox" checked={state.steps.includes(item.id)} onChange={e=>update({...state,steps:e.target.checked?[...state.steps,item.id]:state.steps.filter(x=>x!==item.id)})}/><span>{state.steps.includes(item.id)?<Check size={14}/>:null}</span>{item.label}</label>)}</div>
  <div className="workbench-prompts"><div><strong><ClipboardCheck size={15}/> Desafio prático</strong><p>{casePrompt}</p></div><div><strong><Brain size={15}/> Recuperação ativa</strong><p>{reflectionPrompt}</p></div></div>
  <label className="workbench-note-label" htmlFor={`note-${lessonId}`}><BookOpenCheck size={15}/> Explique com suas palavras</label>
  <textarea id={`note-${lessonId}`} rows={4} value={state.note} onChange={e=>update({...state,note:e.target.value})} placeholder="Escreva a ideia central sem copiar o texto. Inclua um exemplo e uma dúvida que ainda precisa resolver."/>
  <div className="workbench-confidence"><span>Como está seu domínio deste assunto?</span><div>{([{id:"low",label:"Ainda confuso"},{id:"medium",label:"Entendi a ideia"},{id:"high",label:"Consigo aplicar"}] as const).map(item=><button type="button" key={item.id} className={state.confidence===item.id?"selected":""} onClick={()=>update({...state,confidence:item.id})}>{item.label}</button>)}</div></div>
  <div className="workbench-footer"><small>{saved?"Registro salvo neste navegador.":`${done} de ${steps.length} etapas marcadas.`}</small><button type="button" className="button button-dark" onClick={save}><Save size={14}/> Salvar sessão</button></div>
 </section>;
}
