/**
 * 在跳转到建筑详情前把 ?name= 写入 sessionStorage。
 * 用于规避 npx serve 等工具在 cleanUrls 重定向时丢掉查询串的问题。
 */
(function () {
  var KEY = 'huaxia_detail_building_name';
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || typeof t.closest !== 'function') return;
    var a = t.closest('a[href*="detail.html"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('detail.html') === -1) return;
    var q = href.indexOf('?');
    if (q === -1) return;
    try {
      var params = new URLSearchParams(href.slice(q + 1));
      var n = params.get('name');
      if (n) sessionStorage.setItem(KEY, n);
    } catch (err) { /* ignore */ }
  }, true);
})();
