const KEY="shafter_v2_state";
const today = new Date();
const dateLabel = today.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
const defaultState={
  page:"home",
  tasks:[
    {id:1,title:"Routine quotidienne",desc:"Habitudes & discipline",min:45,done:true},
    {id:2,title:"Design",desc:"Création",min:45,done:true},
    {id:3,title:"Culture générale",desc:"Apprentissage",min:20,done:true},
    {id:4,title:"HTML/CSS",desc:"Développement",min:30,done:false},
    {id:5,title:"Sport",desc:"Physique",min:30,done:false}
  ],
  progress:{design:80,web:40,culture:30,evolution:30,sport:50},
  xp:120, streak:7, project:18
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;

const topics={
  design:{title:"Design",icon:"✎",level:3,progress:80,desc:"Créer des visuels qui ont du sens et de l'impact.",courses:[
    ["Les bases du design","20 min · Débutant"],["Théorie des couleurs","15 min · Intermédiaire"],["Typographie & lisibilité","18 min · Intermédiaire"],["Créer une identité visuelle","25 min · Avancé"]]},
  web:{title:"Web",icon:"</>",level:2,progress:40,desc:"Apprends les bases du web et construis tes propres projets.",courses:[
    ["HTML — Les bases","25 min · Débutant"],["CSS — Mise en forme","30 min · Débutant"],["JavaScript — Première approche","35 min · Intermédiaire"],["Responsive Design","20 min · Intermédiaire"]]},
  culture:{title:"Culture générale",icon:"▤",level:1,progress:30,desc:"Comprendre le monde, élargir ta vision et développer ta curiosité.",courses:[
    ["Platon et la théorie des idées","20 min · Débutant"],["Les grandes civilisations","20 min · Débutant"],["Comment fonctionne le cerveau ?","18 min · Débutant"],["Les grands événements de l'histoire","25 min · Débutant"]]},
  evolution:{title:"Évolution",icon:"♙",level:1,progress:30,desc:"Développer ta discipline, tes habitudes et ta capacité à agir.",courses:[
    ["Construire une bonne routine","15 min · Débutant"],["Comprendre la motivation","15 min · Débutant"],["Gérer son temps","20 min · Débutant"]]},
  sport:{title:"Sport",icon:"♢",level:1,progress:50,desc:"Un programme progressif de 30 minutes, sans matériel.",courses:[
    ["Programme du jour — 30 min","30 min · Aujourd'hui"],["Progression pompes","10 min · Technique"],["Abdos & gainage","10 min · Technique"]]}
};

function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function pct(){const done=state.tasks.filter(t=>t.done).length;return Math.round(done/state.tasks.length*100);}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.className="show";setTimeout(()=>el.className="",1800)}
function nav(){
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===state.page));
}
function render(){nav(); const c=document.getElementById("content"); c.innerHTML=pages[state.page]?pages[state.page]():pages.home(); bind();}
function bind(){
 document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;save();render();});
 document.querySelectorAll("[data-task]").forEach(el=>el.onclick=()=>toggleTask(+el.dataset.task));
 document.querySelectorAll("[data-topic]").forEach(el=>el.onclick=()=>openTopic(el.dataset.topic));
 document.querySelectorAll("[data-article]").forEach(el=>el.onclick=()=>openArticle(el.dataset.article));
 document.querySelectorAll("[data-back]").forEach(el=>el.onclick=()=>{state.page=el.dataset.back||"learn";render()});
 const sportStart=document.getElementById("sportStart"); if(sportStart) sportStart.onclick=()=>startSport();
}
function toggleTask(id){const t=state.tasks.find(x=>x.id===id);t.done=!t.done;if(t.done)state.xp+=20;save();render();toast(t.done?"Objectif validé ✓":"Objectif retiré");}
function openTopic(id){state.page="topic:"+id;render()}
function openArticle(id){state.page="article:"+id;render()}
function startSport(){
 const t=state.tasks.find(x=>x.title==="Sport"); if(t&&!t.done){t.done=true;state.xp+=30;state.progress.sport=Math.min(100,state.progress.sport+5);save();render();toast("Séance terminée · +30 XP");}
}
const pages={
home(){
 const p=pct();
 return `<section class="hero">
   <p class="greeting">Bonjour,</p><div class="muted">Chaque effort compte.</div>
   <div class="date">${dateLabel}</div>
   <div class="quote">« La discipline est la clé de la liberté. »<small>— SHAFTER · MOT DU JOUR</small></div>
   <div class="progress-wrap">
    <div class="ring" style="--p:${p}%"><div class="ring-content"><strong>${p}%</strong><small>Progression du jour</small><small>${state.tasks.filter(t=>t.done).length}/${state.tasks.length}</small></div></div>
    <div class="stats"><div class="stat"><b>🔥 ${state.streak}</b><small>jours de série</small></div><div class="stat"><b>◎ ${state.tasks.filter(t=>t.done).length}/${state.tasks.length}</b><small>objectifs</small></div><div class="stat"><b>★ +${state.xp}</b><small>XP total</small></div><div class="stat"><b>⌁ ${state.project}%</b><small>projet SHAFTER</small></div></div>
   </div>
 </section>
 <section class="section"><div class="section-title"><h2>OBJECTIFS DU JOUR</h2><button data-page="objectives">Voir tout →</button></div>
 <div class="objective-grid">${state.tasks.slice(0,4).map(taskCard).join("")}</div></section>
 <section class="section"><div class="section-title"><h2>APPRENDRE & PROGRESSER</h2><button data-page="learn">Voir tout →</button></div>
 <div class="learn-grid">${topicCard("design")} ${topicCard("web")} ${topicCard("culture")} ${topicCard("evolution")}</div></section>
 <section class="section"><div class="section-title"><h2>CITATION DU JOUR</h2></div>
 <div class="quote">« On ne devient pas excellent par hasard. On le devient par répétition. »<small>— SHAFTER</small></div></section>
 <section class="section"><div class="section-title"><h2>SPORT · 30 MIN</h2><button data-page="sport">Ouvrir →</button></div>
 <div class="content-card"><b>Programme du jour</b><p class="muted">Échauffement · Pompes · Abdos · Gainage</p><button class="button" id="sportStart">Commencer / valider la séance</button></div></section>`;
},
objectives(){
 return `<h1 class="page-title">Objectifs</h1><p class="page-sub">Petits pas, grands résultats.</p>
 <div class="chips"><span class="chip active">Aujourd'hui</span><span class="chip">Cette semaine</span><span class="chip">Tout</span></div>
 <section class="section">${state.tasks.map(t=>`<div class="task ${t.done?"done":""}" data-task="${t.id}"><span class="box">${t.done?"✓":""}</span><div><h3>${t.title}</h3><p>${t.desc}</p></div><time>${t.min} min</time></div>`).join("")}</section>
 <div class="notice">Ton objectif : avancer chaque jour, même un peu. La régularité compte plus que la perfection.</div>`;
},
learn(){
 return `<h1 class="page-title">Apprendre & Progresser</h1><p class="page-sub">Explore. Apprends. Évolue.</p>
 <div class="chips"><span class="chip active">Tout</span><span class="chip">Design</span><span class="chip">Web</span><span class="chip">Culture</span><span class="chip">Sport</span></div>
 <div class="learn-grid section">${Object.keys(topics).map(topicCard).join("")}</div>
 <div class="content-card"><b>Comment ça fonctionne ?</b><p class="muted">Appuie sur une thématique pour trouver des cours courts, conseils, ressources, exercices pratiques et quiz. Ta progression est enregistrée sur ton téléphone.</p></div>`;
},
sport(){
 return `<h1 class="page-title">Sport</h1><p class="page-sub">Un corps fort, un esprit plus solide.</p>
 <div class="chips"><span class="chip active">Programme du jour</span><span class="chip">Programmes</span><span class="chip">Stats</span></div>
 <section class="section sport-session"><div class="section-title"><h2>PROGRAMME 30 MIN</h2><span class="chip active">Aujourd'hui</span></div>
 ${exercise("1","Échauffement","5 min · Jumping jacks · rotations · mobilité")}
 ${exercise("2","Pompes","10 min · 3 séries de 8–15 répétitions")}
 ${exercise("3","Abdos","10 min · 3 séries contrôlées")}
 ${exercise("4","Gainage","5 min · 3 × 40 secondes")}
 <button class="button" id="sportStart">▶ Commencer / terminer la séance</button></section>
 <section class="section content-card"><b>Progression</b><p class="muted">Débutant → Intermédiaire → Avancé</p><div class="bar"><i style="width:${state.progress.sport}%"></i></div><small class="muted">${state.progress.sport}%</small></section>`;
},
profile(){
 return `<h1 class="page-title">Profil</h1><section class="content-card"><div class="profile-head"><div class="avatar">S</div><div><b>shafter</b><div class="level">Niveau 3 · ${state.xp.toLocaleString("fr-FR")} XP</div></div></div></section>
 <section class="section"><div class="section-title"><h2>MA PROGRESSION</h2></div><div class="content-card profile-bars">${Object.entries({design:"Design",web:"Web",culture:"Culture générale",evolution:"Évolution",sport:"Sport"}).map(([k,v])=>`<div class="row"><span>${v}</span><div class="bar"><i style="width:${state.progress[k]}%"></i></div><small>${state.progress[k]}%</small></div>`).join("")}</div></section>
 <section class="section content-card"><b>ROAD TO SHAFTER</b><p class="muted">Compétences → Portfolio → Clients → Agence → Bâtiment</p><div class="bar"><i style="width:${state.project}%"></i></div><p class="muted">${state.project}% d'avancement</p></section>`;
}
};
function taskCard(t){return `<div class="obj ${t.done?"done":""}" data-task="${t.id}"><span class="check">${t.done?"✓":""}</span><h3>${t.title}</h3><p>${t.min} min · ${t.desc}</p><div class="bar"><i style="width:${t.done?100:0}%"></i></div></div>`}
function topicCard(id){const t=topics[id];return `<div class="learn-card" data-topic="${id}"><div class="emoji">${t.icon}</div><h3>${t.title}</h3><p>Niveau ${t.level} · ${t.progress}%</p><div class="bar"><i style="width:${t.progress}%"></i></div></div>`}
function exercise(n,title,desc){return `<div class="exercise"><span class="num">${n}</span><div><b>${title}</b><small>${desc}</small></div></div>`}

function topicPage(id){
 const t=topics[id];
 return `<button class="back" data-back="learn">← Apprendre & Progresser</button><h1 class="page-title">${t.icon} ${t.title}</h1><p class="page-sub">${t.desc}</p>
 <div class="content-card"><b>Niveau ${t.level}</b><div class="bar"><i style="width:${t.progress}%"></i></div><p class="muted">${t.progress}% de progression</p></div>
 <section class="section"><div class="section-title"><h2>COURS & FORMATIONS</h2></div><div class="content-card">${t.courses.map((c,i)=>`<div class="course" data-article="${id}-${i}"><div class="thumb">${t.icon}</div><div><h4>${c[0]}</h4><p>${c[1]}</p></div><span>›</span></div>`).join("")}</div></section>
 <section class="section content-card"><b>CONSEIL DU JOUR</b><p class="muted">${id==="design"?"Un bon design ne se remarque pas seulement : il se comprend.":id==="web"?"Apprends en construisant de vrais petits projets.":id==="culture"?"Une connaissance devient utile quand tu sais la relier au monde réel.":"La régularité gagne contre la motivation quand la motivation disparaît."}</p></section>`;
}
function articlePage(id){
 const [topic,i]=id.split("-"); const t=topics[topic]; const c=t.courses[+i]||t.courses[0];
 let body={
  design:["Le design ne consiste pas seulement à rendre une chose jolie.","Commence par la hiérarchie visuelle : décide ce que l’œil doit voir en premier, puis organise les éléments autour de cette priorité.","À retenir","Contraste · hiérarchie · espace · cohérence · simplicité"],
  web:["HTML donne la structure d'une page, CSS contrôle son apparence.","Commence par construire une page simple avec des titres, des paragraphes, des boutons et des sections. Ensuite, utilise CSS pour créer une interface responsive.","À retenir","Structure · lisibilité · responsive · pratique"],
  culture:["Platon et la théorie des idées","Platon distingue le monde sensible, que nous percevons, et un monde des idées qu’il considère comme plus stable et intelligible. Cette idée a profondément influencé la philosophie occidentale.","À retenir","Idées · connaissance · apparence · réalité"],
  evolution:["La discipline avant la motivation","La motivation varie. Une routine bien définie permet d'agir même les jours où l'envie est faible. Le but n'est pas d'être parfait, mais de réduire le nombre de jours où tu abandonnes.","À retenir","Routine · régularité · action · progression"]
 }[topic]||["Programme du jour","Une séance de 30 minutes adaptée à ton niveau, sans matériel.","À retenir","Technique · régularité · récupération · progression"];
 return `<button class="back" data-back="topic:${topic}">← ${t.title}</button><article class="article"><h1 class="page-title">${c[0]}</h1><p class="page-sub">${c[1]}</p><div class="content-card"><h2>${body[0]}</h2><p>${body[1]}</p><h3>${body[2]}</h3><p>${body[3]}</p></div><div class="content-card quiz"><b>MINI QUIZ</b><p>Quelle est la meilleure approche pour progresser ?</p><button class="choice correct">Pratiquer régulièrement et apprendre de ses erreurs ✓</button><button class="choice">Attendre de tout connaître avant de commencer</button><button class="choice">Changer de méthode chaque jour</button></div></article>`;
}
Object.assign(pages,{
});
const oldPages=pages;
Object.defineProperty(pages,"_dummy",{value:true});
function resolvePage(){
 const key=state.page;
 if(key.startsWith("topic:")) return topicPage(key.split(":")[1]);
 if(key.startsWith("article:")) return articlePage(key.split(":")[1]);
 return oldPages[key] ? oldPages[key]() : oldPages.home();
}
const originalRender=render;
render=function(){nav();document.getElementById("content").innerHTML=resolvePage();bind();};
document.getElementById("menuBtn").onclick=()=>toast("Menu SHAFTER · bientôt disponible");
document.getElementById("bellBtn").onclick=()=>toast("Aucune nouvelle notification");
render();