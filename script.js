/* Menu */
const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu');
const nav=document.querySelector('#nav');
function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(opened));menuButton.setAttribute('aria-label',opened?'Fechar menu':'Abrir menu');header.classList.add('solid');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuButton.focus();}});

/* Header sólido ao rolar */
function onScroll(){header.classList.toggle('solid',window.scrollY>60||nav.classList.contains('open'));}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* Ano */
document.querySelector('#year').textContent=new Date().getFullYear();

/* Botões que já escolhem o seguro no formulário */
document.querySelectorAll('[data-insurance]').forEach(link=>link.addEventListener('click',()=>{const s=document.querySelector('#insurance');const v=link.dataset.insurance;if([...s.options].some(o=>o.value===v||o.text===v))s.value=v;}));

/* Formulário de cotação → WhatsApp */
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
  const lines=['Olá, Essencial! Vim pelo site e quero ver meu valor.','','Seguro: '+data.insurance,'Nome: '+data.name,'WhatsApp: '+data.phone,'Cidade / estado: '+data.city];
  if(data.email)lines.push('E-mail: '+data.email);
  if(data.details)lines.push('','Sobre mim:',data.details);
  return 'https://wa.me/5521991959786?text='+encodeURIComponent(lines.join('\n'));
}
quoteForm.addEventListener('submit',event=>{
  event.preventDefault();
  validatePhone();
  if(!quoteForm.reportValidity())return;
  const data=Object.fromEntries([...new FormData(quoteForm)].map(([k,v])=>[k,String(v).trim()]));
  const url=buildQuotationUrl(data);
  if(window.fbq){fbq('track','Lead',{content_name:data.insurance});}
  if(window.gtag){gtag('event','generate_lead',{seguro:data.insurance});}
  setTimeout(()=>window.location.assign(url),300);
});

/* Cliques no WhatsApp (fora do formulário) */
document.querySelectorAll('a[href*="wa.me/"]').forEach(link=>link.addEventListener('click',()=>{if(window.fbq)fbq('track','Contact');if(window.gtag)gtag('event','clique_whatsapp');}));

/* Revelar ao rolar */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  const els=document.querySelectorAll('.section h2,.steps li,.card,.photo-tall,.feature-content,.form,.facts div,.faq details,.final-content,.strip-head');
  els.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=(i%4*70)+'ms';});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>io.observe(el));
})();
