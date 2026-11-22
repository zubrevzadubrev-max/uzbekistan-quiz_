"use strict";
const questions = [
 ["Какие три государственных символа Республики Узбекистан вы знаете?",["Флаг, столица и валюта","Флаг, герб и гимн","Герб, язык и валюта","Гимн, карта и столица"],1,"Статья 5 Конституции называет три государственных символа — флаг, герб и гимн."],
 ["Как называется официальный музыкально-поэтический символ государства?",["Народная песня","Праздничный марш","Государственный гимн","Национальный танец"],2,"Гимн объединяет торжественную музыку и официальный поэтический текст."],
 ["Какие образы можно увидеть на Государственном гербе?",["Птицу Хумо, солнце, колосья и хлопок","Льва, корону и щит","Орла, дубовые ветви и меч","Барса, башню и звёзды"],0,"В центре герба птица Хумо расправила крылья. Венок образуют колосья пшеницы и ветви хлопчатника."],
 ["Почему изображение Государственного флага нельзя произвольно изменять в учебном проекте?",["Его можно показывать только на бумаге","Его оформление выбирает школа","Его цвета меняются каждый год","Его вид и пропорции установлены законом"],3,"Чтобы точно изобразить флаг, нужно сохранить установленные цвета, пропорции и расположение элементов."],
 ["Какие источники помогут проверить официальную информацию?",["Комментарии в соцсетях","База законов LexUZ и портал gov.uz","Анонимные блоги","Пересказы знакомых"],1,"В LexUZ можно найти текст закона, а на правительственном портале — официальное описание символов."]
];
const $=id=>document.getElementById(id);
const stage=$("stage"), menu=$("menu");
const photos=["hero.jpg","dome.jpg","arch.jpg","flag.jpg","hero.jpg"];
let index=-1,score=0,picked=null,ctx,master,timer,beat=0;
function audio(){
 if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;ctx=new Audio();master=ctx.createGain();master.connect(ctx.destination);}
 master.gain.value=$("volume").value/100;
 if(ctx.state==="suspended")ctx.resume().catch(()=>{});
}
function tone(freq,time,length,level){
 if(!ctx)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+time;
 osc.frequency.value=freq;osc.connect(gain);gain.connect(master);
 gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(level,t+.045);
 gain.gain.exponentialRampToValueAtTime(.0001,t+length);osc.start(t);osc.stop(t+length+.02);
 osc.onended=()=>{osc.disconnect();gain.disconnect()};
}
function soundtrack(){
 clearInterval(timer);
 if(index<0||index>=questions.length||menu.open||!$("music").checked)return;
 audio();
 function play(){const melody=[293.66,369.99,440,554.37,329.63,440,493.88,369.99];tone(melody[beat%8],0,1.25,.055);if(beat%4===0)tone(beat%8===0?146.83:164.81,0,2,.042);beat++;}
 play();timer=setInterval(play,900);
}
function intro(){
 stage.innerHTML='<section class="hero"><img src="photos/hero.jpg" alt=""><div class="copy"><div class="tag">Интерактивная викторина</div><h1>Символы<br>Узбекистана</h1><p>Что вы знаете о флаге, гербе и гимне?</p><button id="start" class="primary">▶　Начать играть</button></div></section><div class="strip"><div class="chip"><i>▤</i>5 вопросов</div><div class="chip"><i>◇</i>4 варианта</div><div class="chip"><i>◷</i>Без таймера</div></div>';
 $("start").onclick=start;
}
function start(){index=0;score=0;picked=null;beat=0;audio();round();soundtrack();}
function round(){
 const [question,answers,correct,explanation]=questions[index];
 stage.innerHTML='<section class="round"><img class="photo" src="photos/'+photos[index]+'" alt=""><div><div class="counter">Вопрос '+(index+1)+' из 5</div><div class="meter">'+questions.map((_,i)=>'<i class="'+(i<=index?'on':'')+'"></i>').join('')+'</div><h2 tabindex="-1">'+question+'</h2><div class="answers"></div><div id="feedback" aria-live="polite"></div></div></section>';
 const grid=stage.querySelector(".answers");
 answers.forEach((answer,i)=>{const btn=document.createElement("button");btn.className="answer";btn.innerHTML='<span class="letter">'+"АБВГ"[i]+'</span>'+answer;grid.append(btn);btn.onclick=()=>choose(i);});
 stage.querySelector("h2").focus({preventScroll:true});
 function choose(i){
 if(picked!==null||menu.open)return;picked=i;const right=i===correct;if(right)score++;
 [...grid.children].forEach((b,k)=>{b.disabled=true;if(k===correct)b.classList.add("correct");else if(k===i)b.classList.add("wrong")});
 $("feedback").innerHTML='<div class="feedback"><b>'+(right?'✓ Верно!':'Правильный ответ — '+String.fromCharCode(1040+correct))+ '</b>'+explanation+'</div><button class="primary" id="next">'+(index===4?'Посмотреть результат':'Следующий вопрос')+'</button>';
 if($("effects").checked){audio();tone(right?523:330,0,.32,.15);tone(right?659:262,.18,.48,.13);}
 $("next").onclick=()=>{index++;picked=null;if(index<5)round();else finish()};$("next").focus({preventScroll:true});
 }
}
function finish(){soundtrack();stage.innerHTML='<section class="hero"><img src="photos/hero.jpg" alt=""><div class="copy"><div class="tag">Викторина завершена</div><h1>'+score+' из 5</h1><p>Правильных ответов</p><button class="primary" id="again">Сыграть ещё раз</button></div></section>';$("again").onclick=start;$("again").focus();}
function pause(){if(menu.open)return;menu.showModal();clearInterval(timer);if(ctx)ctx.suspend();}
$("pause").onclick=pause;$("resume").onclick=()=>menu.close();
menu.onclose=()=>{if(ctx)audio();soundtrack()};
$("restart").onclick=()=>{menu.close();start()};
$("volume").oninput=()=>{if(master)master.gain.value=$("volume").value/100};
$("full").onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$("full").textContent="Используйте F11 для полного экрана"}};
document.onfullscreenchange=()=>{$("full").textContent=document.fullscreenElement?"Выйти из полного экрана":"На весь экран"};
document.addEventListener("keydown",e=>{if(e.repeat||menu.open)return;if(e.key==="Escape"){e.preventDefault();pause()}else if(index>=0&&index<5&&/^[1-4]$/.test(e.key)){stage.querySelectorAll(".answer")[+e.key-1]?.click()}});
intro();
