"use client";
import { useEffect, useState } from "react";
import { Award, CheckCircle2, LockKeyhole, RotateCcw } from "lucide-react";
import type { Lesson } from "@/lib/curriculum";

type Props={courseId:string;courseTitle?:string;lessons:Lesson[];completedCount:number};
type AnswerMap=Record<string,number>;
export default function CourseAssessment({courseId,courseTitle,lessons,completedCount}:Props){
 const [started,setStarted]=useState(false);const [questions,setQuestions]=useState<Lesson[]>([]);const [answers,setAnswers]=useState<AnswerMap>({});const [submitted,setSubmitted]=useState(false);const [best,setBest]=useState<number|null>(null);
 const unlocked=completedCount>=Math.ceil(lessons.length*.7);
 useEffect(()=>{try{const raw=localStorage.getItem(`atlas-assessment-best-${courseId}`);if(raw!==null)setBest(Number(raw));}catch{/* local storage unavailable */}},[courseId]);
 function start(){const pool=[...lessons].sort(()=>Math.random()-.5).slice(0,Math.min(8,lessons.length));setQuestions(pool);setAnswers({});setSubmitted(false);setStarted(true);}
 const score=questions.length?questions.reduce((sum,item)=>sum+(answers[item.id]===item.question.correct?1:0),0):0;
 function finish(){setSubmitted(true);const pct=Math.round(score/questions.length*100);if(best===null||pct>best){setBest(pct);try{localStorage.setItem(`atlas-assessment-best-${courseId}`,String(pct));}catch{/* local storage unavailable */}}}
 return <section className="course-assessment">
  <div className="assessment-heading"><div><div className="eyebrow">CHEFE DE FASE · PROVA DE DOMÍNIO</div><h2>Desafio final da região</h2><p>Uma prova integradora com questões sorteadas do percurso. Para vencer esta etapa, você precisa interpretar, decidir e aplicar conceitos — não apenas reconhecer definições.</p></div><Award size={27}/></div>
  {!unlocked?<div className="assessment-locked"><LockKeyhole size={19}/><div><strong>Etapa de consolidação</strong><span>Conclua pelo menos 70% das aulas para liberar a avaliação. Progresso atual: {completedCount} de {lessons.length}.</span></div></div>:!started?<div className="assessment-start"><div><strong>{best===null?"Sua primeira avaliação":"Melhor resultado registrado: "+best+"%"}</strong><span>Serão selecionadas até 8 questões. Você verá a explicação de cada resposta ao finalizar.</span></div><button className="button button-dark" onClick={start}>Enfrentar desafio final</button></div>:<>
   <div className="assessment-progress"><span>{Object.keys(answers).length} de {questions.length} respondidas</span><div><i style={{width:`${Object.keys(answers).length/questions.length*100}%`}}/></div></div>
   {questions.map((lesson,index)=><article className="assessment-question" key={lesson.id}><span>QUESTÃO {index+1} · {lesson.title}</span><h3>{lesson.question.prompt}</h3><div>{lesson.question.options.map((option,i)=><label key={option} className={`${answers[lesson.id]===i?"chosen":""} ${submitted&&i===lesson.question.correct?"correct":""} ${submitted&&answers[lesson.id]===i&&i!==lesson.question.correct?"incorrect":""}`}><input type="radio" name={`assessment-${lesson.id}`} checked={answers[lesson.id]===i} disabled={submitted} onChange={()=>setAnswers(old=>({...old,[lesson.id]:i}))}/>{option}</label>)}</div>{submitted&&<p className="assessment-explanation">{answers[lesson.id]===lesson.question.correct?"Correto. ":"Revise este ponto. "}{lesson.question.explanation}</p>}</article>)}
   {!submitted?<button className="button button-dark" disabled={Object.keys(answers).length!==questions.length} onClick={finish}>Concluir batalha e avaliar</button>:<div className="assessment-result"><CheckCircle2 size={22}/><div><strong>Resultado da batalha: {score} de {questions.length} ({Math.round(score/questions.length*100)}%)</strong><span>{score/questions.length>=.75?"Bom domínio. Continue praticando para consolidar a retenção.":"Use os comentários para revisar os pontos frágeis e tente novamente depois."}</span></div><button className="button button-outline" onClick={start}><RotateCcw size={14}/> Refazer com novas questões</button></div>}
  </>}
 </section>;
}
