const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const feedback = document.getElementById("feedback");
const steps = [...document.querySelectorAll(".step")];

let phase = 0, score = 0, found = [], painted = false, chosenColor = "#35a853";
let selectedPictures = [], sequence = ["", "", ""];

const letters = ["A","V","M","F","V","O","T","V","L"];
const pictures = [
  {emoji:"👗",name:"Vestido",correct:true},
  {emoji:"🐄",name:"Vaca",correct:true},
  {emoji:"🎸",name:"Violão",correct:true},
  {emoji:"🗡️",name:"Espada",correct:false},
  {emoji:"🕯️",name:"Vela",correct:true},
  {emoji:"✈️",name:"Avião",correct:false}
];

function points(n){ score += n; scoreEl.textContent = score; }
function say(text){ feedback.textContent = text; }
function updateProgress(){ steps.forEach((s,i)=>s.classList.toggle("active",i<=phase)); }
function next(){
  phase++;
  feedback.textContent = "";
  updateProgress();
  render();
}
function render(){
  if(phase===0) renderFind();
  else if(phase===1) renderPaint();
  else if(phase===2) renderPictures();
  else if(phase===3) renderSequence();
  else renderFinish();
}
function renderFind(){
  game.innerHTML = `<span class="phase-tag">FASE 1</span><h2>Encontre a letra V!</h2>
  <p class="instruction">Toque em todas as letras <b>V</b> que aparecerem.</p>
  <div class="letter-grid">${letters.map((l,i)=>`<button class="letter-tile ${found.includes(i)?"found":""}" data-index="${i}">${found.includes(i)?"✓":l}</button>`).join("")}</div>
  <p class="counter">${found.length} de 3 letras encontradas</p><button class="primary" id="continue">Continuar</button>`;
  game.querySelectorAll("[data-index]").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.index);
    if(found.includes(i)) return;
    if(letters[i]==="V"){found.push(i);points(10);say("Isso mesmo! Você encontrou a letra V! ⭐");renderFind();}
    else say("Essa não é a letra V. Tente outra!");
  }));
  document.getElementById("continue").addEventListener("click",()=>{
    if(found.length===3) next(); else say("Encontre as três letras V para continuar.");
  });
}
function renderPaint(){
  const colors=["#35a853","#f5bd35","#ed6b8b","#5799df","#9a72d1"];
  game.innerHTML=`<span class="phase-tag">FASE 2</span><h2>Vamos pintar a letra V!</h2>
  <p class="instruction">Escolha uma cor e toque na letra para pintá-la.</p>
  <div class="palette">${colors.map(c=>`<button class="swatch ${chosenColor===c?"chosen":""}" data-color="${c}" style="background:${c}" aria-label="Escolher cor"></button>`).join("")}</div>
  <button class="paint-letter" id="paint" style="color:${painted?chosenColor:"white"};-webkit-text-stroke:3px ${painted?chosenColor:"#222"}">V</button>
  <p class="counter">${painted?"Letra pintada!":"Sua obra de arte está esperando."}</p>
  <button class="primary" id="continue">Continuar</button>`;
  game.querySelectorAll("[data-color]").forEach(b=>b.addEventListener("click",()=>{chosenColor=b.dataset.color;renderPaint();}));
  document.getElementById("paint").addEventListener("click",()=>{if(!painted){painted=true;points(10);say("Que letra V colorida! 🎨");renderPaint();}});
  document.getElementById("continue").addEventListener("click",()=>{if(painted)next();else say("Escolha uma cor e pinte a letra primeiro.");});
}
function renderPictures(){
  game.innerHTML=`<span class="phase-tag">FASE 3</span><h2>Quem começa com V?</h2>
  <p class="instruction">Toque nas figuras cujos nomes começam com a letra V.</p>
  <div class="picture-grid">${pictures.map((p,i)=>`<button class="picture-tile ${selectedPictures.includes(i)?(p.correct?"right":"wrong"):""}" data-picture="${i}" ${selectedPictures.includes(i)?"disabled":""}><span class="picture-emoji">${p.emoji}</span><b>${p.name}</b>${selectedPictures.includes(i)?`<small>${p.correct?"Começa com V!":"Tente outra vez!"}</small>`:""}</button>`).join("")}</div>
  <p class="counter">${selectedPictures.filter(i=>pictures[i].correct).length} figuras corretas encontradas</p>
  <button class="primary" id="continue">Continuar</button>`;
  game.querySelectorAll("[data-picture]").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.picture);selectedPictures.push(i);
    if(pictures[i].correct){points(10);say(`Muito bem! ${pictures[i].name} começa com V!`);}
    else say(`"${pictures[i].name}" não começa com V. Tente lembrar do som inicial!`);
    renderPictures();
  }));
  document.getElementById("continue").addEventListener("click",()=>{
    if(selectedPictures.filter(i=>pictures[i].correct).length===4)next();
    else say("Procure as quatro figuras que começam com V.");
  });
}
function renderSequence(){
  game.innerHTML=`<span class="phase-tag">FASE 4</span><h2>Complete a sequência!</h2>
  <p class="instruction">Escolha a letra V para preencher todos os espaços.</p>
  <div class="sequence-row"><span>V</span>${sequence.map((v,i)=>`<button class="sequence-slot ${v?"filled":""}" data-slot="${i}">${v||"?"}</button>`).join("")}<span>V</span></div>
  <p class="counter">Toque nos espaços para colocar ou retirar a letra.</p><button class="primary" id="check">Conferir sequência</button>`;
  game.querySelectorAll("[data-slot]").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.slot);sequence[i]=sequence[i]?"":"V";renderSequence();
  }));
  document.getElementById("check").addEventListener("click",()=>{
    if(sequence.every(v=>v==="V")){points(30);say("Sequência completa! Você arrasou! 🎉");setTimeout(next,800);}
    else say("Ainda não! Complete os três espaços com a letra V.");
  });
}
function renderFinish(){
  steps.forEach(s=>s.classList.add("active"));
  game.innerHTML=`<div class="final-card"><div class="trophy">🏆</div><span class="phase-tag">MISSÃO CONCLUÍDA</span>
  <h2>Você aprendeu a letra V!</h2><p class="instruction">Parabéns por completar todas as atividades.</p>
  <div class="final-score">${score}<small>pontos</small></div><button class="primary" id="restart">Jogar novamente</button></div>`;
  document.getElementById("restart").addEventListener("click",()=>{
    phase=0;score=0;found=[];painted=false;chosenColor="#35a853";selectedPictures=[];sequence=["","",""];
    scoreEl.textContent="0";feedback.textContent="";updateProgress();render();
  });
}
render();
