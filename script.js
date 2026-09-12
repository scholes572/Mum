/* ═══════════════════════════════════════════════════════════════
   For You, Mum — scene journey edition
   GSAP choreography for every scene
   ═══════════════════════════════════════════════════════════════ */

/* Fail-safe: CSS .no-anim keeps content visible until GSAP is confirmed */
document.documentElement.classList.add("no-anim");

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const HAS_GSAP = typeof window.gsap !== "undefined";

/* ── Photo data ────────────────────────────────────────────── */
const PHOTOS = [
  { src: "assets/IMG-20250515-WA0035.jpg", caption: "A moment to keep",       group: "childhood" },
  { src: "assets/IMG-20250515-WA0373.jpg", caption: "Young and full of life", group: "childhood" },
  { src: "assets/IMG-20250825-WA0047.jpg", caption: "Days gone by",           group: "childhood" },
  { src: "assets/IMG-20250515-WA0264.jpg", caption: "Always there",           group: "family" },
  { src: "assets/IMG-20250515-WA0295.jpg", caption: "You and me",             group: "family" },
  { src: "assets/IMG-20250515-WA0324.jpg", caption: "Side by side",           group: "family" },
  { src: "assets/IMG-20250515-WA0296.jpg", caption: "Quiet joy",              group: "recent" },
  { src: "assets/IMG-20250515-WA0298.jpg", caption: "A beautiful day",        group: "recent" },
  { src: "assets/IMG-20250515-WA0304.jpg", caption: "Simply happy",           group: "recent" },
  { src: "assets/IMG-20251114-WA0082.jpg", caption: "Lately",                 group: "recent" }
];

const GROUPS = {
  childhood: "Childhood memories",
  family:    "Mother & son",
  recent:    "Beautiful, recent moments"
};

/* Small helper */
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

/* ═══ Galleries ══════════════════════════════════════════════ */
function buildPiles() {
  const root = document.getElementById("gallery-piles");
  if (!root) return;
  Object.keys(GROUPS).forEach((g) => {
    const cap = el("p", "pile-caption", `— ${GROUPS[g]} —`);
    const row = el("div", "pile-row");
    const group = PHOTOS.map((p, i) => ({ ...p, index: i })).filter((p) => p.group === g);

    group.forEach((photo, gi) => {
      const pile = el("div", "pile");
      for (let k = 2; k >= 0; k--) {
        const p = group[(gi + k) % group.length];
        const card = el("div", "polaroid");
        card.style.transform = `rotate(${(gi - 1) * 4 + (k - 1) * 5}deg) translate(${(k - 1) * 6}px, ${(k - 1) * 5}px)`;
        card.style.zIndex = String(k);
        const img = el("img");
        img.src = p.src; img.alt = p.caption; img.loading = "lazy";
        const capTxt = el("span", "pl-cap", p.caption);
        card.append(img, capTxt);
        if (k === 2) {
          card.setAttribute("role", "button"); card.tabIndex = 0;
          card.setAttribute("aria-label", `Open photo: ${p.caption}`);
          card.addEventListener("click", () => openLightbox(photo.index));
          card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(photo.index); }
          });
        }
        pile.appendChild(card);
      }
      row.appendChild(pile);
    });

    root.append(cap, row);
  });
}

function buildStrip() {
  const strip = document.getElementById("strip");
  if (!strip) return;
  PHOTOS.forEach((p, i) => {
    const card = el("div", "card");
    const img = el("img");
    img.src = p.src; img.alt = p.caption; img.loading = "lazy";
    card.append(img, el("div", "card-cap", `${p.caption} · ${GROUPS[p.group]}`));
    card.addEventListener("click", () => openLightbox(i));
    strip.appendChild(card);
  });
}

function buildGrid() {
  const root = document.getElementById("gallery-grid");
  if (!root) return;
  Object.keys(GROUPS).forEach((g) => {
    root.append(el("p", "pile-caption", `— ${GROUPS[g]} —`));
    const mas = el("div", "masonry");
    PHOTOS.forEach((p, i) => {
      if (p.group !== g) return;
      const fig = el("figure", "polaroid");
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", `Open photo: ${p.caption}`);
      const img = el("img");
      img.src = p.src; img.alt = p.caption; img.loading = "lazy";
      fig.append(img, el("figcaption", "", p.caption));
      fig.addEventListener("click", () => openLightbox(i));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
      });
      mas.appendChild(fig);
    });
    root.append(mas);
  });
}

/* ═══ Lightbox ═══════════════════════════════════════════════ */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbCaption = document.getElementById("lightbox-caption");
let lbIndex = 0, lastFocus = null;

function updateLightbox() {
  const p = PHOTOS[lbIndex];
  lbImg.src = p.src; lbImg.alt = p.caption;
  lbCaption.textContent = `${p.caption} · ${GROUPS[p.group]}`;
}
function openLightbox(i) {
  lastFocus = document.activeElement;
  lbIndex = i; updateLightbox();
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("open"));
  document.body.classList.add("no-scroll");
  document.getElementById("lightbox-close").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => { lightbox.hidden = true; }, 350);
  if (lastFocus) lastFocus.focus();
}
function step(dir) {
  lbIndex = (lbIndex + dir + PHOTOS.length) % PHOTOS.length;
  updateLightbox();
}
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => step(-1));
document.getElementById("lightbox-next").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});  let touchX = null, touchY = null;
lightbox.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
}, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  /* horizontal swipes navigate; vertical swipes leave scrolling to the browser */
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  touchX = null; touchY = null;
}, { passive: true });

/* ═══ Helpers: confetti & hearts ═════════════════════════════ */
const CONFETTI = ["🎉", "✨", "🎊", "💖", "🌸", "⭐"];

function burst(x, y, count = 14, set = CONFETTI) {
  if (!HAS_GSAP || REDUCED) return;
  for (let i = 0; i < count; i++) {
    const s = el("span");
    s.textContent = set[i % set.length];
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:99;pointer-events:none;font-size:${10 + Math.random() * 18}px;`;
    document.body.appendChild(s);
    gsap.to(s, {
      x: (Math.random() - 0.5) * 340,
      y: (Math.random() - 0.7) * 320,
      rotation: (Math.random() - 0.5) * 260,
      opacity: 0,
      scale: 0.4 + Math.random() * 0.8,
      duration: 1.3 + Math.random() * 1.3,
      ease: "power2.out",
      onComplete: () => s.remove()
    });
  }
}
document.addEventListener("click", (e) => {
  if (!lightbox.hidden) return;
  if (e.target.closest("a, button, .cake, .polaroid, .card")) return;
  burst(e.clientX, e.clientY, 4, ["✨", "💗", "🌸"]);
});

/* ═══ Petals ═════════════════════════════════════════════════ */
function initPetals() {
  const wrap = document.querySelector(".petals");
  if (!wrap || REDUCED) return;
  const P = ["🌸", "🌷", "✿", "❀", "🌼", "⭐"];
  for (let i = 0; i < 16; i++) {
    const p = el("span", "petal", P[i % P.length]);
    p.style.setProperty("--x", `${Math.random() * 100}vw`);
    p.style.setProperty("--s", `${11 + Math.random() * 12}px`);
    p.style.setProperty("--t", `${13 + Math.random() * 12}s`);
    p.style.setProperty("--delay", `${Math.random() * 16}s`);
    p.style.setProperty("--sway", `${2 + Math.random() * 6}vw`);
    p.style.setProperty("--o", `${0.28 + Math.random() * 0.35}`);
    wrap.appendChild(p);
  }
}

/* ═══ Custom cursor ══════════════════════════════════════════ */
function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
  const dot = cursor.querySelector(".cursor-dot");
  const ring = cursor.querySelector(".cursor-ring");
  const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });
  window.addEventListener("mousemove", (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.querySelectorAll("a, button, .cake, .polaroid, .card").forEach((n) => {
    n.addEventListener("mouseenter", () => document.documentElement.classList.add("cursor-hover"));
    n.addEventListener("mouseleave", () => document.documentElement.classList.remove("cursor-hover"));
  });
}

/* ═══ Stars for the prayer night sky ═════════════════════════ */
function buildStars() {
  const wrap = document.getElementById("stars");
  if (!wrap) return;
  for (let i = 0; i < 90; i++) {
    const s = el("span", "star");
    const size = 1 + Math.random() * 2.2;
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;`;
    wrap.appendChild(s);
    if (HAS_GSAP && !REDUCED) {
      gsap.to(s, { opacity: 0.15, duration: 1 + Math.random() * 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: Math.random() * 3 });
    }
  }
}

/* ═══ Cake: blow out the candles ═════════════════════════════ */
function initCake() {
  const cake = document.getElementById("cake-svg");
  const hint = document.getElementById("cake-hint");
  const wish = document.getElementById("cake-wish");
  if (!cake) return;

  let lit = true;
  const blow = () => {
    if (!lit) return;
    lit = false;

    if (HAS_GSAP && !REDUCED) {
      /* flames: flicker hard, then stretch out and vanish */
      gsap.to(".flame-wrap", {
        scaleY: 2.4, scaleX: 0.5, opacity: 0, transformOrigin: "50% 100%",
        duration: 0.55, ease: "power2.in", stagger: 0.09
      });
      /* smoke rises */
      gsap.to("#smoke", { opacity: 0.85, duration: 0.5, delay: 0.45 });
      gsap.to(".smoke-p", {
        y: -46, x: () => 14 - Math.random() * 28, scale: 2.6, opacity: 0,
        duration: 1.8, ease: "power1.out", stagger: 0.12, delay: 0.5
      });
      /* wish text + confetti */
      gsap.fromTo(wish, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 });
      const r = cake.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * 0.25, 20);
      if (hint) gsap.to(hint, { opacity: 0, duration: 0.5 });
    } else {
      document.querySelectorAll(".flame-wrap").forEach((f) => (f.style.opacity = "0"));
      if (wish) wish.style.opacity = "1";
      if (hint) hint.style.opacity = "0";
    }

    hint.textContent = "your wish is on its way ✨";
    if (hint) hint.style.opacity = "1";
  };

  cake.addEventListener("click", blow);
  cake.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); }
  });
}

/* ═══ Motion init (GSAP path) ════════════════════════════════ */
function initMotion() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  document.documentElement.classList.remove("no-anim");

  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const fly = isMobile ? 60 : 110;          /* fly-in distances */
  const magRange = isMobile ? 90 : 160;     /* magnet scatter range */

  /* Lenis smooth scroll wired into GSAP (touch keeps native momentum) */
  if (typeof window.Lenis !== "undefined" && !REDUCED) {
    const lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const t = document.querySelector(a.getAttribute("href"));
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: 0, duration: 1.6 });
      });
    });
  }

  /* ── Scene A · mega opening intro ────────────────────────── */
  gsap.set(".eyebrow", { opacity: 0, y: 20 });
  gsap.set(".mega-word", { yPercent: 118 });
  gsap.set([".open-sub", ".whisper"], { opacity: 0, y: 22 });
  gsap.set(".name-plate", { opacity: 0, scale: 0.85 });
  gsap.set([".balloon", ".scroll-hint"], { opacity: 0 });

  const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  intro
    .to(".eyebrow", { opacity: 1, y: 0, duration: 0.7 }, 0.1)
    .to(".mega-word", { yPercent: 0, duration: 1.25, stagger: 0.16, ease: "power4.out" }, 0.3)
    .to(".open-sub", { opacity: 1, y: 0, duration: 0.8 }, 1.1)
    .to(".name-plate", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, 1.35)
    .to(".whisper", { opacity: 1, y: 0, duration: 0.8 }, 1.65)
    .to(".balloon", { opacity: 0.85, duration: 1.2, stagger: 0.2 }, 1.2)
    .to(".scroll-hint", { opacity: 1, duration: 0.8 }, 1.9);

  /* balloons float forever */
  document.querySelectorAll(".balloon").forEach((b, i) => {
    gsap.to(b, { y: -22 - i * 6, duration: 3 + i, yoyo: true, repeat: -1, ease: "sine.inOut" });
  });

  /* hero parallax away */
  gsap.to(".scene-open > :not(.balloon)", {
    y: -60, opacity: 0.25, ease: "none",
    scrollTrigger: { trigger: ".scene-open", start: "top top", end: "bottom top", scrub: true }
  });

  /* progress bar */
  gsap.to("#progress-bar", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 }
  });

  /* ── Marquees: infinite ribbons ──────────────────────────── */
  document.querySelectorAll(".marquee").forEach((m, i) => {
    const half = m.scrollWidth / 2;
    const dir = i % 2 === 0 ? -1 : 1;
    gsap.to(m, {
      x: dir * half, duration: 22, ease: "none", repeat: -1,
      modifiers: { x: (x) => (parseFloat(x) % half) + "px" }
    });
    /* band sweeps in */
    gsap.fromTo(m.closest(".marquee-band"), { xPercent: dir * 6, opacity: 0 }, {
      xPercent: 0, opacity: 1, duration: 1,
      scrollTrigger: { trigger: m.closest(".marquee-band"), start: "top 90%" }
    });
  });

  /* ── Scene C · flow paragraphs ───────────────────────────── */
  gsap.utils.toArray(".flow-para").forEach((p) => {
    gsap.fromTo(p, { opacity: 0, y: 44 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: p, start: "top 84%" }
    });
  });

  /* ── Scene D · kept going ────────────────────────────────── */
  gsap.utils.toArray(".kept-line").forEach((p) => {
    gsap.fromTo(p, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: p, start: "top 85%" }
    });
  });
  const keptWords = document.querySelectorAll(".kept-mega span");
  gsap.set(keptWords, { yPercent: 60, opacity: 0, scale: 0.8, rotation: () => gsap.utils.random(-8, 8) });
  gsap.to(keptWords, {
    yPercent: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.1, stagger: 0.12, ease: "back.out(1.7)",
    scrollTrigger: { trigger: ".kept-mega", start: "top 78%" }
  });

  /* ── Scene E · duo notes fly in from sides ───────────────── */
  gsap.fromTo(".duo-note.left", { x: -fly, opacity: 0, rotation: -5 }, {
    x: 0, opacity: 1, rotation: -1.1, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".scene-duo", start: "top 78%" }
  });
  gsap.fromTo(".duo-note.right", { x: fly, opacity: 0, rotation: 5 }, {
    x: 0, opacity: 1, rotation: 1, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".scene-duo", start: "top 78%" }
  });

  /* ── Scene F · gifts rows slide with numbers ─────────────── */
  gsap.utils.toArray(".gift-row").forEach((row, i) => {
    gsap.fromTo(row, { opacity: 0, x: i % 2 ? 70 : -70 }, {
      opacity: 1, x: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 84%" }
    });
    gsap.fromTo(row.querySelector(".gift-num"), { scale: 0.4, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2)", delay: 0.25,
      scrollTrigger: { trigger: row, start: "top 84%" }
    });
  });
  gsap.fromTo(".gifts-em", { opacity: 0, scale: 0.9 }, {
    opacity: 1, scale: 1, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".gifts-em", start: "top 86%" }
  });

  /* ── Scene H · word garden pops in ───────────────────────── */
  gsap.utils.toArray(".garden-word").forEach((w, i) => {
    gsap.fromTo(w, { opacity: 0, scale: 0.3, rotation: () => gsap.utils.random(-20, 20) }, {
      opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: "back.out(2.2)", delay: i * 0.08,
      scrollTrigger: { trigger: ".word-garden", start: "top 80%" }
    });
  });
  gsap.utils.toArray([".lessons-note", ".lessons-em"]).forEach((n) => {
    gsap.fromTo(n, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 86%" }
    });
  });

  /* ── Scene I · cake rises; wish text waits for the blow ──── */
  gsap.set(".cake-wish", { opacity: 0, y: 24 });
  gsap.fromTo(".cake-stage", { opacity: 0, y: 80, scale: 0.92 }, {
    opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".scene-cake", start: "top 66%" }
  });
  gsap.fromTo([".cake-title", ".scene-cake .scene-kicker"], { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".scene-cake", start: "top 74%" }
  });

  /* ── Scene J · gallery ───────────────────────────────────── */
  gsap.utils.toArray("#gallery-piles .pile").forEach((pile) => {
    gsap.fromTo(pile, { opacity: 0, y: 60, rotation: -3 }, {
      opacity: 1, y: 0, rotation: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: pile, start: "top 88%" }
    });
    const cards = pile.querySelectorAll(".polaroid");
    if (cards[2]) gsap.to(cards[2], {
      x: 46, y: -26, rotation: 9, ease: "none",
      scrollTrigger: { trigger: pile, start: "top 80%", end: "top 30%", scrub: true }
    });
    if (cards[1]) gsap.to(cards[1], {
      x: -30, y: -12, rotation: -7, ease: "none",
      scrollTrigger: { trigger: pile, start: "top 80%", end: "top 30%", scrub: true }
    });
  });

  /* Pinned horizontal strip — desktop only.
     On phones/tablets the strip is a native swipe scroller (CSS scroll-snap). */
  const strip = document.getElementById("strip");
  const stripWrap = document.getElementById("strip-wrap");
  if (strip && stripWrap) {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const getDistance = () => Math.max(0, strip.scrollWidth - window.innerWidth + 40);
      gsap.to(strip, {
        x: () => -getDistance(), ease: "none",
        scrollTrigger: {
          trigger: stripWrap, start: "top top", end: () => `+=${getDistance()}`,
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
      gsap.fromTo(".strip .card", { scale: 0.92 }, {
        scale: 1, stagger: 0.06, ease: "none",
        scrollTrigger: { trigger: stripWrap, start: "top bottom", end: "top top", scrub: true }
      });
    });
  }

  gsap.utils.toArray("#gallery-grid .polaroid").forEach((fig) => {
    gsap.fromTo(fig, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: fig, start: "top 90%" }
    });
  });

  /* ── Scene K · magnet words snap to place ────────────────── */
  gsap.utils.toArray(".magnet-words span").forEach((w, i) => {
    gsap.fromTo(w, {
      opacity: 0, x: () => gsap.utils.random(-magRange, magRange), y: () => gsap.utils.random(-50, 50), rotation: () => gsap.utils.random(-24, 24)
    }, {
      opacity: 1, x: 0, y: 0, rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.6)", delay: i * 0.12,
      scrollTrigger: { trigger: ".magnet-words", start: "top 82%" }
    });
  });
  gsap.utils.toArray([".unsaid-line", ".unsaid-em"], ).forEach((n) => {
    gsap.fromTo(n, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 86%" }
    });
  });

  /* ── Scene L · prayer: lines bloom, moon drifts ──────────── */
  gsap.utils.toArray(".prayer-line").forEach((line, i) => {
    gsap.fromTo(line, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: i * 0.1,
      scrollTrigger: { trigger: ".prayer-inner", start: "top 70%" }
    });
  });
  gsap.fromTo([".prayer-title", ".scene-prayer .scene-kicker", ".prayer-final"], { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".prayer-inner", start: "top 74%" }
  });
  gsap.to(".moon", { y: -18, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });

  /* ── Scene M · the letter ────────────────────────────────── */
  gsap.utils.toArray(".scene-letter .letter-line, .scene-letter .salutation").forEach((n) => {
    gsap.fromTo(n, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.95, ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 86%" }
    });
  });
  gsap.fromTo(".thanks-list li", { opacity: 0, x: -30 }, {
    opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: ".thanks-list", start: "top 84%" }
  });
  gsap.fromTo(".quote", { opacity: 0, scale: 0.92 }, {
    opacity: 1, scale: 1, duration: 1.1, ease: "power3.out",
    scrollTrigger: { trigger: ".quote", start: "top 80%" }
  });

  /* final love: big scale-in + hearts */
  gsap.set(".final-love", { opacity: 0, scale: 0.6 });
  gsap.to(".final-love", {
    opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: ".final-love", start: "top 80%", once: true,
      onEnter: () => {
        const r = document.querySelector(".final-love").getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 16, ["💖", "💗", "🌹", "✨"]);
      }
    }
  });
  gsap.fromTo([".final-birthday", ".signature", ".back-top"], { opacity: 0, y: 26 }, {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".final-birthday", start: "top 84%" }
  });

  /* refresh measurements — load, image loads, rotation, viewport changes */
  window.addEventListener("load", () => ScrollTrigger.refresh());
  window.addEventListener("orientationchange", () => setTimeout(() => ScrollTrigger.refresh(), 350));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => ScrollTrigger.refresh());
  }
  document.querySelectorAll("#strip img, #gallery-grid img, #gallery-piles img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });

  return intro;
}

/* ═══ Preloader ══════════════════════════════════════════════ */
function runPreloader(introTl) {
  const pre = document.getElementById("preloader");
  const letters = pre.querySelectorAll(".preloader-letter");
  const fill = document.getElementById("preloader-fill");
  const kicker = pre.querySelector(".preloader-kicker");
  const sub = pre.querySelector(".preloader-sub");

  const tl = gsap.timeline({
    onComplete: () => { pre.style.display = "none"; introTl.play(); }
  });
  tl.fromTo(kicker, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
    .fromTo(letters, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "power4.out" }, 0.15)
    .fromTo(sub, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.7)
    .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.4)
    .to([kicker, sub], { opacity: 0, duration: 0.4 }, 2.15)
    .to(letters, { yPercent: -120, opacity: 0, duration: 0.55, stagger: 0.045, ease: "power3.in" }, 2.15)
    .to(".preloader-panel.top", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.6)
    .to(".preloader-panel.bottom", { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, 2.6)
    .to(".preloader-inner", { opacity: 0, duration: 0.3 }, 2.6);
}

/* ═══ Boot ═══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  buildPiles();
  buildStrip();
  buildGrid();
  buildStars();
  initPetals();

  if (HAS_GSAP && !REDUCED) {
    const intro = initMotion();
    ScrollTrigger.refresh();
    runPreloader(intro);
    initCursor();
    initCake();
  } else {
    const pre = document.getElementById("preloader");
    if (pre) pre.style.display = "none";
    document.documentElement.classList.add("no-anim");
    if (REDUCED) {
      const piles = document.getElementById("gallery-piles");
      const stripWrap = document.getElementById("strip-wrap");
      if (piles) piles.style.display = "none";
      if (stripWrap) stripWrap.style.display = "none";
    }
    initCake();
  }
});
