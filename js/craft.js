/**
 * 建筑工艺页 - 3D 球形词云
 * 词云大小按工艺出现频次，点击跳转技艺介绍页
 */
(function () {
  const ALL_BUILDINGS = [
    ...MINJU_DATA.map(d => ({ ...d, type: 'minju' })),
    ...GUANFU_DATA.map(d => ({ ...d, type: 'guanfu' })),
    ...HUANGONG_DATA.map(d => ({ ...d, type: 'huangong' })),
    ...QIAOLIANG_DATA.map(d => ({ ...d, type: 'qiaoliang' }))
  ];

  function extractKeywords(b) {
    const kw = new Set();
    const add = (str) => {
      if (!str) return;
      str.split(/[、，,]/).forEach(s => {
        const t = s.trim();
        if (t && CRAFT_KEYWORDS.includes(t)) kw.add(t);
      });
    };
    add(b.craft);
    add(b.structure);
    add(b.feature);
    if (b.subtype && CRAFT_KEYWORDS.includes(b.subtype)) kw.add(b.subtype);
    return Array.from(kw);
  }

  function getCraftFrequency() {
    const count = {};
    CRAFT_KEYWORDS.forEach(k => count[k] = 0);
    ALL_BUILDINGS.forEach(b => {
      extractKeywords(b).forEach(k => count[k]++);
    });
    CRAFT_KEYWORDS.forEach(k => { if (count[k] === 0) count[k] = 1; });
    return count;
  }

  function buildTagCloudTexts(freq) {
    const arr = [];
    CRAFT_KEYWORDS.forEach(k => {
      const n = Math.max(1, Math.min(freq[k] || 1, 8));
      for (let i = 0; i < n; i++) arr.push(k);
    });
    return arr;
  }

  function init() {
    const container = document.getElementById('craftCloud');
    if (!container || typeof TagCloud === 'undefined') return;

    const freq = getCraftFrequency();
    const texts = buildTagCloudTexts(freq);

    TagCloud(container, texts, {
      radius: 320,
      maxSpeed: 'fast',
      initSpeed: 'slow',
      direction: 135,
      keep: true
    });

    container.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'SPAN' && t.textContent) {
        const kw = t.textContent.trim();
        if (CRAFT_KEYWORDS.includes(kw)) {
          location.href = 'craft-detail.html?keyword=' + encodeURIComponent(kw);
        }
      }
    });

    container.style.cursor = 'pointer';
    container.title = '点击工艺关键词进入技艺介绍';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
