/* ============================================
   VIDHAN LONARE — PORTFOLIO SCRIPT
   Amber / Orange · Charcoal · Glass
   ============================================ */

   'use strict';

   /* ============================================
      1. CUSTOM CURSOR
      ============================================ */
   const cursorOuter = document.getElementById('cursorOuter');
   const cursorDot   = document.getElementById('cursorDot');
   
   let mouseX = 0, mouseY = 0;
   let outerX = 0, outerY = 0;
   
   document.addEventListener('mousemove', (e) => {
     mouseX = e.clientX;
     mouseY = e.clientY;
     cursorDot.style.left = mouseX + 'px';
     cursorDot.style.top  = mouseY + 'px';
   });
   
   (function animateCursor() {
     outerX += (mouseX - outerX) * 0.12;
     outerY += (mouseY - outerY) * 0.12;
     cursorOuter.style.left = outerX + 'px';
     cursorOuter.style.top  = outerY + 'px';
     requestAnimationFrame(animateCursor);
   })();
   
   document.querySelectorAll('a, button, .skill-card, .project-card, .info-card').forEach(el => {
     el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
     el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
   });
   
   /* ============================================
      2. PARTICLE CANVAS — warm amber tones
      ============================================ */
   const canvas = document.getElementById('particleCanvas');
   const ctx    = canvas.getContext('2d');
   
   function resizeCanvas() {
     canvas.width  = canvas.offsetWidth;
     canvas.height = canvas.offsetHeight;
   }
   resizeCanvas();
   window.addEventListener('resize', resizeCanvas);
   
   const PARTICLE_COUNT = 80;
   const particles = [];
   
   class Particle {
     constructor() { this.reset(true); }
     reset(initial = false) {
       this.x      = Math.random() * canvas.width;
       this.y      = initial ? Math.random() * canvas.height : canvas.height + 10;
       this.vx     = (Math.random() - 0.5) * 0.25;
       this.vy     = -Math.random() * 0.45 - 0.1;
       this.radius = Math.random() * 1.5 + 0.4;
       this.alpha  = Math.random() * 0.45 + 0.1;
       // warm palette: orange, amber gold, warm white
       const r = Math.random();
       this.color = r > 0.6 ? '232,110,26' : r > 0.3 ? '245,200,66' : '240,236,230';
     }
     update() {
       this.x += this.vx;
       this.y += this.vy;
       if (this.y < -10) this.reset();
     }
     draw() {
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
       ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
       ctx.fill();
     }
   }
   
   function drawConnections() {
     for (let i = 0; i < particles.length; i++) {
       for (let j = i + 1; j < particles.length; j++) {
         const dx   = particles[i].x - particles[j].x;
         const dy   = particles[i].y - particles[j].y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         if (dist < 100) {
           ctx.beginPath();
           ctx.moveTo(particles[i].x, particles[i].y);
           ctx.lineTo(particles[j].x, particles[j].y);
           ctx.strokeStyle = `rgba(232,110,26,${0.045 * (1 - dist / 100)})`;
           ctx.lineWidth = 0.5;
           ctx.stroke();
         }
       }
     }
   }
   
   for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
   
   (function animateParticles() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawConnections();
     particles.forEach(p => { p.update(); p.draw(); });
     requestAnimationFrame(animateParticles);
   })();
   
   /* ============================================
      3. NAVBAR SCROLL
      ============================================ */
   const navbar = document.getElementById('navbar');
   window.addEventListener('scroll', () => {
     navbar.classList.toggle('scrolled', window.scrollY > 60);
   });
   
   /* ============================================
      4. INTERSECTION OBSERVER — REVEAL
      ============================================ */
   const revealObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         entry.target.classList.add('visible');
         revealObserver.unobserve(entry.target);
       }
     });
   }, { threshold: 0.12 });
   
   document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));
   
   /* ============================================
      5. TIMELINE PROGRESS
      ============================================ */
   const timelineSection  = document.getElementById('experience');
   const timelineProgress = document.getElementById('timelineProgress');
   const timelineItems    = document.querySelectorAll('.timeline-item');
   
   const timelineObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
   }, { threshold: 0.2 });
   timelineItems.forEach(item => timelineObserver.observe(item));
   
   window.addEventListener('scroll', () => {
     if (!timelineSection || !timelineProgress) return;
     const rect    = timelineSection.getBoundingClientRect();
     const viewH   = window.innerHeight;
     const scrolled = Math.max(0, viewH - rect.top);
     const pct     = Math.min(100, (scrolled / (timelineSection.offsetHeight + viewH * 0.4)) * 100);
     timelineProgress.style.height = pct + '%';
   });
   
   /* ============================================
      6. SKILL CARDS — 3D TILT
      ============================================ */
   const SKILLS = [
     { name: 'Java',           category: 'Language',    icon: '☕' },
     { name: 'JavaScript',     category: 'Language',    icon: '⚡' },
     { name: 'HTML & CSS',     category: 'Language',    icon: '🎨' },
     { name: 'Spring Boot',    category: 'Framework',   icon: '🌿' },
     { name: 'Spring Security',category: 'Framework',   icon: '🔒' },
     { name: 'Spring Data JPA',category: 'Framework',   icon: '🗃️' },
     { name: 'Hibernate ORM',  category: 'Database',    icon: '🗄️' },
     { name: 'PostgreSQL',     category: 'Database',    icon: '🐘' },
     { name: 'MySQL',          category: 'Database',    icon: '🐬' },
     { name: 'AWS EC2',        category: 'Cloud',       icon: '☁️' },
     { name: 'Nginx',          category: 'DevOps',      icon: '⚙️' },
     { name: 'Git & GitHub',   category: 'Tools',       icon: '🔀' },
     { name: 'REST APIs',      category: 'Backend',     icon: '🔌' },
     { name: 'Mailgun',        category: 'Integration', icon: '📧' },
     { name: 'Postman',        category: 'Tools',       icon: '🧪' },
   ];
   
   const skillsGrid = document.getElementById('skillsGrid');
   
   SKILLS.forEach((skill, i) => {
     const card = document.createElement('div');
     card.className = 'skill-card reveal-up';
     card.style.transitionDelay = `${i * 0.04}s`;
     card.innerHTML = `
       <div class="skill-icon">${skill.icon}</div>
       <div class="skill-name">${skill.name}</div>
       <div class="skill-category">${skill.category}</div>
     `;
     card.addEventListener('mousemove', (e) => {
       const rect = card.getBoundingClientRect();
       const rx = ((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)) * 10;
       const ry = -((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)) * 10;
       card.style.transform = `perspective(400px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
     });
     card.addEventListener('mouseleave', () => { card.style.transform = ''; });
     skillsGrid.appendChild(card);
   });
   
   document.querySelectorAll('.skill-card').forEach(el => revealObserver.observe(el));
   
   /* ============================================
      7. MAGNETIC BUTTONS
      ============================================ */
   function initMagnetic() {
     document.querySelectorAll('.magnetic').forEach(el => {
       el.addEventListener('mousemove', (e) => {
         const rect = el.getBoundingClientRect();
         const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.35;
         const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.35;
         el.style.transform = `translate(${dx}px, ${dy}px)`;
       });
       el.addEventListener('mouseleave', () => { el.style.transform = ''; });
     });
   }
   initMagnetic();
   
   /* ============================================
      8. COUNTER ANIMATION
      ============================================ */
   function animateCounter(el) {
     const target   = parseInt(el.getAttribute('data-target'), 10);
     const duration = 1600;
     const start    = performance.now();
     const update   = (now) => {
       const p = Math.min((now - start) / duration, 1);
       el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
       if (p < 1) requestAnimationFrame(update);
     };
     requestAnimationFrame(update);
   }
   
   const counterObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
         counterObserver.unobserve(entry.target);
       }
     });
   }, { threshold: 0.5 });
   
   const aboutSection = document.getElementById('about');
   if (aboutSection) counterObserver.observe(aboutSection);
   
   /* ============================================
      9. CONTACT MODAL
      ============================================ */
   const modalOverlay = document.getElementById('modalOverlay');
   const modalClose   = document.getElementById('modalClose');
   const contactBtn   = document.getElementById('contactBtn');
   
   const openModal  = () => { modalOverlay.classList.add('active');    document.body.style.overflow = 'hidden'; };
   const closeModal = () => { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; };
   
   if (contactBtn)   contactBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
   if (modalClose)   modalClose.addEventListener('click', closeModal);
   if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
   document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
   
  const EMAILJS_PUBLIC_KEY  = 'cz_8hnONdkM-1NIVI';
  const EMAILJS_SERVICE_ID  = 'service_vw00rtg';
  const EMAILJS_TEMPLATE_ID = 'template_r6h6izi';
  
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      const name = document.getElementById('formName')?.value.trim() || '';
      const email = document.getElementById('formEmail')?.value.trim() || '';
      const message = document.getElementById('formMessage')?.value.trim() || '';
  
      if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        btn.innerHTML = '<span>Configure EmailJS First</span>';
        btn.style.background = '#f59e0b';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
        }, 2200);
        return;
      }
  
      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';
  
      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          time: new Date().toLocaleString(),
          message,
          reply_to: email
        });
  
        btn.innerHTML = '<span>Message Sent ✓</span>';
        btn.style.background = '#22c55e';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
          closeModal();
        }, 1800);
      } catch (error) {
        console.error('EmailJS send failed:', error);
        btn.innerHTML = '<span>Failed. Try Again</span>';
        btn.style.background = '#ef4444';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 2200);
      }
    });
  }
   
   /* ============================================
      10. HERO PARALLAX
      ============================================ */
   const heroCode    = document.querySelector('.hero-code');
   const heroContent = document.querySelector('.hero-content');
   
   document.addEventListener('mousemove', (e) => {
     const x = (e.clientX / window.innerWidth  - 0.5) * 2;
     const y = (e.clientY / window.innerHeight - 0.5) * 2;
     if (heroCode)    heroCode.style.transform    = `translateX(${x * 14}px) translateY(${y * 7}px)`;
     if (heroContent) heroContent.style.transform = `translateX(${x * -4}px) translateY(${y * -2}px)`;
   });
   
   /* ============================================
      11. ACTIVE NAV HIGHLIGHT
      ============================================ */
   const sections = document.querySelectorAll('section[id]');
   const navLinks = document.querySelectorAll('.nav-link');
   
   new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         navLinks.forEach(link => {
           const active = link.getAttribute('href') === '#' + entry.target.id;
           link.style.color = active ? 'var(--accent-lt)' : '';
         });
       }
     });
   }, { threshold: 0.45 }).observe.bind(
     new IntersectionObserver(() => {}, {})
   );
   // Simple version — use scroll position
   window.addEventListener('scroll', () => {
     let current = '';
     sections.forEach(sec => {
       if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
     });
     navLinks.forEach(link => {
       link.style.color = link.getAttribute('href') === '#' + current ? 'var(--accent-lt)' : '';
     });
   });
   
   /* ============================================
      12. INIT — HERO REVEAL ON LOAD
      ============================================ */
   window.addEventListener('load', () => {
     document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach((el, i) => {
       setTimeout(() => el.classList.add('visible'), 180 + i * 110);
     });
   });