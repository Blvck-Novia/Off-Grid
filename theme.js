/* Colour themes: shared by every page.
   Runs from <head> so the saved theme is applied before the page paints (no flash of the wrong colours),
   then adds the "Menu" (FAQ, Feedback and, on the home page, Theme) to the header once the page has loaded. */
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
    var isHome = !!document.getElementById('infoBtn');   // themes are only changed from the home page
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    var wrap = document.createElement('div');
    wrap.className = 'menu-wrap';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'menuBtn';
    btn.title = 'Menu';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '\u2630 Menu';

    var menu = document.createElement('div');
    menu.className = 'site-menu';

    function closeMenu(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }

    function link(href, text, active){
      var a = document.createElement('a');
      a.className = 'menu-link' + (active ? ' active' : '');
      a.href = href; a.textContent = text;
      return a;
    }

    var themeOpts = [];
    function refresh(){
      themeOpts.forEach(function(o){
        var on = o.dataset.theme === current;
        o.classList.toggle('selected', on);
        o.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }

    if(!isHome) menu.appendChild(link('index.html', 'Home', false));

    if(isHome){
      var tbtn = document.createElement('button');
      tbtn.type = 'button';
      tbtn.id = 'themeBtn';
      tbtn.className = 'menu-link menu-theme-toggle';
      tbtn.innerHTML = '<span class="theme-icon" aria-hidden="true"></span><span>Theme</span><span class="menu-caret">\u25B8</span>';
      var list = document.createElement('div');
      list.className = 'theme-list';
      list.setAttribute('role', 'radiogroup');
      THEMES.forEach(function(t){
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.className = 'theme-option';
        opt.setAttribute('role', 'radio');
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
        opt.addEventListener('click', function(e){
          e.stopPropagation();
          current = t.id; apply(current); save(current); refresh();
        });
        themeOpts.push(opt);
        list.appendChild(opt);
      });
      tbtn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = list.classList.toggle('open');
        tbtn.classList.toggle('open', open);
      });
      menu.appendChild(tbtn);
      menu.appendChild(list);
    }

    menu.appendChild(link('faq.html', 'FAQ', page === 'faq.html'));
    menu.appendChild(link('feedback.html', 'Feedback', page === 'feedback.html'));

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){ if(!wrap.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    actions.appendChild(wrap);
    refresh();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPicker);
  else buildPicker();
})();
