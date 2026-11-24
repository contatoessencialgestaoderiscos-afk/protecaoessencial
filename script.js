const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('#nav');
function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(opened));menuButton.setAttribute('aria-label',opened?'Fechar menu':'Abrir menu');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuButton.focus();}});
document.querySelectorAll('[data-insurance]').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#insurance').value=link.dataset.insurance;}));
document.querySelector('#year').textContent=new Date().getFullYear();

const quoteForm=document.querySelector('#quotation-form');
const quotePhone=document.querySelector('#quote-phone');
function validBrazilianPhone(value){
  const digits=value.replace(/\D/g,'');
  const national=(digits.length===12||digits.length===13)&&digits.startsWith('55')?digits.slice(2):digits;
  return /^[1-9]{2}(?:[2-5]\d{7}|9\d{8})$/.test(national);
}
function validatePhone(){quotePhone.setCustomValidity(validBrazilianPhone(quotePhone.value)?'':'Informe um telefone válido com DDD, como (21) 99999-9999.');}
quotePhone.addEventListener('input',validatePhone);
quotePhone.addEventListener('blur',validatePhone);
function buildQuotationUrl(data){
  const lines=['Olá, Essencial! Gostaria de solicitar uma cotação.','','Seguro: '+data.insurance,'Nome: '+data.name,'WhatsApp: '+data.phone,'Cidade / estado: '+data.city];
  if(data.email)lines.push('E-mail: '+data.email);
  if(data.details)lines.push('','Sobre minha necessidade:',data.details);
  return 'https://wa.me/5521991959786?text='+encodeURIComponent(lines.join('\n'));
}
quoteForm.addEventListener('submit',event=>{
  event.preventDefault();
  validatePhone();
  if(!quoteForm.reportValidity())return;
  const data=Object.fromEntries([...new FormData(quoteForm)].map(([key,value])=>[key,value.trim()]));
  const url=buildQuotationUrl(data);
  if(window.fbq){fbq('track','Lead',{content_name:data.insurance});}
  if(window.gtag){gtag('event','generate_lead',{seguro:data.insurance});}
  setTimeout(()=>window.location.assign(url),300);
});



/* Essencial: progressively enhanced motion, accessible by design. */
(function(){
  const toggle=document.querySelector('.motion-toggle');
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused=reduce;
  if(toggle){
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'▶ Retomar movimento':'Ⅱ Pausar movimento';
    toggle.addEventListener('click',()=>{
      paused=!paused;root.classList.toggle('motion-paused',paused);
      toggle.setAttribute('aria-pressed',String(paused));
      toggle.textContent=paused?'▶ Retomar movimento':'Ⅱ Pausar movimento';
    });
  }
  if(reduce||!('IntersectionObserver' in window))return;
  const elements=document.querySelectorAll('.section-heading,.story,.about-copy,.brand-panel,.manifesto-content,.insurance-card,.steps article,.quotation-copy,.quotation-form,.transparency-grid>div,.faq-grid>div,.contact-grid>div');
  elements.forEach((el,index)=>{el.dataset.reveal='';el.style.setProperty('--delay',String(index%2*85)+'ms')});
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    });
  },{threshold:0.08,rootMargin:'0px 0px -25px 0px'});
  elements.forEach(el=>observer.observe(el));
  root.classList.add('motion-enabled');
  requestAnimationFrame(()=>elements.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<innerHeight&&rect.bottom>0){el.classList.add('is-visible');observer.unobserve(el)}
  }));
  const visual=document.querySelector('.hero-visual');
  if(visual&&window.matchMedia('(min-width: 801px)').matches){
    let scheduled=false;
    addEventListener('scroll',()=>{
      if(paused||scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{
        const rect=visual.getBoundingClientRect();
        if(rect.bottom>0&&rect.top<innerHeight)visual.style.setProperty('--shift',Math.max(-18,Math.min(18,-rect.top*.035))+'px');
        scheduled=false;
      });
    },{passive:true});
  }
})();

/* Meta Pixel: conta cliques em links do WhatsApp (fora do formulario). */
document.querySelectorAll('a[href*="wa.me/"]').forEach(link=>link.addEventListener('click',()=>{if(window.fbq)fbq('track','Contact');if(window.gtag)gtag('event','clique_whatsapp');}));
