/**
 * 技艺介绍页 - 工艺详情 + ECharts 力导向关系图
 */
(function () {
  const params = new URLSearchParams(location.search);
  const keyword = params.get('keyword') || '';

  const ALL_BUILDINGS = [
    ...MINJU_DATA.map(d => ({ ...d, type: 'minju' })),
    ...GUANFU_DATA.map(d => ({ ...d, type: 'guanfu' })),
    ...HUANGONG_DATA.map(d => ({ ...d, type: 'huangong' })),
    ...QIAOLIANG_DATA.map(d => ({ ...d, type: 'qiaoliang' }))
  ];

  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };

  function buildingUsesCraft(b, kw) {
    const str = [b.craft, b.structure, b.feature, b.subtype].filter(Boolean).join('、');
    return str.includes(kw);
  }

  function getRelationGraphData(kw) {
    if (!CRAFT_RELATIONS || !kw) return { nodes: [], links: [] };
    const rels = CRAFT_RELATIONS.filter(r => r.source === kw || r.target === kw);
    const nodeIds = new Set();
    rels.forEach(r => {
      nodeIds.add(r.source);
      nodeIds.add(r.target);
    });
    if (!nodeIds.has(kw)) nodeIds.add(kw);
    const nodes = Array.from(nodeIds).map(id => ({
      id: id,
      name: id,
      symbolSize: id === kw ? 50 : 35,
      itemStyle: {
        color: id === kw ? '#d4a84b' : '#4a9c82',
        borderColor: 'rgba(212,168,75,0.5)',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(212,168,75,0.3)',
        shadowOffsetY: 2
      },
      label: { show: true, color: '#f5f0e6' }
    }));
    const links = rels.map(r => ({
      source: r.source,
      target: r.target,
      lineStyle: { color: 'rgba(212,168,75,0.4)', width: 2 }
    }));
    return { nodes, links };
  }

  function render() {
    if (!keyword || !CRAFT_KEYWORDS.includes(keyword)) {
      document.getElementById('craftTitle').textContent = '未找到该工艺';
      document.getElementById('craftSubtitle').textContent = '请从工艺词云页选择';
      return;
    }

    const info = CRAFT_INFO && CRAFT_INFO[keyword];
    document.getElementById('craftTitle').textContent = keyword;
    document.getElementById('craftSubtitle').textContent = keyword + ' · 技艺介绍';
    document.getElementById('craftCategory').textContent = info && info.category ? info.category : '';
    document.getElementById('craftDesc').textContent = info && info.desc ? info.desc : '暂无详细介绍。';

    const heroEl = document.getElementById('craftHero');
    const imgEl = document.getElementById('craftImage');
    const placeholderEl = document.getElementById('craftImagePlaceholder');
    if (heroEl && imgEl && info && info.imageUrl) {
      imgEl.style.display = 'block';
      if (placeholderEl) placeholderEl.style.display = 'none';
      imgEl.src = info.imageUrl;
      imgEl.alt = keyword;
      imgEl.onerror = function () {
        this.style.display = 'none';
        if (placeholderEl) placeholderEl.style.display = 'block';
      };
      heroEl.style.display = 'block';
    } else if (heroEl) {
      heroEl.style.display = 'none';
    }

    ['History', 'Development', 'Significance'].forEach(name => {
      const key = name.toLowerCase();
      const el = document.getElementById('craft' + name);
      const section = document.getElementById('craft' + name + 'Section');
      const content = info && info[key];
      if (el) el.textContent = content || '';
      if (section) section.style.display = content ? 'block' : 'none';
    });

    const buildings = ALL_BUILDINGS.filter(b => buildingUsesCraft(b, keyword));
    const buildingsEl = document.getElementById('craftBuildings');
    buildingsEl.innerHTML = buildings.length
      ? buildings.map(b => `
          <a href="detail.html?name=${encodeURIComponent(b.name)}" class="craft-building-card">
            <span class="card-name">${b.name}</span>
            <span class="card-meta">${b.subtype || ''} · ${TYPE_NAMES[b.type] || ''}</span>
          </a>
        `).join('')
      : '<p class="craft-no-data">暂无使用该工艺的建筑数据</p>';

    const { nodes, links } = getRelationGraphData(keyword);
    const chartEl = document.getElementById('craftRelationChart');
    if (chartEl && typeof echarts !== 'undefined') {
      const chart = echarts.init(chartEl);
      if (nodes.length > 0) {
        chart.setOption({
          animation: true,
          animationDuration: 1200,
          animationEasing: 'cubicOut',
          tooltip: {},
          series: [{
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            roam: true,
            label: { position: 'right', formatter: '{b}' },
            force: {
              repulsion: 300,
              edgeLength: 120,
              gravity: 0.1,
              layoutAnimation: true
            },
            lineStyle: {
              color: 'rgba(212,168,75,0.5)',
              width: 2,
              curveness: 0.2
            },
            emphasis: {
              scale: 1.2,
              itemStyle: {
                shadowBlur: 16,
                shadowColor: 'rgba(212,168,75,0.5)'
              },
              label: { fontWeight: 'bold' }
            }
          }]
        });
        chart.on('click', (e) => {
          if (e.data && e.data.name && CRAFT_KEYWORDS.includes(e.data.name) && e.data.name !== keyword) {
            location.href = 'craft-detail.html?keyword=' + encodeURIComponent(e.data.name);
          }
        });
      } else {
        chartEl.innerHTML = '<p class="craft-no-data">该工艺暂无关系数据</p>';
      }
      window.addEventListener('resize', () => chart.resize());
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
