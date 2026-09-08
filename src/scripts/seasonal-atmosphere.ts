import { getSeason, seasonalGreetings, type Season } from '../utils/season';

const random = (min: number, max: number) => min + Math.random() * (max - min);
const preferenceKey = 'seasonal-motion';
let controller: { layer: HTMLElement; syncPage: () => void; cleanup: () => void } | undefined;

function initAtmosphere() {
  const layer = document.querySelector<HTMLElement>('#seasonal-particles');
  // Astro moves the same layer into the new body. Keep its WAAPI timelines,
  // random shower deadline and listeners alive; only refresh page-specific UI.
  if (layer && controller?.layer === layer) {
    controller.syncPage();
    return;
  }
  controller?.cleanup();
  controller = undefined;
  if (!layer) return;

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 640px)');
  const abort = new AbortController();
  const particles = new Map<HTMLElement, Animation[]>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let enabled = true;
  try { enabled = localStorage.getItem(preferenceKey) !== 'off'; } catch { /* Session-only preference. */ }

  layer.dataset.reading = String(!!document.querySelector('.markdown-content'));

  function syncSeason(): Season {
    const season = getSeason();
    root.dataset.season = season;
    const greeting = seasonalGreetings[root.lang.startsWith('en') ? 'en' : 'zh'][season];
    const title = document.querySelector('#seasonal-greeting-title');
    const message = document.querySelector('.seasonal-greeting p');
    if (title) title.textContent = greeting.title;
    if (message) message.textContent = greeting.message;
    return season;
  }

  function removeParticle(particle: HTMLElement) {
    const animations = particles.get(particle);
    particles.delete(particle);
    animations?.forEach(animation => animation.cancel());
    particle.remove();
  }

  function clearParticles() {
    for (const particle of particles.keys()) removeParticle(particle);
  }

  function running() { return !disposed && enabled && !reduced.matches && !document.hidden; }

  function spawn(season: Season, delay: number) {
    const width = innerWidth;
    const height = innerHeight;
    const meteor = season === 'summer';
    const particle = document.createElement('span');
    const shape = document.createElement('i');
    const kind = { spring: 'petal', summer: 'meteor', autumn: 'leaf', winter: 'snow' }[season];
    particle.className = `seasonal-particle seasonal-${kind}`;
    const size = meteor ? random(65, compact.matches ? 100 : 155)
      : season === 'winter' ? random(5, 10) : season === 'spring' ? random(19, 26) : random(10, 18);
    if (season === 'spring') {
      for (let index = 0; index < 5; index++) {
        const petal = document.createElement('b');
        petal.style.setProperty('--petal-angle', `${index * 72}deg`);
        shape.append(petal);
      }
    }
    particle.style.setProperty('--size', `${size}px`);
    particle.append(shape);
    layer!.append(particle);

    const duration = meteor ? random(1200, 2100) : random(11000, 18000);
    const opacity = meteor ? random(.4, .65) : random(.4, .64);
    let frames: Keyframe[];

    if (meteor) {
      const angle = random(24, 42);
      const distance = random(width * .26, width * .48);
      const x = random(-size, width * .6);
      const y = random(16, height * .27);
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      particle.style.setProperty('--angle', `${angle}deg`);
      frames = [
        { transform: `translate3d(${x}px, ${y}px, 0)`, opacity: 0 },
        { transform: `translate3d(${x + dx * .15}px, ${y + dy * .15}px, 0)`, opacity, offset: .15 },
        { transform: `translate3d(${x + dx * .7}px, ${y + dy * .7}px, 0)`, opacity, offset: .7 },
        { transform: `translate3d(${x + dx}px, ${y + dy}px, 0)`, opacity: 0 },
      ];
    } else {
      // Bias to margins; each particle has its own wind, sway, rotation and duration.
      const left = Math.random() < .5;
      const reading = layer!.dataset.reading === 'true';
      // Choose quieter margins for NEW article particles. Do not abruptly mask
      // or reposition existing particles when the reader changes pages.
      const edge = reading ? Math.max(18, (width - 840) / 2) : width * .26;
      const x = left ? random(8, edge) : random(width - edge, width - 8);
      const wind = random(-80, 80) * (reading ? .2 : compact.matches ? .45 : 1);
      const sway = reading ? random(4, 12) : random(12, compact.matches ? 28 : 55);
      const phase = random(0, Math.PI * 2);
      frames = Array.from({ length: 7 }, (_, index) => {
        const progress = index / 6;
        const px = x + wind * progress + Math.sin(phase + progress * Math.PI * 3) * sway;
        const py = -30 + (height + 65) * progress;
        return {
          offset: progress,
          transform: `translate3d(${px}px, ${py}px, 0)`,
          opacity: index === 0 || index === 6 ? 0 : opacity,
        };
      });
    }

    const flight = particle.animate(frames, { duration, delay, easing: 'linear', fill: 'both' });
    const animations = [flight];
    if (!meteor) {
      const rotation = random(-110, 110);
      animations.push(shape.animate([
        { transform: `rotate(${rotation}deg) scaleX(1)` },
        { transform: `rotate(${rotation + random(30, 90)}deg) scaleX(${season === 'spring' ? '.72' : '.45'})` },
        { transform: `rotate(${rotation + random(100, 220)}deg) scaleX(1)` },
      ], { duration: random(4000, 7500), iterations: Infinity, easing: 'ease-in-out', direction: 'alternate' }));
    }
    particles.set(particle, animations);
    flight.onfinish = () => removeParticle(particle);
  }

  function schedule(first = false) {
    clearTimeout(timer);
    if (!running()) return;
    // No continuous JS render loop. One randomized timeout between sparse showers.
    timer = setTimeout(() => {
      if (!running()) return;
      const season = syncSeason();
      const count = season === 'summer' ? Math.floor(random(2, 4))
        : compact.matches ? Math.floor(random(3, 5)) : Math.floor(random(4, 8));
      const cap = compact.matches ? 5 : 9;
      for (let index = 0; index < count && particles.size < cap; index++) {
        spawn(season, random(0, season === 'summer' ? 500 : 2200));
      }
      schedule();
    }, first ? random(5000, 12000) : random(24000, 52000));
  }

  function syncPage() {
    syncSeason();
    layer!.dataset.reading = String(!!document.querySelector('.markdown-content'));
    root.dataset.seasonMotion = running() ? 'running' : 'paused';
    const isEnglish = root.lang.startsWith('en');
    document.querySelectorAll<HTMLButtonElement>('[data-season-toggle]').forEach(button => {
      button.hidden = false;
      button.disabled = reduced.matches;
      button.setAttribute('aria-pressed', String(enabled && !reduced.matches));
      const label = reduced.matches
        ? (isEnglish ? 'Seasonal motion follows reduced motion settings' : '季节动画已跟随系统减少动态效果')
        : (isEnglish ? 'Seasonal motion' : '季节动画');
      button.setAttribute('aria-label', label);
      button.title = reduced.matches ? label : `${label} · ${enabled ? (isEnglish ? 'On' : '已开启') : (isEnglish ? 'Off' : '已暂停')}`;
    });
  }

  function syncMotion() {
    clearTimeout(timer);
    clearParticles();
    syncPage();
    schedule(true);
  }

  document.addEventListener('visibilitychange', syncMotion, { signal: abort.signal });
  reduced.addEventListener('change', syncMotion, { signal: abort.signal });
  // Mobile browser chrome often changes only viewport height during navigation.
  // Let those flights finish; reset bounds only for a genuine width/orientation change.
  let viewportWidth = innerWidth;
  window.addEventListener('resize', () => {
    if (innerWidth === viewportWidth) return;
    viewportWidth = innerWidth;
    syncMotion();
  }, { signal: abort.signal, passive: true });
  window.addEventListener('pagehide', () => {
    clearTimeout(timer);
    clearParticles();
    root.dataset.seasonMotion = 'paused';
  }, { signal: abort.signal });
  window.addEventListener('pageshow', syncMotion, { signal: abort.signal });
  window.addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) {
      enabled = event.newValue !== 'off';
      syncMotion();
    }
  }, { signal: abort.signal });
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-season-toggle]') || reduced.matches) return;
    enabled = !enabled;
    try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off'); } catch { /* Keep the current session functional. */ }
    syncMotion();
  }, { signal: abort.signal });

  const cleanup = () => {
    disposed = true;
    clearTimeout(timer);
    clearParticles();
    abort.abort();
    root.dataset.seasonMotion = 'paused';
  };
  controller = { layer, syncPage, cleanup };
  syncMotion();
}

document.addEventListener('astro:after-swap', initAtmosphere);
document.addEventListener('astro:page-load', initAtmosphere);
