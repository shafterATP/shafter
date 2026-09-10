const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dayKey=()=>new Date().toISOString().slice(0,10);
const knowledge=[
["SCIENCE","Pourquoi le ciel est-il bleu ?","L’atmosphère diffuse davantage les courtes longueurs d’onde de la lumière solaire, notamment le bleu."],
["ESPACE","Pourquoi les étoiles brillent-elles ?","Elles produisent de l’énergie dans leur cœur grâce à la fusion nucléaire."],
["PHILOSOPHIE","Que signifie se connaître soi-même ?","C’est examiner ses croyances, ses limites et ses motivations pour mieux comprendre ses choix."],
["PSYCHOLOGIE","Qu’est-ce qu’un biais cognitif ?","Une tendance du cerveau à simplifier son jugement, parfois au prix d’une erreur."],
["DESIGN","Pourquoi la hiérarchie visuelle compte ?","Elle guide le regard et permet de comprendre rapidement l’information principale."],
["HISTOIRE","Qu’est-ce qu’une révolution industrielle ?","Une transformation profonde de la production, des technologies et de l’organisation du travail."],
["TECHNOLOGIE","À quoi sert le HTML ?","Le HTML structure les contenus d’une page web : titres, textes, images, liens et sections."],
["BIOLOGIE","Pourquoi le cœur bat-il ?","Des cellules spécialisées génèrent des signaux électriques qui coordonnent les contractions cardiaques."]
];
const defaultTasks=[
["design","🎨 30–60 min : exercice design / affiche / logo"],
["photoshop","🖥️ Photoshop : travailler une technique"],
["illustrator","✒️ Illustrator : travailler une technique"],
["web","💻 20–30 min : HTML / CSS"],
["culture","🧠 15–20 min : culture générale & science"],
["move","🏃 20–30 min : marcher / sport / mobilité"],
["morning","🌅 Routine du matin"],
["journal","📓 Faire mon bilan du soir"]
];
let tasks=JSON.parse(localStorage.tasks||"null")||defaultTasks;
let checks=JSON.parse(localStorage.checks||"{}");
let journal=localStorage.journal||"";
let kIndex=Number(localStorage.kIndex||0);
$("#date").textContent=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
function todayChecks(){return checks[dayKey()]||{}}
function save(){localStorage.tasks=JSON.stringify(tasks);localStorage.checks=JSON.stringify(checks)}
function renderTasks(container,showAll=false){
 const c=container; c.innerHTML="";
 const done=todayChecks();
 tasks.forEach(([id,text])=>{
  const row=document.createElement("div"); row.className="task"+(done[id]?" done":"");
  row.innerHTML=`<input type="checkbox" ${done[id]?"checked":""}><span>${text}</span>`;
  row.querySelector("input").onchange=e=>{checks[dayKey()]??={};checks[dayKey()][id]=e.target.checked;save();render();};
  c.append(row);
 });
}
function render(){
 renderTasks($("#todayTasks"));renderTasks($("#allTasks"));
 const d=todayChecks(), n=tasks.length, done=tasks.filter(x=>d[x[0]]).length, p=n?Math.round(done/n*100):0;
 $("#count").textContent=`${done}/${n}`;$("#pct").textContent=p+"%";
 $("#streak").textContent=Object.keys(checks).filter(k=>Object.values(checks[k]).some(Boolean)).length;
 $("#stats").innerHTML=`<div class="stat">Objectifs accomplis aujourd’hui <b>${done}/${n}</b></div><div class="stat">Taux du jour <b>${p}%</b></div><div class="stat">Jours actifs <b>${$("#streak").textContent}</b></div>`;
}
const daily=[
["Construire ma discipline","Aujourd’hui, le but est de faire une petite progression, même si la journée est imprévisible."],
["Améliorer mon regard","Observe, pratique et cherche à comprendre pourquoi un design fonctionne."],
["Apprendre quelque chose","Une connaissance utile aujourd’hui peut devenir une idée demain."],
["Construire Shafter","Chaque exercice est une petite brique de ton futur studio."]
];
let di=new Date().getDay()%daily.length;$("#dailyTitle").textContent=daily[di][0];$("#dailyText").textContent=daily[di][1];
function showKnowledge(){let k=knowledge[kIndex%knowledge.length];$("#theme").textContent=k[0];$("#knowledgeTitle").textContent=k[1];$("#knowledgeText").textContent=k[2]}
$("#newKnowledge").onclick=()=>{kIndex++;localStorage.kIndex=kIndex;showKnowledge()};showKnowledge();
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));$$(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.page).classList.add("active")});
$("#addTask").onclick=()=>{let v=$("#newTask").value.trim();if(v){tasks.push(["custom"+Date.now(),v]);$("#newTask").value="";save();render()}};
$("#save").onclick=()=>{localStorage.journal=$("#journal").value;$("#save").textContent="Enregistré ✓";setTimeout(()=>$("#save").textContent="Enregistrer",1200)};
$("#journal").value=journal;render();