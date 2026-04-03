/**
 * 华夏营造 - 建筑详情页（可视化增强版）
 * 参考大数据可视化案例：数据卡片、对比图表
 */
(function () {
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };
  const TYPE_COLORS = { minju: '#4a9c82', guanfu: '#c41e3a', huangong: '#d4a84b', qiaoliang: '#5b8fc4' };

  function getBuildingByName(name) {
    if (!name) return null;
    return MAP_SCATTER_DATA.find(x => x.name === decodeURIComponent(name));
  }

  function getRelatedBuildings(d, limit = 4) {
    return MAP_SCATTER_DATA
      .filter(x => x.name !== d.name && (x.type === d.type || x.province === d.province))
      .slice(0, limit);
  }

  function getCraftTags(craft) {
    if (!craft) return [];
    return craft.split(/[、，,]/).map(s => s.trim()).filter(Boolean);
  }

  function isCraftKeyword(tag) {
    return typeof CRAFT_KEYWORDS !== 'undefined' && CRAFT_KEYWORDS.includes(tag);
  }

  function formatYearRange(d) {
    if (d.yearStart != null && d.yearEnd != null) {
      const start = d.yearStart < 0 ? '公元前' + Math.abs(d.yearStart) : d.yearStart;
      return `${start} — ${d.yearEnd}`;
    }
    return d.era || '-';
  }

  function getComparisonData(d) {
    if (d.type === 'qiaoliang' && d.length) {
      const list = QIAOLIANG_DATA.filter(x => x.length > 0).sort((a, b) => b.length - a.length).slice(0, 6);
      return { type: 'bar', data: list, valueKey: 'length', unit: 'm', nameKey: 'name' };
    }
    if (d.type === 'huangong' && d.area) {
      const list = HUANGONG_DATA.filter(x => x.area > 0).sort((a, b) => b.area - a.area).slice(0, 6);
      return { type: 'bar', data: list, valueKey: 'area', unit: '万㎡', nameKey: 'name' };
    }
    return null;
  }

  function renderDetail(d) {
    const content = document.getElementById('detailContent');
    const notFound = document.getElementById('detailNotFound');
    const title = document.getElementById('detailTitle');

    if (!d) {
      content.style.display = 'none';
      notFound.style.display = 'block';
      title.textContent = '建筑详情';
      document.title = '建筑详情 - 华夏营造';
      return;
    }

    content.style.display = 'block';
    notFound.style.display = 'none';
    title.textContent = `${TYPE_NAMES[d.type]} · ${d.name}`;
    document.title = `${d.name} - 华夏营造`;

    const imageHtml = d.imageUrl
      ? `<div class="detail-hero-image"><img src="${d.imageUrl}" alt="${d.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="detail-image-placeholder" style="display:none;">建筑示意图</div></div>`
      : `<div class="detail-image-placeholder detail-hero-placeholder">建筑示意图</div>`;

    const description = (typeof BUILDING_DESCRIPTIONS !== 'undefined' && BUILDING_DESCRIPTIONS[d.name])
      ? BUILDING_DESCRIPTIONS[d.name]
      : `${d.feature || ''}${d.craft ? '。' + d.craft : ''}${d.structure ? ' 结构采用' + d.structure + '。' : ''}`;

    const historyText = (typeof BUILDING_HISTORY !== 'undefined' && BUILDING_HISTORY[d.name])
      ? BUILDING_HISTORY[d.name]
      : null;

    const craftTags = getCraftTags(d.craft);
    const hasCraftLinks = craftTags.some(t => isCraftKeyword(t));
    const craftTagsHtml = craftTags.length
      ? `<div class="detail-tags">${craftTags.map(t => isCraftKeyword(t)
          ? `<a href="craft-detail.html?keyword=${encodeURIComponent(t)}" class="detail-tag detail-tag-link">${t}</a>`
          : `<span class="detail-tag">${t}</span>`).join('')}</div>`
      : '';

    const developmentText = (typeof BUILDING_DEVELOPMENT !== 'undefined' && BUILDING_DEVELOPMENT[d.name]) || null;
    const significanceText = (typeof BUILDING_SIGNIFICANCE !== 'undefined' && BUILDING_SIGNIFICANCE[d.name]) || null;
    const protectionText = (typeof BUILDING_PROTECTION !== 'undefined' && BUILDING_PROTECTION[d.name]) || null;
    const wikiUrl = 'https://zh.wikipedia.org/wiki/' + encodeURIComponent(d.name);

    const infoRows = [
      ['类型', TYPE_NAMES[d.type] + (d.subtype ? `（${d.subtype}）` : '')],
      ['所在地', d.location],
      ['省份', d.province || '-'],
      ['年代', d.era || '-'],
      ['建造时间', formatYearRange(d)],
      ['结构形式', d.structure || '-'],
      ['特色', d.feature || '-']
    ];
    if (d.area) infoRows.push(['建筑面积', d.area + ' 万㎡']);
    if (d.halls) infoRows.push(['殿宇数量', d.halls + ' 座']);
    if (d.length) infoRows.push(['长度/跨度', d.length + ' m']);
    if (d.span) infoRows.push(['主跨', d.span + ' m']);

    const related = getRelatedBuildings(d);
    const relatedHtml = related.length
      ? `
        <section class="detail-section">
          <h3>相关建筑</h3>
          <div class="detail-related">
            ${related.map(r => `
              <a href="detail.html?name=${encodeURIComponent(r.name)}" class="detail-related-card">
                <span class="related-name">${r.name}</span>
                <span class="related-meta">${TYPE_NAMES[r.type]} · ${r.location}</span>
              </a>
            `).join('')}
          </div>
        </section>
      `
      : '';

    const comparisonData = getComparisonData(d);
    const comparisonHtml = comparisonData
      ? `
        <section class="detail-section">
          <h3>同类对比</h3>
          <div class="detail-chart-wrap">
            <div id="detailCompareChart" style="height: 220px;"></div>
          </div>
        </section>
      `
      : '';

    const dataCards = [
      { label: '建筑类型', value: TYPE_NAMES[d.type], highlight: true },
      { label: '所在地', value: d.location },
      { label: '年代', value: d.era || '-' },
      { label: '结构', value: d.structure || '-' }
    ];
    if (d.area) dataCards.push({ label: '面积', value: d.area + '万㎡' });
    if (d.length) dataCards.push({ label: '长度', value: d.length + 'm' });

    const cardsHtml = `
      <div class="detail-data-cards">
        ${dataCards.map(c => `
          <div class="detail-data-card ${c.highlight ? 'highlight' : ''}">
            <span class="card-label">${c.label}</span>
            <span class="card-value">${c.value}</span>
          </div>
        `).join('')}
      </div>
    `;

    content.innerHTML = `
      <article class="detail-article">
        ${imageHtml}
        <div class="detail-body">
          <header class="detail-header-inner">
            <h1>${d.name}</h1>
            <p class="detail-subtitle">${TYPE_NAMES[d.type]}${d.subtype ? ' · ' + d.subtype : ''} · ${d.location}</p>
          </header>

          ${cardsHtml}

          <section class="detail-section">
            <h3>建筑简介</h3>
            <p class="detail-desc">${description}</p>
          </section>

          ${historyText ? `
          <section class="detail-section">
            <h3>历史背景</h3>
            <p class="detail-desc">${historyText}</p>
          </section>
          ` : ''}

          ${developmentText ? `
          <section class="detail-section">
            <h3>发展历程</h3>
            <p class="detail-desc">${developmentText}</p>
          </section>
          ` : ''}

          ${significanceText ? `
          <section class="detail-section">
            <h3>历史意义</h3>
            <p class="detail-desc">${significanceText}</p>
          </section>
          ` : ''}

          ${protectionText ? `
          <section class="detail-section">
            <h3>保护与现状</h3>
            <p class="detail-desc">${protectionText}</p>
          </section>
          ` : ''}

          ${craftTagsHtml ? `
          <section class="detail-section">
            <h3>工艺与技术</h3>
            ${hasCraftLinks ? '<p class="detail-desc detail-craft-hint">点击工艺关键词可查看技艺详细介绍</p>' : ''}
            ${craftTagsHtml}
          </section>
          ` : ''}

          <section class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-info-grid">
              ${infoRows.map(([k, v]) => `
                <div class="detail-info-item">
                  <span class="label">${k}</span>
                  <span class="value">${v}</span>
                </div>
              `).join('')}
            </div>
          </section>

          ${comparisonHtml}

          ${relatedHtml}

          <section class="detail-section detail-section-links">
            <h3>延伸阅读</h3>
            <p class="detail-desc">
              <a href="${wikiUrl}" target="_blank" rel="noopener" class="detail-ext-link">维基百科 · ${d.name}</a>
            </p>
          </section>
        </div>
      </article>
    `;

    if (comparisonData && typeof echarts !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('detailCompareChart');
        if (el) {
          const chart = echarts.init(el);
          const cd = comparisonData;
          const isCurrent = (item) => item.name === d.name;
          chart.setOption({
            tooltip: { trigger: 'axis' },
            grid: { left: 90, right: 20, top: 20, bottom: 30 },
            xAxis: {
              type: 'value',
              axisLabel: { color: '#8b7355', fontSize: 10 },
              splitLine: { lineStyle: { color: 'rgba(212,168,75,0.15)' } }
            },
            yAxis: {
              type: 'category',
              data: cd.data.map(x => x[cd.nameKey]),
              axisLabel: { color: '#f5f0e6', fontSize: 11 }
            },
            series: [{
              type: 'bar',
              data: cd.data.map(x => ({
                value: x[cd.valueKey],
                itemStyle: {
                  color: isCurrent(x) ? TYPE_COLORS[d.type] : 'rgba(139, 115, 85, 0.5)'
                }
              })),
              barMaxWidth: 22
            }]
          });
          window.addEventListener('resize', () => chart.resize());
        }
      }, 100);
    }
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const d = getBuildingByName(name);
    renderDetail(d);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
