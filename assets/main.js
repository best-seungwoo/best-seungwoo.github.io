// ---- current year in footer ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- render skill dots from data-level ----
document.querySelectorAll('.dots').forEach(function (el) {
  var level = parseInt(el.dataset.level, 10) || 0;
  for (var i = 1; i <= 5; i++) {
    var dot = document.createElement('i');
    if (i <= level) dot.className = 'on';
    el.appendChild(dot);
  }
});

// ---- eight gates: click the portrait ----
(function () {
  var host = document.querySelector('.hero-photo');
  if (!host) return;

  var GATES = [
    ['開門', 'Kaimon',  'Gate of Opening'],
    ['休門', 'Kyumon',  'Gate of Healing'],
    ['生門', 'Seimon',  'Gate of Life'],
    ['傷門', 'Shomon',  'Gate of Pain'],
    ['杜門', 'Tomon',   'Gate of Limit'],
    ['景門', 'Keimon',  'Gate of View'],
    ['驚門', 'Kyomon',  'Gate of Wonder'],
    ['死門', 'Shimon',  'Gate of Death']
  ];

  // where each gate sits on the chakra diagram, as % of the image box
  var PINS = [
    [51.8, 15.2], [46.0, 15.2], [48.6, 34.8], [48.6, 40.2],
    [48.6, 46.7], [48.6, 52.3], [48.6, 57.9], [54.2, 38.1]
  ];

  var PORTRAIT = {
    closed: 'assets/profile.jpg',
    open:   'assets/1-7gates_open.jpg',   // gates 1-7
    eighth: 'assets/8gates_open.jpg'      // gate 8
  };

  var FLASH = 850;   // ms the diagram covers the portrait before the swap shows

  // --- build the overlay (kept out of index.html so no-JS degrades cleanly) ---
  var photo = host.querySelector('img');   // grab before we append another one

  var flash = document.createElement('div');
  flash.className = 'gate-flash';
  flash.setAttribute('aria-hidden', 'true');
  flash.innerHTML =
    '<span class="gate-flash-inner">' +
      '<img src="assets/8gates.webp" alt="">' +
      '<span class="gate-pin"></span>' +
    '</span>';

  var wave = document.createElement('div');
  wave.className = 'gate-wave';
  wave.setAttribute('aria-hidden', 'true');

  var label = document.createElement('div');
  label.className = 'gate-label';

  host.appendChild(flash);
  host.appendChild(wave);
  host.appendChild(label);

  var pin = flash.querySelector('.gate-pin');

  host.classList.add('gates');
  host.setAttribute('role', 'button');
  host.setAttribute('tabindex', '0');
  host.setAttribute('aria-label', 'Open the Eight Gates — one gate per click');
  host.title = 'Open the Eight Gates — one gate per click';

  // swap without a flash of empty frame
  Object.keys(PORTRAIT).forEach(function (k) { new Image().src = PORTRAIT[k]; });

  // --- one gate per click ---
  var gate = 0;          // 0 = all closed, 8 = eighth gate released
  var timer = null;

  function reset() {
    clearTimeout(timer);
    gate = 0;
    host.classList.remove('flashing', 'seventh', 'final', 'burst');
    host.style.removeProperty('--shake');
    label.textContent = '';
    photo.src = PORTRAIT.closed;
    photo.style.display = '';      // in case a failed load hid it
  }

  function step() {
    if (gate >= GATES.length) { reset(); return; }   // ninth click closes them again

    clearTimeout(timer);
    var i = gate;
    gate++;

    pin.style.left = PINS[i][0] + '%';
    pin.style.top  = PINS[i][1] + '%';
    label.innerHTML = '<b>' + GATES[i][0] + '</b>' + GATES[i][1] + ', Kai!';

    // cover the portrait with the diagram, swap the photo underneath, then
    // uncover — so the change reads as a cut, not a cross-fade
    host.classList.add('flashing');
    host.style.setProperty('--shake', (1.2 + i * 0.5).toFixed(1) + 'px');
    photo.src = (gate === 8) ? PORTRAIT.eighth : PORTRAIT.open;

    // seventh gate burns blue, eighth burns red
    if (gate === 7) host.classList.add('seventh');
    if (gate === 8) { host.classList.remove('seventh'); host.classList.add('final'); }

    timer = setTimeout(function () {
      host.classList.remove('flashing');
      if (gate >= 7) {
        host.classList.remove('burst');
        void host.offsetWidth;               // restart the shockwave animation
        host.classList.add('burst');
      }
    }, FLASH);
  }

  host.addEventListener('click', step);
  host.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(); }
  });
})();

// ---- publication legend: light up one keyword group at a time ----
(function () {
  var pubs = document.getElementById('publications');
  if (!pubs) return;
  var items = Array.prototype.slice.call(pubs.querySelectorAll('.pub-legend span'));
  if (!items.length) return;

  var pinned = null;   // a click keeps a group lit; needed on touch, where nothing hovers

  function apply(key) {
    if (key) pubs.setAttribute('data-hl', key);
    else pubs.removeAttribute('data-hl');
    items.forEach(function (el) { el.classList.toggle('pinned', el.dataset.k === pinned); });
  }

  items.forEach(function (el) {
    var m = /\bk-(\w+)\b/.exec(el.className);
    if (!m) return;
    el.dataset.k = m[1];
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');

    el.addEventListener('mouseenter', function () { apply(el.dataset.k); });
    el.addEventListener('mouseleave', function () { apply(pinned); });
    el.addEventListener('focus', function () { apply(el.dataset.k); });
    el.addEventListener('blur', function () { apply(pinned); });
    el.addEventListener('click', function () {
      pinned = (pinned === el.dataset.k) ? null : el.dataset.k;
      apply(pinned || el.dataset.k);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
})();

// ---- highlight the nav link of the section currently in view ----
var navLinks = Array.prototype.slice.call(document.querySelectorAll('.topnav a'));
var sections = navLinks
  .map(function (a) { return document.querySelector(a.getAttribute('href')); })
  .filter(Boolean);

if (sections.length) {
  // The line a clicked section lands on — same value as `scroll-padding-top`
  // in style.css, so the highlight always matches the section you jumped to.
  function anchorLine() {
    var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return (pad || 76) + 4; // small tolerance for subpixel rounding
  }

  // The last section whose top has passed the line. Sections are compared by
  // their box top, so their ranges never overlap and exactly one wins.
  function currentSection() {
    // the last section may be too short to ever reach the line
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      return sections[sections.length - 1].id;
    }
    var line = anchorLine();
    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s.id;
    });
    return current;
  }

  function update() {
    var id = currentSection();
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
