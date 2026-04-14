/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

'use strict';

// ─── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ─── NAV SCROLL EFFECT ──────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ─── MOBILE NAV TOGGLE ──────────────────────────────────────
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SMOOTH SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── SCROLL REVEAL ──────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children inside the same parent slightly
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Add stagger delays to sibling .reveal elements
document.querySelectorAll('.skills-grid, .projects-grid, .about-stats, .hero-content').forEach(parent => {
  parent.querySelectorAll('.reveal, .skill-card, .project-card, .stat').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target, 10);
        animateCounter(num, target);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statObserver.observe(statsSection);

// ─── ACTIVE NAV LINK (scroll-spy) ───────────────────────────
const sections = document.querySelectorAll('section[id]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = '';
        link.style.setProperty('--after-width', '0');
      });
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--text)';
      }
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
});

sections.forEach(section => spyObserver.observe(section));

// ─── CONTACT FORM ───────────────────────────────────────────
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate network delay (replace with real fetch/API call)
  setTimeout(() => {
    contactForm.reset();
    btn.textContent = originalText;
    btn.disabled = false;
    btn.style.opacity = '';
    formSuccess.classList.add('show');

    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1200);
});

// ─── HERO TITLE STAGGER ─────────────────────────────────────
document.querySelectorAll('.hero-title .line').forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(24px)';
  line.style.transition = `opacity 0.7s ease ${0.2 + i * 0.12}s, transform 0.7s ease ${0.2 + i * 0.12}s`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    });
  });
});

// ─── PARALLAX ORB ON MOUSEMOVE ───────────────────────────────
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  if (orb1) {
    orb1.style.transform = `translate(${dx * -20}px, ${dy * -20}px)`;
  }
  if (orb2) {
    orb2.style.transform = `translate(${dx * 14}px, ${dy * 14}px)`;
  }
}, { passive: true });

// ─── SKILL CARD TILT ─────────────────────────────────────────
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── PROJECT CARD SHINE ───────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--shine-x', `${x}%`);
    card.style.setProperty('--shine-y', `${y}%`);
    card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(2,169,247,0.06) 0%, transparent 60%), linear-gradient(135deg, var(--surface2), var(--surface2))`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.backgroundImage = '';
  });
});

// ─── PAGE LOAD ANIMATION ─────────────────────────────────────
window.addEventListener('load', () => {
  // Trigger hero reveals immediately
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 100);
  });
});

// ─── Emailjs ─────────────────────────────────────
// ─── Emailjs ─────────────────────────────────────
function sendMail(e) {
  e.preventDefault();

  const btn = document.querySelector(".contact-form button");
  btn.innerText = "Sending...";

  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_tykweky", "template_8cut2sk", params)
    .then(() => {
      btn.innerText = "Sent!";
      document.getElementById("formSuccess").style.display = "block";
      document.getElementById("contactForm").reset();
    })
    .catch((error) => {
      btn.innerText = "Try Again";
      console.log("EMAILJS ERROR:", error);
    });
}



document.getElementById("contactForm")
  .addEventListener("submit", sendMail);