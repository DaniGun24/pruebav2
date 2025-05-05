// banner.js

document.addEventListener('DOMContentLoaded', () => {
  // ————————————————————————————
  // 1) Infinite carousel setup
  // ————————————————————————————
  const wrapper   = document.querySelector('.banner-cards-wrapper');
  const container = document.querySelector('.banner-cards');
  if (!wrapper || !container) return;

  // original cards
  const originals = Array.from(container.children);
  const N = originals.length;

  // clone first & last for seamless loop
  const firstClone = originals[0].cloneNode(true);
  const lastClone  = originals[N - 1].cloneNode(true);
  container.insertBefore(lastClone, container.firstChild);
  container.appendChild(firstClone);

  // now includes clones at [0] and [N+1]
  const items = Array.from(container.children);

  // helper: center any given card in the viewport
  function centerCard(el) {
    const cardCenter     = el.offsetLeft + el.clientWidth / 2;
    const viewportCenter = wrapper.clientWidth / 2;
    container.scrollTo({
      left: cardCenter - viewportCenter,
      behavior: 'smooth'
    });
  }

  // start centered on the very first “real” card
  centerCard(items[1]);

  // ————————————————————————————
  // 2) Build navigation dots
  // ————————————————————————————
  const dotsContainer = document.querySelector('.carousel-dots');
  const dots = [];
  let isSnapping = false;

  originals.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className     = 'dot';
    dot.dataset.index = idx;
    dot.addEventListener('click', () => {
      isSnapping = true;
      // idx+1 because items[0] is the last-clone
      const target = items[idx + 1];
      centerCard(target);
      setTimeout(() => {
        isSnapping = false;
        updateActiveDot();
      }, 600);
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  // ————————————————————————————
  // 3) Highlight the dot whose card is nearest center
  // ————————————————————————————
  function updateActiveDot() {
    const viewportCenter = container.scrollLeft + wrapper.clientWidth/2;
    let closest = 0, minDist = Infinity;

    originals.forEach((_, idx) => {
      const el = items[idx + 1];
      const elCenter = el.offsetLeft + el.clientWidth/2;
      const dist = Math.abs(elCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = idx;
      }
    });

    dots.forEach((d,i) => {
      d.classList.toggle('active', i === closest);
    });
  }

  // ————————————————————————————
  // 4) Infinite-loop “teleport” when hitting a clone
  // ————————————————————————————
  function checkLoop() {
    if (isSnapping) return;
    const leftBound  = items[1].offsetLeft / 2;
    const rightBound = items[N].offsetLeft + items[N].clientWidth/2;

    if (container.scrollLeft < leftBound) {
      // jumped onto the last-clone, teleport to real last
      centerCard(items[N]);
    } else if (container.scrollLeft > rightBound) {
      // jumped onto the first-clone, teleport to real first
      centerCard(items[1]);
    }
  }

  // optimized scroll listener
  let ticking = false;
  container.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkLoop();
        updateActiveDot();
        ticking = false;
      });
      ticking = true;
    }
  });

  // mark initial active dot
  updateActiveDot();
});
