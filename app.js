'use strict';
const form=document.querySelector('#search');
const input=document.querySelector('#query');
const toggle=document.querySelector('#engine-toggle');
const panel=document.querySelector('#engines');
const icon=document.querySelector('#engine-icon');
const clear=document.querySelector('#search-clear');
let selected=0;
let closeTimer;
function closeEngines(){clearTimeout(closeTimer);panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
function openEngines(){clearTimeout(closeTimer);panel.hidden=false;toggle.setAttribute('aria-expanded','true');}
function selectEngine(index){
 selected=index;const engine=searchEngines[index];icon.src=engine.img;icon.alt=engine.name;toggle.title=engine.name+'：切换搜索引擎';form.action=engine.url;closeEngines();
 for(const button of panel.querySelectorAll('button'))button.setAttribute('aria-pressed',String(Number(button.dataset.index)===index));
 try{localStorage.setItem('thuers-engine',engine.name)}catch{}
}
for(const [index,engine] of searchEngines.entries()){
 const li=document.createElement('li');const button=document.createElement('button');button.type='button';button.dataset.index=index;
 const image=document.createElement('img');image.src=engine.img;image.alt='';button.append(image,document.createTextNode(engine.name));
 button.addEventListener('click',()=>{selectEngine(index);input.focus()});li.append(button);panel.querySelector('ul').append(li);
}
let initial=0;try{const saved=localStorage.getItem('thuers-engine');const legacy={baidu:'百度',google:'谷歌',bing:'必应',scholar:'学术镜'};const index=searchEngines.findIndex(e=>e.name===(legacy[saved]||saved));if(index>=0)initial=index}catch{}selectEngine(initial);
// Match the original hover menu; retain tap and keyboard access.
for(const element of [toggle,panel]){
 element.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')openEngines()});
 element.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){clearTimeout(closeTimer);closeTimer=setTimeout(closeEngines,140)}});
}
toggle.addEventListener('click',event=>{if(event.detail===0||!matchMedia('(hover: hover)').matches){if(panel.hidden)openEngines();else closeEngines()}else openEngines()});
document.addEventListener('click',event=>{if(!panel.contains(event.target)&&!toggle.contains(event.target))closeEngines()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){closeEngines();toggle.focus()}});
input.addEventListener('input',()=>{clear.hidden=!input.value});
clear.addEventListener('click',()=>{input.value='';clear.hidden=true;input.focus()});
form.addEventListener('submit',event=>{event.preventDefault();if(!input.value.trim()){input.focus();return}window.open(searchEngines[selected].url+encodeURIComponent(input.value),'_blank','noopener,noreferrer');closeEngines()});

const themeToggle=document.querySelector('#theme-toggle');
function updateThemeToggle(){
 const dark=document.documentElement.dataset.theme==='dark';
 themeToggle.textContent=dark?'# 浅色模式 #':'# 深色模式 #';
 themeToggle.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');
 themeToggle.setAttribute('aria-pressed',String(dark));
}
updateThemeToggle();
themeToggle.addEventListener('click',()=>{
 const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 document.documentElement.dataset.theme=theme;
 try{localStorage.setItem('thuers-theme',theme)}catch{}
 updateThemeToggle();
});
