/* Arena: los mismos granos viajan por toda la presentación y forman la figura de cada lámina.
   Sin dependencias. Sin JS, en impresión o con movimiento reducido, se ve el PNG o el estado final. */
(()=>{
const D=document.documentElement;
if(location.search.includes('print=1')){D.classList.add('p1');return}
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
D.classList.add('arena');if(calm)D.classList.add('calm');
const S=[...document.querySelectorAll('.s')];
S.forEach(s=>{const st=document.createElement('div');st.className='stage';s.before(st);st.append(s)});

/* escala de lámina en horizontal */
const vertical=()=>matchMedia('(max-aspect-ratio:1/1)').matches;
const fit=()=>{const k=Math.min(innerWidth/1280,innerHeight/720);S.forEach(s=>s.style.setProperty('--k',vertical()?1:k))};
fit();

/* formas decodificadas */
const NMAX=(Math.min(innerWidth,innerHeight)<600||(navigator.deviceMemory&&navigator.deviceMemory<4))?5000:7000;
const formas={};
for(const[n,f]of Object.entries(window.FORMAS)){
  const b=atob(f.p),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  const a=new Uint16Array(u.buffer),m=Math.min(a.length/2,NMAX),x=new Float32Array(m),y=new Float32Array(m),t=new Uint8Array(m);
  for(let i=0;i<m;i++){const v=a[i*2];t[i]=v>>15;x[i]=((v&32767)+.5)/f.c;y[i]=(a[i*2+1]+.5)/f.f}
  formas[n]={x,y,t,m,c:f.c,f:f.f,asp:f.a/f.b};
}

/* lienzo */
const cv=document.createElement('canvas');cv.id='arena';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
const ctx=cv.getContext('2d');let W=0,H=0,dpr=1;
const talla=()=>{dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};talla();

/* granos: posición, origen y destino (destino normalizado a la caja de la figura) */
const N=NMAX,F=n=>new Float32Array(n);
const px=F(N),py=F(N),sx=F(N),sy=F(N),nx=F(N),ny=F(N),del=F(N),dur=F(N),cur=F(N),dx=F(N),dy=F(N),vx=F(N),vy=F(N);
const teal=new Uint8Array(N),teal0=new Uint8Array(N),polvo=new Uint8Array(N),polvo0=new Uint8Array(N);
const rnd=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v)};
/* arranque: un montón de arena al pie de la pantalla */
for(let i=0;i<N;i++){const a=rnd(i,1),b=rnd(i,2),u=(a+b)/2-.5;px[i]=W/2+u*W*1.15;py[i]=H-Math.pow(rnd(i,3),1.6)*(1-Math.abs(u)*2)*H*.3;polvo[i]=0}

let actual=null,caja=null,t0=0,fin=0,vivo=false,tam=2;
const medir=()=>{if(!actual)return;const f=actual.querySelector('.fig');if(!f){caja=null;return}const r=f.getBoundingClientRect(),fo=formas[f.dataset.forma];
  let w=r.width,h=r.height;if(w/h>fo.asp)w=h*fo.asp;else h=w/fo.asp;caja={x:r.left+(r.width-w)/2,y:r.top+(r.height-h)/2,w,h,cel:w/fo.c}};

/* empareja por franjas: la forma se transforma en vez de volverse nube */
const orden=(xs,ys,n,j)=>{const idx=new Uint32Array(n),k=new Float64Array(n);for(let i=0;i<n;i++){idx[i]=i;k[i]=Math.floor((ys[i]+(rnd(i,j)-.5)*.05)*22)*10+xs[i]+(rnd(i,j+1)-.5)*.3}return[...idx].sort((a,b)=>k[a]-k[b])};

function hacia(s,inicial){
  actual=s;const fe=s.querySelector('.fig'),fo=fe&&formas[fe.dataset.forma];medir();
  const ahora=performance.now();
  const ox=F(N),oy=F(N);for(let i=0;i<N;i++){ox[i]=px[i]/W;oy[i]=py[i]/H}
  const og=orden(ox,oy,N,5);
  teal0.set(teal);polvo0.set(polvo);
  const m=fo?fo.m:0,tg=fo?orden(fo.x,fo.y,m,7):[];
  for(let j=0;j<N;j++){const i=og[j],e=Math.floor(j*m/N);
    /* cada punto de la figura recibe un grano; los que sobran quedan como polvo alrededor */
    const sobra=!m||(j>0&&Math.floor((j-1)*m/N)===e);
    sx[i]=px[i];sy[i]=py[i];
    if(sobra){nx[i]=rnd(i,11)*1.3-.15;ny[i]=rnd(i,12)*1.25-.12;teal[i]=0;polvo[i]=1}
    else{const d=tg[Math.min(e,m-1)];nx[i]=fo.x[d];ny[i]=fo.y[d];teal[i]=fo.t[d];polvo[i]=0}
    /* barrido de abajo hacia arriba, como la línea que construyó el puente */
    const v=m&&!sobra?1-ny[i]:rnd(i,13);
    del[i]=calm?0:(inicial?300:0)+v*(inicial?1500:750)+rnd(i,14)*(inicial?700:450);
    dur[i]=calm?0:(inicial?1400:900)+rnd(i,15)*700;cur[i]=(rnd(i,16)-.5)*(inicial?260:170);
  }
  t0=ahora;fin=ahora+(inicial?4000:2700);despertar();
}

let ratonX=-1e4,ratonY=-1e4,agitado=0;
const ease=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2;
function cuadro(t){
  vivo=false;medir();
  const moviendo=t<fin;let disturb=false;
  ctx.clearRect(0,0,W,H);
  const c=caja,cx=c?c.x:W*.1,cy=c?c.y:H*.1,cw=c?c.w:W*.8,ch=c?c.h:H*.8;
  tam=Math.max(1,c?Math.min(c.cel*.66,3.2):1.6);
  const buckets=[[],[],[]];
  for(let i=0;i<N;i++){
    const tx=cx+nx[i]*cw,ty=cy+ny[i]*ch;let x=tx,y=ty,g=1;
    if(moviendo){const e0=(t-t0-del[i])/(dur[i]||1);const e=e0<=0?0:e0>=1?1:ease(e0);g=e;
      const k=Math.sin(Math.PI*e);x=sx[i]+(tx-sx[i])*e+cur[i]*k*.6;y=sy[i]+(ty-sy[i])*e-Math.abs(cur[i])*k*.35}
    /* la arena se aparta del cursor y vuelve */
    const ax=x+dx[i]-ratonX,ay=y+dy[i]-ratonY,d2=ax*ax+ay*ay;
    if(d2<12100&&!calm){const d=Math.sqrt(d2)||1,f=(110-d)/110*3.2;vx[i]+=ax/d*f;vy[i]+=ay/d*f}
    if(dx[i]||dy[i]||vx[i]||vy[i]){vx[i]=(vx[i]-dx[i]*.045)*.86;vy[i]=(vy[i]-dy[i]*.045)*.86;dx[i]+=vx[i];dy[i]+=vy[i];
      if(Math.abs(dx[i])+Math.abs(dy[i])+Math.abs(vx[i])+Math.abs(vy[i])<.08){dx[i]=dy[i]=vx[i]=vy[i]=0}else disturb=true}
    px[i]=x+dx[i];py[i]=y+dy[i];
    const pol=g>.7?polvo[i]:polvo0[i],tl=g>.6?teal[i]:teal0[i];
    buckets[pol?2:tl?1:0].push(i);
  }
  const pinta=(l,col,al,z)=>{ctx.fillStyle=col;ctx.globalAlpha=al;for(const i of l)ctx.fillRect(Math.round(px[i]),Math.round(py[i]),z,z)};
  pinta(buckets[2],'#f6f4ee',.13,Math.max(1,tam*.6));pinta(buckets[0],'#f6f4ee',.92,tam);pinta(buckets[1],'#00d7ca',1,tam);ctx.globalAlpha=1;
  if(moviendo||disturb)despertar();
}
function despertar(){if(!vivo){vivo=true;requestAnimationFrame(cuadro)}}

/* interfaz: progreso, puntos, pista */
const bar=document.createElement('div');bar.className='ui-bar';
const nav=document.createElement('nav');nav.className='ui-nav';nav.setAttribute('aria-label','Láminas');
const pista=document.createElement('div');pista.className='ui-pista';pista.textContent=matchMedia('(pointer:fine)').matches?'Baje con la rueda o las flechas. La arena responde al cursor.':'Deslice hacia abajo. La arena responde al dedo.';
document.body.append(bar,nav,pista);
const ir=k=>{k=Math.max(0,Math.min(S.length-1,k));S[k].parentElement.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'})};
S.forEach((s,k)=>{const a=document.createElement('a');a.href='#'+s.id;a.title=(s.querySelector('h1,h2')?.textContent||'').trim();a.setAttribute('aria-label',a.title);a.onclick=e=>{e.preventDefault();ir(k)};nav.append(a)});

let cur_k=-1;
const marcar=(k,inicial)=>{if(k===cur_k)return;cur_k=k;S[k].classList.add('in');bar.style.setProperty('--p',(k+1)/S.length);[...nav.children].forEach((a,j)=>a.classList.toggle('on',j===k));if(k>0)pista.classList.add('off');history.replaceState(null,'','#'+S[k].id);hacia(S[k],inicial)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)marcar(S.indexOf(e.target))}),{rootMargin:'-50% 0px -50% 0px'});

addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();ir(cur_k+1)}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();ir(cur_k-1)}
  else if(e.key==='Home'){e.preventDefault();ir(0)}else if(e.key==='End'){e.preventDefault();ir(S.length-1)}});
addEventListener('pointermove',e=>{ratonX=e.clientX;ratonY=e.clientY;despertar()},{passive:true});
addEventListener('pointerleave',()=>{ratonX=ratonY=-1e4});
addEventListener('touchend',()=>{ratonX=ratonY=-1e4},{passive:true});
addEventListener('scroll',()=>despertar(),{passive:true});
addEventListener('resize',()=>{fit();talla();medir();despertar()});

const inicio=Math.max(0,S.findIndex(s=>'#'+s.id===location.hash));
const arrancar=()=>{if(inicio>0)S[inicio].parentElement.scrollIntoView({block:'start'});marcar(inicio,true);S.forEach(s=>io.observe(s));
  window.arenaLista=true};
(document.fonts?.ready||Promise.resolve()).then(()=>requestAnimationFrame(arrancar));
})();
