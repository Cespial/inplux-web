/* inplux.co/deck · movimiento, navegación y video. Sin dependencias. */
(()=>{
const D=document.documentElement;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
D.classList.add('wow');if(calm)D.classList.add('calm');
const S=[...document.querySelectorAll('.s')];

/* 1 · cada lámina vive en un escenario de pantalla completa y escala a la ventana */
S.forEach(s=>{const st=document.createElement('div');st.className='stage';s.before(st);st.append(s)});
/* en pantallas chicas se escala con transform: con zoom, Chrome móvil impone su tamaño mínimo de letra y la lámina se desarma */
const fit=()=>{const vw=Math.min(innerWidth,screen.width||innerWidth),vh=Math.min(innerHeight,screen.height||innerHeight),k=Math.min(vw/1280,vh/720),small=k<.6;D.classList.toggle('tiny',small);
  S.forEach(s=>{s.style.zoom=small?'':k;s.style.transform=small?`translate(-50%,-50%) scale(${k})`:''})};
fit();requestAnimationFrame(fit);addEventListener('load',fit);addEventListener('resize',fit);

/* 2 · videos de fondo: se crean sin descargar y solo corren en la lámina visible */
document.querySelectorAll('img[data-video]').forEach(im=>{
  const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');
  v.preload='none';v.poster=im.getAttribute('src');v.dataset.src=im.dataset.video;v.setAttribute('aria-hidden','true');
  v.style.cssText=im.style.cssText;v.className=im.className;im.replaceWith(v)});

/* 3 · marcar qué se anima: titulares palabra por palabra, el resto en cascada */
const split=el=>{let n=0;const walk=node=>{[...node.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{
    if(!t)return;if(/^\s+$/.test(t)){f.append(t);return}const w=document.createElement('span');w.className='w';w.style.setProperty('--w',n++);w.textContent=t;f.append(w)});c.replaceWith(f)}
  else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(el)};
const RV=['.kicker','.lead','.head p','.top','.linebar','.grid>*','.cols>*','.wall>*','.caps>div','.tags>span','.chips>span',
 '.cards>*','.n','.pin','.tl>*','.strip>*','.row>*','.desc','.meta','.name','.attr','figure','.side','.media','.list>*','.q','.foot','.frame','.cap'];
S.forEach(s=>{
  s.querySelectorAll('h1,h2').forEach(split);
  const seen=new Set();let i=0;
  s.querySelectorAll(RV.join(',')).forEach(el=>{
    if(seen.has(el)||el.closest('.w')||[...seen].some(p=>p.contains(el)&&p!==el&&!p.matches('.grid>*,.cols>*')))return;
    seen.add(el);el.classList.add('rv');el.style.setProperty('--i',i++)});
});

/* 4 · cifras que cuentan desde cero (formato colombiano: 5.447) */
const fmt=n=>n.toLocaleString('es-CO');
document.querySelectorAll('#cifras strong').forEach(el=>{el.dataset.to=el.textContent.replace(/\./g,'')});
const count=s=>{if(calm)return;s.querySelectorAll('strong[data-to]').forEach((el,k)=>{
  const to=+el.dataset.to;if(!to)return;const t0=performance.now()+300+k*90,dur=1600;
  const step=t=>{const p=Math.min(Math.max((t-t0)/dur,0),1),e=1-Math.pow(1-p,4);el.textContent=fmt(Math.round(to*e));if(p<1)requestAnimationFrame(step)};
  el.textContent='0';requestAnimationFrame(step)})};

/* 5 · interfaz: progreso, contador, puntos, pista de desplazamiento */
const bar=document.createElement('div');bar.className='wow-bar';
const hud=document.createElement('div');hud.className='wow-hud';
hud.innerHTML='<b>01</b><span class="t"></span><button type="button" title="Pantalla completa (F)" aria-label="Pantalla completa">⤢</button>';
const dots=document.createElement('nav');dots.className='wow-dots';dots.setAttribute('aria-label','Láminas');
const name=s=>(s.querySelector('.kicker')?.textContent||s.querySelector('h1,h2')?.textContent||'').trim().replace(/\s+/g,' ');
S.forEach((s,k)=>{const a=document.createElement('a');a.href='#'+s.id;a.title=String(k+1).padStart(2,'0')+' · '+name(s);a.setAttribute('aria-label',a.title);
  a.onclick=e=>{e.preventDefault();go(k)};dots.append(a)});
const hint=document.createElement('div');hint.className='wow-hint';hint.innerHTML='<span>Desliza o usa las flechas</span><i></i>';
const rot=document.createElement('div');rot.className='wow-rot';rot.textContent='↻ Gira el teléfono para verla completa';
document.body.append(bar,hud,dots,hint,rot);
hud.querySelector('button').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else D.requestFullscreen?.()};

let cur=0;
const go=k=>{k=Math.max(0,Math.min(S.length-1,k));S[k].parentElement.scrollIntoView({behavior:calm?'auto':'smooth',block:'center'})};
const mark=k=>{cur=k;bar.style.setProperty('--p',(k+1)/S.length);hud.querySelector('b').textContent=String(k+1).padStart(2,'0')+' / '+S.length;
  hud.querySelector('.t').textContent=name(S[k]);[...dots.children].forEach((a,j)=>a.classList.toggle('on',j===k));
  if(k>0)hint.classList.add('off');history.replaceState(null,'','#'+S[k].id)};

/* 6 · entrar y salir de cada lámina: animaciones, video y cifras */
const io=new IntersectionObserver(es=>es.forEach(e=>{const s=e.target,k=S.indexOf(s);
  if(e.isIntersecting&&e.intersectionRatio>=.55){
    if(!s.classList.contains('in')){s.classList.add('in');if(s.id==='cifras')count(s)}
    mark(k);
    s.querySelectorAll('video').forEach(v=>{if(!v.src&&v.dataset.src)v.src=v.dataset.src;v.play().catch(()=>{})});
    const n=S[k+1];if(n)n.querySelectorAll('video').forEach(v=>{if(!v.src&&v.dataset.src){v.preload='metadata';v.src=v.dataset.src}});
  }else if(e.intersectionRatio<.05){s.classList.remove('in');s.querySelectorAll('video').forEach(v=>v.pause())}
}),{threshold:[0,.05,.55,.8]});
S.forEach(s=>io.observe(s));

/* 7 · teclado */
addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(['ArrowDown','ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();go(cur+1)}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur-1)}
  else if(e.key==='Home'){e.preventDefault();go(0)}else if(e.key==='End'){e.preventDefault();go(S.length-1)}
  else if(e.key==='f'||e.key==='F'){hud.querySelector('button').click()}});

/* 8 · foco del cursor en láminas oscuras e inclinación 3D de las capturas */
if(!calm&&matchMedia('(pointer:fine)').matches){
  S.forEach(s=>s.addEventListener('pointermove',e=>{const r=s.getBoundingClientRect();
    s.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');s.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')}));
  document.querySelectorAll('.prod-full .frame').forEach(f=>{
    f.addEventListener('pointermove',e=>{const r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      f.style.setProperty('--ry',((x-.5)*10).toFixed(2)+'deg');f.style.setProperty('--rx',((.5-y)*7).toFixed(2)+'deg');
      f.style.setProperty('--gx',x*100+'%');f.style.setProperty('--gy',y*100+'%')});
    f.addEventListener('pointerleave',()=>{f.style.setProperty('--ry','0deg');f.style.setProperty('--rx','0deg')})});
}

/* 8b · la interfaz desaparece tras unos segundos quietos */
let idle;const wake=()=>{D.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>D.classList.add('idle'),2600)};
['pointermove','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,wake,{passive:true}));wake();

/* 9 · abrir en la lámina del enlace (#id) */
const start=S.findIndex(s=>'#'+s.id===location.hash);
if(start>0)requestAnimationFrame(()=>S[start].parentElement.scrollIntoView({block:'center'}));
})();
