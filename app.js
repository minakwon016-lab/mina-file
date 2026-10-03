(function(){
var d=document,b=d.body,$=function(s,r){return (r||d).querySelector(s)},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
var clamp=function(v,a,c){return Math.max(a,Math.min(c,v))};
var ease=function(t){return 1-Math.pow(1-t,3)};
var sub=b.classList.contains('sub');
/* loader */
var L=$('#loader'),fill=$('#loaderFill'),pct=$('#loaderPct'),p=0,loaded=false,t0=performance.now(),done=false,iv;
function finish(){if(done)return;done=true;clearInterval(iv);if(pct)pct.textContent='100%';if(fill)fill.style.clipPath='inset(0)';setTimeout(function(){if(L)L.classList.add('done');b.classList.add('ready');setTimeout(function(){if(L)L.remove()},1100)},sub?60:250)}
if(sub){setTimeout(finish,320)}
else{
  addEventListener('load',function(){loaded=true});setTimeout(function(){loaded=true},2500);
  iv=setInterval(function(){var target=loaded?100:Math.min(86,(performance.now()-t0)/14);p+=Math.max(2,(target-p)*.2);if(p>target)p=target;var v=Math.round(p);pct.textContent=v+'%';fill.style.clipPath='inset('+(100-v)+'% 0 0 0)';if(v>=100)finish()},30);
  setTimeout(finish,4000);
}
/* page transition */
d.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;
  var h=a.getAttribute('href')||'';if(h.charAt(0)!=='/')return;
  var u=new URL(a.href);if(u.pathname===location.pathname){if(!u.hash){e.preventDefault();menu(false);scrollTo({top:0,behavior:'smooth'})}return}
  e.preventDefault();b.classList.add('leaving');setTimeout(function(){location.href=a.href},520);
});
addEventListener('pageshow',function(e){if(e.persisted){b.classList.remove('leaving')}});
/* menu */
var mb=$('#menuBtn'),nav=$('#nav');if(nav)nav.hidden=false;
function menu(o){b.classList.toggle('menu',o);b.classList.toggle('lock',o);if(mb){mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기')}}
if(mb)mb.addEventListener('click',function(){menu(!b.classList.contains('menu'))});
$$('a',nav).forEach(function(a){a.addEventListener('click',function(){if(a.getAttribute('href').charAt(0)==='#')menu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.dataset.count!==undefined)count(e.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.split,[data-count]').forEach(function(e){io.observe(e)});
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('.clipin',e.target).forEach(function(c){c.classList.add('in')});io2.unobserve(e.target)}})},{threshold:.25});
$$('.prog__media').forEach(function(e){io2.observe(e)});
function count(el){var to=+el.dataset.count,s=performance.now(),dur=1400;(function f(){var t=clamp((performance.now()-s)/dur,0,1);el.textContent=Math.round(ease(t)*to);if(t<1)setTimeout(f,30)})()}
/* tilt + magnetic */
if(matchMedia('(hover:hover)').matches){
  $$('.tilt').forEach(function(t){var h=t.parentNode;h.addEventListener('mousemove',function(e){var r=h.getBoundingClientRect();t.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*16+'deg');t.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*12+'deg')});h.addEventListener('mouseleave',function(){t.style.setProperty('--ry','0deg');t.style.setProperty('--rx','0deg')})});
  $$('.pill').forEach(function(pl){pl.addEventListener('mousemove',function(e){var r=pl.getBoundingClientRect();pl.style.transform='translate('+((e.clientX-r.left)/r.width-.5)*10+'px,'+((e.clientY-r.top)/r.height-.5)*8+'px) scale(1.04)'});pl.addEventListener('mouseleave',function(){pl.style.transform=''})});
}
/* scroll scenes */
var field=$('.field'),pin=$('.field__pin'),track=$('#fieldTrack'),gh=$('.field .ghosth'),
    rows=$$('.matrix__row'),matrix=$('.matrix'),quote=$('.quote'),pols=$$('.pol'),
    acts=$('.acts'),aimgs=$$('.acts__imgs img'),atx=$$('.acts__txts article'),apg=$$('#actsPager button'),
    gals=$$('.gal'),themed=$$('[data-theme]').filter(function(e){return e!==b}),dots=$$('#fieldDots i'),
    pars=$$('[data-par]'),stack=$$('.stack .act'),bar=$('.prog-bar i'),cur=-1;
function prog(el,vh){var r=el.getBoundingClientRect();return clamp(-r.top/(r.height-vh),0,1)}
function setAct(i){if(i===cur)return;cur=i;[aimgs,atx,apg].forEach(function(g){g.forEach(function(e,k){e.classList.toggle('on',k===i)})})}
apg.forEach(function(bt,i){bt.addEventListener('click',function(){var r=acts.getBoundingClientRect();scrollTo({top:scrollY+r.top+(r.height-innerHeight)*((i+.5)/apg.length),behavior:'smooth'})})});
var ticking=false;
function frame(){
  ticking=false;var vh=innerHeight,vw=innerWidth,mob=vw<=820,y=scrollY;
  b.classList.toggle('scrolled',y>vh*.25);
  if(bar)bar.style.setProperty('--sp',clamp(y/(d.documentElement.scrollHeight-vh),0,1));
  var th=b.dataset.theme0||(b.dataset.theme0=b.dataset.theme);
  for(var i=0;i<themed.length;i++){var r=themed[i].getBoundingClientRect();if(r.top<=52&&r.bottom>52)th=themed[i].dataset.theme}
  if(b.dataset.theme!==th)b.dataset.theme=th;
  if(field&&!mob){
    var fr=field.getBoundingClientRect();
    pin.style.setProperty('--s',(clamp(fr.top/vh,0,1)*12+clamp(1+fr.top/vh,0,1)*6)*(fr.top>-vh?1:0)+'vw');
    var fp=clamp((-fr.top-vh*.15)/(fr.height-vh*1.15),0,1);
    track.style.transform='translate3d('+(-fp*(track.scrollWidth-vw))+'px,0,0)';
    gh.style.setProperty('--p',fp);
  }
  if(matrix){var mr=matrix.getBoundingClientRect(),mp=clamp((vh-mr.top)/(vh+mr.height),0,1);
    rows.forEach(function(row){var dir=+row.dataset.dir;row.style.transform='translate3d('+((dir<0?-mp:mp-1)*(row.scrollWidth-vw)*.9)+'px,0,0)'})}
  if(quote){var qp=prog(quote,vh);
    pols.forEach(function(el,i){var t=clamp(qp*(pols.length+.6)-.35-i,0,1),e=ease(t);el.style.setProperty('--ty',(1-e)*110+'vh');el.style.setProperty('--tr',(1-e)*12*(i%2?-1:1)+'deg')})}
  if(acts)setAct(Math.min(aimgs.length-1,Math.floor(prog(acts,vh)*aimgs.length)));
  gals.forEach(function(gal){var t=$('.gal__t',gal),gr=gal.getBoundingClientRect(),gp=clamp((vh-gr.top)/(vh+gr.height),0,1);
    t.style.transform='translate3d('+(-gp*Math.max(0,t.scrollWidth-vw*.8)+vw*.05)+'px,0,0)'});
  if(!mob)pars.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);
    if(el.classList.contains('pola'))el.style.setProperty('--py',(c*+el.dataset.par)+'px');else el.style.transform='translate3d(0,'+(c*+el.dataset.par)+'px,0)'});
  if(!mob)stack.forEach(function(el,i){var n=stack[i+1];if(!n){el.style.setProperty('--dim',0);return}var t=n.getBoundingClientRect().top;el.style.setProperty('--dim',clamp(1-t/vh,0,1)*.55)});
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();
if(track)track.addEventListener('scroll',function(){var c=track.children,m=0,best=1e9;for(var i=0;i<c.length;i++){var r=c[i].getBoundingClientRect(),dx=Math.abs(r.left+r.width/2-innerWidth/2);if(dx<best){best=dx;m=i}}dots.forEach(function(e,k){e.classList.toggle('on',k===m)})},{passive:true});
})();
