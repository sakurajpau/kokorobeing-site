/* いまここニュース：記事のHTMLはそのままに、読む側で見やすく組みかえる。
   （目次・けさの数字の帯・1番の記事を大きく・2番からは押すとひらく） */
(function () {
  var d = document, root = d.documentElement;
  var wrap = d.querySelector('main .wrap');
  if (!wrap || !wrap.querySelectorAll) return;
  var lg = (root.lang || 'ja').toLowerCase().slice(0, 2);
  var TT = {
    en: { mind: "🌿 At the end: Today's Mindfulness (3 min) ▼", more: 'Read more', close: 'Close', nums: 'Key numbers', nav: 'On this page', world: 'World', japan: 'Japan', mideast: 'Middle East',
        chip: "Today's main news", big: 'What is happening now, in three minutes.', sub: 'The main news from the world and Japan, in plain words. Tap a headline to read more.' },
    id: { mind: '🌿 Di bagian akhir: Mindfulness Hari Ini (3 menit) ▼', more: 'Baca selengkapnya', close: 'Tutup', nums: 'Angka pagi ini', nav: 'Di halaman ini', world: 'Dunia', japan: 'Jepang', mideast: 'Timur Tengah',
        chip: 'Berita utama hari ini', big: 'Apa yang terjadi sekarang, dalam tiga menit.', sub: 'Berita utama dari dunia dan Jepang, dengan kata-kata sederhana. Ketuk judul untuk membaca selengkapnya.' },
    ko: { mind: '🌿 맨 아래에: 오늘의 마인드풀니스 (3분) ▼', more: '자세히 읽기', close: '닫기', nums: '오늘 아침 숫자', nav: '이 페이지 목차', world: '세계', japan: '일본', mideast: '중동',
        chip: '오늘의 주요 뉴스', big: '지금 일어나는 일을 3분 안에.', sub: '세계와 일본의 주요 뉴스를 쉬운 말로 정리했습니다. 제목을 누르면 자세히 읽을 수 있습니다.' },
    ja: { mind: '🌿 最後に「今日のマインドフルネス」（3分）があります ▼', more: 'くわしく読む', close: 'とじる', nums: 'けさの数字', nav: 'このページの目次', world: '世界', japan: '日本', mideast: '中東',
        chip: 'けさの主なニュース', big: 'いま起きていることを、3分で。', sub: '世界と日本のニュースを、やさしい言葉でまとめています。見出しを押すと、くわしく読めます。' }
  };
  var T = TT[lg] || TT.ja;
  function el(tag, cls, text) { var e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function own(node) { // 子の要素をのぞいた、そのものの文字
    var s = '';
    for (var n = node.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) s += n.nodeValue;
    return s.replace(/\s+/g, ' ').trim();
  }

  var secs = [].filter.call(wrap.children, function (c) { return c.tagName === 'SECTION' && !c.hidden; });
  var lists = 0, market = [], nav = el('nav', 'nx-nav');
  nav.setAttribute('aria-label', T.nav);
  secs.forEach(function (s, i) {
    if (s.classList.contains('today')) s.classList.add('sec-today');
    else if (s.classList.contains('mideast')) s.classList.add('sec-mideast');
    else if (s.querySelector('ol.list')) s.classList.add(lists++ ? 'sec-japan' : 'sec-world');
    else if (s.querySelector('.mini')) { s.classList.add('sec-other'); if (s.classList.contains('hokkori')) s.classList.add('sec-wide'); }
    else if (s.querySelector('.grid')) { s.classList.add('sec-market'); market.push(s); }
    var h = s.querySelector('h2');
    if (!h) return;
    if (!s.id) s.id = 'sec-' + (i + 1);
    var a = el('a', '', own(h));
    a.href = '#' + s.id;
    nav.appendChild(a);
  });

  // 食と医療があるときは、日本の面を2段ぶんの高さにして、右の列に「ほかの国」「食と医療」を上下にならべる
  var jp = wrap.querySelector('.sec-japan');
  if (jp && wrap.querySelector('section.food.sec-other')) jp.classList.add('span2');

  // 世界のトップ5：1番は大きくひらいたまま、2番からはたたむ
  // いちばん上の面(中東情勢があればそれ、なければ世界)は1番を大きく。そのあとの世界の面は、どれも押すとひらく
  var topSec = wrap.querySelector('.sec-mideast') || wrap.querySelector('.sec-world');
  if (topSec) topSec.classList.add('sec-top');
  [].forEach.call(wrap.querySelectorAll('.sec-mideast ol.list, .sec-world ol.list, .sec-japan ol.list'), function (world) {
    var isTop = world.parentNode === topSec;
    var items = [].filter.call(world.children, function (li) { return li.classList.contains('item'); });
    items.forEach(function (li, i) {
      if (isTop && i === 0) { li.classList.add('lead'); if (items.length > 2) li.style.gridRow = '1 / span ' + 1; } // 横に並べるのは3本まで。のこりは下に2列で(パソコンで左が空かないように)
      var body = li.querySelector(':scope > div'), title = body && body.querySelector('.t');
      if (!body || !title || !body.querySelector('ul')) return;
      li.classList.add('fold');
      var btn = el('button', 'nx-more', T.more);
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      function toggle() {
        var open = li.classList.toggle('open');
        btn.textContent = open ? T.close : T.more;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      btn.addEventListener('click', toggle);
      title.addEventListener('click', toggle);
      body.appendChild(btn);
    });
  });

  // 見出しの上に小さな分類（世界・日本）を付ける
  [['.sec-mideast', T.mideast], ['.sec-world', T.world], ['.sec-japan', T.japan]].forEach(function (p) {
    [].forEach.call(wrap.querySelectorAll(p[0] + ' .item .t'), function (t) {
      t.parentNode.insertBefore(el('div', 'nx-cat', p[1]), t);
    });
  });

  // ニュースの入り口の大きな見出し
  var worldSec = topSec;
  if (worldSec) {
    var hero = el('div', 'nx-hero'), day = wrap.querySelector('header .date');
    var m = day && /^(\d{4})-(\d\d)-(\d\d)$/.exec(day.getAttribute('data-day') || '');
    hero.appendChild(el('span', 'chip', (m ? m[1] + '.' + m[2] + '.' + m[3] + '  ・  ' : '') + T.chip));
    hero.appendChild(el('p', 'big', T.big));
    hero.appendChild(el('p', 'sub', T.sub));
    if (d.getElementById('mindful')) { // 最後に「今日のマインドフルネス」があることを一行で知らせる
      var ml = el('a', 'nx-mind', T.mind);
      ml.href = '#mindful';
      hero.appendChild(ml);
    }
    wrap.insertBefore(hero, worldSec);
  }

  // けさの数字：相場の各欄から、先頭の2枚の最初の行をひろう
  var run = el('div', 'run');
  market.forEach(function (s) {
    [].slice.call(s.querySelectorAll('.card'), 0, 2).forEach(function (card) {
      var row = card.querySelector('.row'), v = row && row.querySelector('.v');
      if (!v) return;
      var num = el('div', 'num'), c = v.querySelector('.c');
      num.appendChild(el('span', 'k', row.firstElementChild === v ? '' : row.firstElementChild.textContent.trim()));
      num.appendChild(el('span', 'val', own(v)));
      if (c) { num.appendChild(d.createTextNode(' ')); num.appendChild(el('span', c.className, c.textContent.trim())); }
      run.appendChild(num);
    });
  });

  var head = wrap.querySelector(':scope > header');
  var at = head ? head.nextSibling : wrap.firstChild;
  if (nav.children.length > 1) wrap.insertBefore(nav, at);
  if (run.children.length) {
    var nums = el('div', 'nx-nums');
    nums.appendChild(el('span', 'lab', T.nums));
    nums.appendChild(run);
    wrap.insertBefore(nums, at);
  }
  root.classList.add('nx');
})();
