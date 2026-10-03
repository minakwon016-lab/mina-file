(function(){
var d=document,b=d.body,$=function(s,r){return (r||d).querySelector(s)},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
var clamp=function(v,a,c){return Math.max(a,Math.min(c,v))};
var ease=function(t){return 1-Math.pow(1-t,3)};
/* loader */
var L=$('#loader'),fill=$('#loaderFill'),pct=$('#loaderPct'),p=0,loaded=false,t0=performance.now();
addEventListener('load',function(){loaded=true});
setTimeout(function(){loaded=true},2500);
var done=false;function finish(){if(done)return;done=true;clearInterval(iv);pct.textContent='100%';fill.style.clipPath='inset(0)';setTimeout(function(){L.classList.add('done');b.classList.add('ready');setTimeout(function(){L.remove()},1100)},250)}
var iv=setInterval(function(){
  var target=loaded?100:Math.min(86,(performance.now()-t0)/14);
  p+=Math.max(2,(target-p)*.2); if(p>target)p=target;
  var v=Math.round(p); pct.textContent=v+'%'; fill.style.clipPath='inset('+(100-v)+'% 0 0 0)';
  if(v>=100)finish();
},30);
setTimeout(finish,4000);
/* menu */
var mb=$('#menuBtn'),nav=$('#nav');nav.hidden=false;
function menu(o){b.classList.toggle('menu',o);b.classList.toggle('lock',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기')}
mb.addEventListener('click',function(){menu(!b.classList.contains('menu'))});
$$('a',nav).forEach(function(a){a.addEventListener('click',function(){menu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
$$('.rv,.draw').forEach(function(e){io.observe(e)});
/* scroll scenes */
var field=$('.field'),pin=$('.field__pin'),track=$('#fieldTrack'),gh=$('.field .ghosth'),
    rows=$$('.matrix__row'),matrix=$('.matrix'),quote=$('.quote'),pols=$$('.pol'),
    acts=$('.acts'),aimgs=$$('.acts__imgs img'),atx=$$('.acts__txts article'),apg=$$('#actsPager button'),
    galT=$('#galT'),gal=$('.gal'),themed=$$('[data-theme]').filter(function(e){return e!==b}),dots=$$('#fieldDots i'),cur=-1;
function prog(el,vh){var r=el.getBoundingClientRect();return clamp(-r.top/(r.height-vh),0,1)}
function setAct(i){if(i===cur)return;cur=i;[aimgs,atx,apg].forEach(function(g){g.forEach(function(e,k){e.classList.toggle('on',k===i)})})}
apg.forEach(function(bt,i){bt.addEventListener('click',function(){var r=acts.getBoundingClientRect();scrollTo({top:scrollY+r.top+(r.height-innerHeight)*((i+.5)/apg.length),behavior:'smooth'})})});
var ticking=false;
function frame(){
  ticking=false;var vh=innerHeight,vw=innerWidth,mob=vw<=820,y=scrollY;
  b.classList.toggle('scrolled',y>vh*.25);
  /* header theme */
  var th='light';for(var i=0;i<themed.length;i++){var r=themed[i].getBoundingClientRect();if(r.top<=52&&r.bottom>52)th=themed[i].dataset.theme}
  if(b.dataset.theme!==th)b.dataset.theme=th;
  /* field */
  if(!mob){
    var fr=field.getBoundingClientRect();
    pin.style.setProperty('--s',(clamp(fr.top/vh,0,1)*12+clamp(1+fr.top/vh,0,1)*6)*(fr.top>-vh?1:0)+'vw');
    var fp=clamp((-fr.top-vh*.15)/(fr.height-vh*1.15),0,1);
    track.style.transform='translate3d('+(-fp*(track.scrollWidth-vw))+'px,0,0)';
    gh.style.setProperty('--p',fp);
  }
  /* matrix */
  var mr=matrix.getBoundingClientRect(),mp=clamp((vh-mr.top)/(vh+mr.height),0,1);
  rows.forEach(function(row,i){var dir=+row.dataset.dir;row.style.transform='translate3d('+((dir<0?-mp:mp-1)*(row.scrollWidth-vw)*.9-(dir<0?0:0))+'px,0,0)'});
  /* polaroids */
  var qp=prog(quote,vh);
  pols.forEach(function(el,i){var t=clamp(qp*(pols.length+.6)-.35-i,0,1),e=ease(t);el.style.setProperty('--ty',(1-e)*110+'vh');el.style.setProperty('--tr',(1-e)*12*(i%2?-1:1)+'deg')});
  /* activities */
  setAct(Math.min(aimgs.length-1,Math.floor(prog(acts,vh)*aimgs.length)));
  /* gallery */
  var gr=gal.getBoundingClientRect(),gp=clamp((vh-gr.top)/(vh+gr.height),0,1);
  galT.style.transform='translate3d('+(-gp*Math.max(0,galT.scrollWidth-vw*.8)+vw*.05)+'px,0,0)';
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();
/* mobile dots */
track.addEventListener('scroll',function(){var c=track.children,m=0,best=1e9;for(var i=0;i<c.length;i++){var r=c[i].getBoundingClientRect(),dx=Math.abs(r.left+r.width/2-innerWidth/2);if(dx<best){best=dx;m=i}}dots.forEach(function(e,k){e.classList.toggle('on',k===m)})},{passive:true});
})();
