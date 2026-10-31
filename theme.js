/* Colour themes: shared by every page.
   Runs from <head> so the saved theme is applied before the page paints (no flash of the wrong colours),
   then adds a "Theme" menu to the header once the page has loaded. */
(function(){
  var KEY = 'site_theme';
  var THEMES = [
    { id:'default',   name:'Original',  colors:['#0c1016', '#ffb238'] },
    { id:'bubblegum', name:'Bubblegum', colors:['#121014', '#ff5fa8'] },
    { id:'rouge',     name:'Rouge',     colors:['#111115', '#ff3b3b'] },
    { id:'amethyst',  name:'Amethyst',  colors:['#1e1636', '#c9a2ff'] },
    { id:'azure',     name:'Azure',     colors:['#0d1727', '#3db8ff'] },
    { id:'forest',    name:'Forest',    colors:['#0e1a13', '#4ade80'] }
  ];
  // Themes were renamed; anyone who already saved an old name keeps their colours
  var LEGACY = { girly:'bubblegum', gamer:'rouge', fantasy:'amethyst', car:'azure' };

  function validId(id){ return THEMES.some(function(t){ return t.id === id; }); }
  function getSaved(){
    try{ var v = localStorage.getItem(KEY); v = LEGACY[v] || v; return validId(v) ? v : 'default'; }catch(e){ return 'default'; }
  }
  function apply(id){
    if(id === 'default') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', id);
  }
  function save(id){ try{ localStorage.setItem(KEY, id); }catch(e){ /* private mode: still applies for this visit */ } }

  var current = getSaved();
  apply(current);

  function buildPicker(){
    var actions = document.querySelector('header .actions');
    if(!actions) return;

    var wrap = document.createElement('div');
    wrap.className = 'theme-picker';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'themeBtn';
    btn.title = 'Change the colour theme';
    btn.textContent = '\uD83C\uDFA8 Theme';

    var menu = document.createElement('div');
    menu.className = 'theme-menu';

    function refresh(){
      menu.querySelectorAll('.theme-option').forEach(function(o){
        o.classList.toggle('selected', o.dataset.theme === current);
      });
    }

    THEMES.forEach(function(t){
      var opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'theme-option';
      opt.dataset.theme = t.id;
      var sw = document.createElement('span');
      sw.className = 'theme-swatch';
      sw.style.background = 'linear-gradient(135deg, ' + t.colors[0] + ' 50%, ' + t.colors[1] + ' 50%)';
      var label = document.createElement('span');
      label.textContent = t.name;
      var tick = document.createElement('span');
      tick.className = 'theme-check';
      tick.textContent = '\u2713';
      opt.appendChild(sw); opt.appendChild(label); opt.appendChild(tick);
      opt.addEventListener('click', function(){
        current = t.id;
        apply(current);
        save(current);
        refresh();
        menu.classList.remove('open');
      });
      menu.appendChild(opt);
    });

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target)) menu.classList.remove('open');
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') menu.classList.remove('open');
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    var info = document.getElementById('infoBtn');
    actions.insertBefore(wrap, info || null);   // sits just before Info on the home page, at the end elsewhere
    refresh();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPicker);
  else buildPicker();
})();
