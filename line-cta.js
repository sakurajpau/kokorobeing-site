/* 公式LINEへの入口(日本語ページ用)
   - data-box をつけて読み込んだページ: 本文の最後に LINE の案内を出す
   - すべてのページ: スマホ(幅767px以下)のとき、画面の下に LINE ボタンを出す */
(function () {
  var LINE_URL = "https://lin.ee/v6xlqGl";
  var me = document.currentScript;
  var wantBox = me && me.hasAttribute("data-box");

  var css = ""
    + ".kb-line-box{max-width:940px;margin:40px auto 0;border:1px solid #E2E7E4;border-radius:16px;padding:28px 24px;background:#F4F7F5;color:#23272A;display:grid;gap:12px;font-family:'Zen Kaku Gothic New','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;line-height:1.8}"
    + ".kb-line-box h2{font-size:20px;margin:0;font-weight:700}"
    + ".kb-line-box p{margin:0;color:#4A545B}"
    + ".kb-line-box .gift{background:#FFFFFF;border:1px solid #E2E7E4;border-radius:12px;padding:12px 16px;font-size:15px}"
    + ".kb-line-box .gift b{display:block;margin-bottom:2px}"
    + ".kb-line-box ul{margin:0;padding-left:1.3em;color:#4A545B}"
    + ".kb-line-btn{justify-self:start;display:inline-block;padding:14px 28px;border-radius:999px;background:#06C755;color:#FFFFFF !important;text-decoration:none;font-weight:700}"
    + ".kb-line-bar{display:none}"
    + "@media (max-width:767px){"
    + ".kb-line-bar{display:flex;position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:900;justify-content:center;align-items:center;gap:8px;padding:14px 16px;border-radius:999px;background:#06C755;color:#FFFFFF !important;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 14px rgba(0,0,0,.18);font-family:'Zen Kaku Gothic New','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif}"
    + ".kb-line-bar{opacity:0;transform:translateY(120%);pointer-events:none;transition:opacity .25s,transform .25s}"
    + ".kb-line-bar.kb-show{opacity:1;transform:none;pointer-events:auto}"
    + ".kb-line-bar small{font-weight:500;font-size:13px;opacity:.95}"
    + "body.kb-has-bar{padding-bottom:84px}"
    + ".kb-line-box .kb-line-btn{justify-self:stretch;text-align:center}"
    + "}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (wantBox) {
      var box = document.createElement("section");
      box.className = "kb-line-box";
      box.setAttribute("aria-label", "公式LINE");
      box.innerHTML = ""
        + "<h2>公式LINE「KoKoRoBeing」</h2>"
        + "<p>ちょっとした質問や、講座・プログラムのお知らせはLINEで受け取れます。</p>"
        + "<div class=\"gift\"><b>友だち登録プレゼント</b><ul>"
        + "<li>わたしの頑張りすぎタイプチェック</li><li>音声瞑想ガイド</li><li>今日のおみくじ</li>"
        + "</ul></div>"
        + "<a class=\"kb-line-btn\" href=\"" + LINE_URL + "\">LINEで友だち追加する</a>";
      var main = document.querySelector("main") || document.body;
      main.appendChild(box);
    }

    var bar = document.createElement("a");
    bar.className = "kb-line-bar";
    bar.href = LINE_URL;
    bar.innerHTML = "LINEで友だち追加<small>(プレゼントあり)</small>";
    document.body.appendChild(bar);
    document.body.classList.add("kb-has-bar");

    // 最初の画面のボタンとかさならないよう、少し下に読み進めてから出す
    function toggle() {
      bar.classList.toggle("kb-show", window.scrollY > 400);
    }
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  });
})();
