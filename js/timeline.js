/**
 * 可交互朝代时间轴
 * - 朝代筛选：点击朝代按钮筛选
 * - 时间范围：双滑块选择年份区间
 * - 图表与列表联动更新
 */
(function () {
  const MIN_YEAR = 581;
  const MAX_YEAR = 1911;
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };
  const TYPE_COLORS = { minju: '#4a9c82', guanfu: '#c41e3a', huangong: '#d4a84b', qiaoliang: '#5b8fc4' };

  // 建筑是否与某朝代重叠（era 包含该朝代）
  function buildingMatchesDynasty(b, dyn) {
    if (!dyn || !b.era) return true;
    return b.era.includes(dyn);
  }

  // 建筑是否与年份区间重叠
  function buildingInYearRange(b, yStart, yEnd) {
    const bStart = b.yearStart != null ? b.yearStart : MIN_YEAR;
    const bEnd = b.yearEnd != null ? b.yearEnd : MAX_YEAR;
    return bStart <= yEnd && bEnd >= yStart;
  }

  // 获取筛选后的建筑列表
  function getFilteredBuildings(dynasty, yearStart, yearEnd) {
    return MAP_SCATTER_DATA.filter(d => {
      if (!buildingMatchesDynasty(d, dynasty)) return false;
      return buildingInYearRange(d, yearStart, yearEnd);
    });
  }

  // 按朝代统计筛选后的数量
  function getCountByDynasty(buildings) {
    const dynastyMap = { '隋': 1, '唐': 2, '宋': 3, '金': 4, '元': 5, '明': 6, '清': 7 };
    const counts = { '隋': 0, '唐': 0, '宋': 0, '金': 0, '元': 0, '明': 0, '清': 0 };
    buildings.forEach(d => {
      if (!d.era) return;
      for (const dyn of Object.keys(counts)) {
        if (d.era.includes(dyn)) counts[dyn]++;
      }
    });
    return counts;
  }

  // 按朝代分组建筑
  function groupByDynasty(buildings) {
    const groups = {};
    TIMELINE_DATA.forEach(t => { groups[t.dynasty] = []; });
    buildings.forEach(d => {
      if (!d.era) return;
      for (const dyn of Object.keys(groups)) {
        if (d.era.includes(dyn)) {
          if (!groups[dyn].some(x => x.name === d.name)) groups[dyn].push(d);
        }
      }
    });
    return groups;
  }

  let chart = null;
  let state = { dynasty: '', yearStart: MIN_YEAR, yearEnd: MAX_YEAR };

  function updateRangeDisplay() {
    const el = document.getElementById('rangeDisplay');
    if (el) el.textContent = state.yearStart + ' — ' + state.yearEnd + ' 年';
  }

  function updateChart(buildings) {
    if (!chart) chart = echarts.init(document.getElementById('timelineChart'));
    const counts = getCountByDynasty(buildings);
    const dynasties = TIMELINE_DATA.map(t => t.dynasty);
    const data = dynasties.map(d => counts[d] || 0);

    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const i = params[0].dataIndex;
          return dynasties[i] + '（' + TIMELINE_DATA[i].year + '）<br/>' + data[i] + ' 处建筑<br/><span style="color:#8b7355;font-size:11px">点击筛选该朝代</span>';
        }
      },
      grid: { left: 60, right: 40, top: 30, bottom: 50 },
      xAxis: {
        type: 'category',
        data: TIMELINE_DATA.map(t => t.dynasty + '\n' + t.year),
        axisLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.4)' } },
        axisLabel: { color: '#8b7355', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        name: '建筑数量',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.15)' } },
        axisLabel: { color: '#8b7355' }
      },
      series: [{
        type: 'bar',
        data: data,
        itemStyle: {
          color: params => {
            const v = params.data;
            return v > 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#d4a84b' },
                  { offset: 1, color: '#8b7355' }
                ])
              : 'rgba(139, 115, 85, 0.2)';
          }
        },
        barMaxWidth: 36,
        emphasis: { itemStyle: { borderColor: '#d4a84b', borderWidth: 2 } }
      }]
    });

    chart.off('click');
    chart.on('click', params => {
      if (params.componentType === 'series' && params.dataIndex != null) {
        const dyn = dynasties[params.dataIndex];
        const pill = document.querySelector(`.dynasty-pill[data-dynasty="${dyn}"]`);
        if (pill) {
          document.querySelectorAll('.dynasty-pill').forEach(b => b.classList.remove('active'));
          pill.classList.add('active');
          state.dynasty = dyn;
          applyFilter();
        }
      }
    });
  }

  function updateList(buildings) {
    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `共 ${buildings.length} 处`;

    const groups = groupByDynasty(buildings);
    const listEl = document.getElementById('timelineBuildings');
    if (!listEl) return;

    listEl.innerHTML = TIMELINE_DATA.map(t => {
      const list = groups[t.dynasty] || [];
      if (list.length === 0 && buildings.length > 0) return '';
      return `
        <div class="timeline-dynasty">
          <h4>${t.dynasty}（${t.year}）<span class="count">${list.length}处</span></h4>
          <div class="timeline-items">
            ${list.map(d => `
              <a href="detail.html?name=${encodeURIComponent(d.name)}" class="timeline-item" style="border-left-color:${TYPE_COLORS[d.type] || '#8b7355'}">
                ${d.name} <span class="type">${TYPE_NAMES[d.type] || ''}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).filter(Boolean).join('') || '<p class="timeline-empty">当前筛选条件下暂无建筑</p>';
  }

  function applyFilter() {
    const buildings = getFilteredBuildings(state.dynasty, state.yearStart, state.yearEnd);
    updateChart(buildings);
    updateList(buildings);
  }

  function init() {
    const startInput = document.getElementById('yearStart');
    const endInput = document.getElementById('yearEnd');

    if (startInput && endInput) {
      startInput.addEventListener('input', () => {
        let v = parseInt(startInput.value, 10);
        if (v > state.yearEnd) {
          v = state.yearEnd;
          startInput.value = v;
        }
        state.yearStart = v;
        updateRangeDisplay();
        applyFilter();
      });
      endInput.addEventListener('input', () => {
        let v = parseInt(endInput.value, 10);
        if (v < state.yearStart) {
          v = state.yearStart;
          endInput.value = v;
        }
        state.yearEnd = v;
        updateRangeDisplay();
        applyFilter();
      });
    }

    document.querySelectorAll('.dynasty-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dynasty-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dynasty = btn.dataset.dynasty || '';
        applyFilter();
      });
    });

    updateRangeDisplay();
    applyFilter();
    window.addEventListener('resize', () => chart && chart.resize());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
