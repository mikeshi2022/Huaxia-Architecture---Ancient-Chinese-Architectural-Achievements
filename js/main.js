/**
 * 华夏营造 - 主大屏逻辑
 * 2026中国大学生计算机设计大赛 · AI+信息可视化设计
 */
(function () {
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };

  // 地图 geo 省份名 -> 数据中的省份简称
  const GEO_TO_PROVINCE = {
    '北京市': '北京', '天津市': '天津', '河北省': '河北', '山西省': '山西',
    '内蒙古自治区': '内蒙古', '辽宁省': '辽宁', '吉林省': '吉林', '黑龙江省': '黑龙江',
    '上海市': '上海', '江苏省': '江苏', '浙江省': '浙江', '安徽省': '安徽',
    '福建省': '福建', '江西省': '江西', '山东省': '山东', '河南省': '河南',
    '湖北省': '湖北', '湖南省': '湖南', '广东省': '广东', '广西壮族自治区': '广西',
    '海南省': '海南', '重庆市': '重庆', '四川省': '四川', '贵州省': '贵州',
    '云南省': '云南', '西藏自治区': '西藏', '陕西省': '陕西', '甘肃省': '甘肃',
    '青海省': '青海', '宁夏回族自治区': '宁夏', '新疆维吾尔自治区': '新疆',
    '台湾省': '台湾', '香港特别行政区': '香港', '澳门特别行政区': '澳门'
  };

  let currentFilter = { type: 'all', era: 'all', province: 'all' };
  const urlParams = new URLSearchParams(window.location.search);
  const urlProvince = urlParams.get('province');
  if (urlProvince && MAP_SCATTER_DATA.some(function (d) { return d.province === urlProvince; })) {
    currentFilter.province = urlProvince;
  }
  let carouselIndex = 0;
  let carouselTimer = null;
  let mapChartInstance = null;
  let pannellumViewer = null;
  let timelineChartInstance = null;
  let provinceChartInstance = null;

  function geoNameToProvince(geoName) {
    return GEO_TO_PROVINCE[geoName] || geoName.replace(/(省|市|自治区|特别行政区)$/, '').replace(/壮族|回族|维吾尔/g, '') || geoName;
  }

  function getFilteredData() {
    return MAP_SCATTER_DATA.filter(d => {
      if (currentFilter.type !== 'all' && d.type !== currentFilter.type) return false;
      if (currentFilter.era !== 'all') {
        const eraMatch = d.era && d.era.includes(currentFilter.era);
        if (!eraMatch) return false;
      }
      if (currentFilter.province !== 'all' && d.province !== currentFilter.province) return false;
      return true;
    });
  }

  function initPieChart() {
    const el = document.getElementById('chartPie');
    if (!el || typeof echarts === 'undefined') return;
    const chart = echarts.init(el);
    const data = PIE_DATA.map(p => ({ ...p }));
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderColor: '#1a1a1a', borderWidth: 2 },
        label: {
          show: true,
          color: '#f5f0e6',
          formatter: '{b}\n{c}处'
        },
        data
      }]
    });
    window.addEventListener('resize', () => chart.resize());
  }

  function initMapChart() {
    const el = document.getElementById('chartMap');
    if (!el || typeof echarts === 'undefined') return;

    const chart = echarts.init(el);
    mapChartInstance = chart;
    const filtered = getFilteredData();

    const scatterData = filtered.map(d => ({
      name: d.name,
      value: d.coords,
      type: d.type,
      itemStyle: { color: TYPE_COLORS[d.type] }
    }));

    function renderMap(useGeo) {
      const provinceRegions = currentFilter.province !== 'all'
        ? Object.entries(GEO_TO_PROVINCE)
            .filter(([, short]) => short === currentFilter.province)
            .map(([geoName]) => ({ name: geoName, itemStyle: { areaColor: 'rgba(212, 168, 75, 0.45)' } }))
        : [];

      const baseOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: p => {
            const d = filtered.find(x => x.name === p.name);
            if (!d) {
              const prov = geoNameToProvince(p.name);
              const count = MAP_SCATTER_DATA.filter(b => b.province === prov).length;
              return `<b>${p.name}</b><br/>${count} 处建筑 · 点击筛选`;
            }
            return `<b>${p.name}</b><br/>${TYPE_NAMES[d.type]} · ${d.location}<br/>${d.era || ''}<br/><span style="color:#8b7355;font-size:11px">${d.panoramaUrl ? '点击查看实景预览' : '点击查看详情'}</span>`;
          }
        }
      };
      if (useGeo) {
        chart.setOption({
          ...baseOption,
          geo: {
            map: 'china',
            roam: false,
            itemStyle: {
              areaColor: 'rgba(45, 90, 74, 0.2)',
              borderColor: 'rgba(212, 168, 75, 0.4)',
              borderWidth: 1
            },
            emphasis: { itemStyle: { areaColor: 'rgba(45, 90, 74, 0.4)' } },
            regions: provinceRegions
          },
          series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            data: scatterData,
            symbolSize: 12,
            itemStyle: { borderColor: '#fff', borderWidth: 1 },
            label: { show: false },
            emphasis: { scale: 1.5, label: { show: true, formatter: '{b}' } }
          }]
        });
      } else {
        chart.setOption({
          ...baseOption,
          xAxis: { type: 'value', min: 80, max: 130, show: false },
          yAxis: { type: 'value', min: 18, max: 52, show: false },
          grid: { left: 0, right: 0, top: 0, bottom: 0 },
          series: [{
            type: 'scatter',
            data: scatterData.map(d => ({
              value: [d.value[0], d.value[1]],
              name: d.name,
              itemStyle: { color: TYPE_COLORS[d.type] }
            })),
            symbolSize: 14,
            label: { show: true, formatter: '{b}', position: 'top', fontSize: 10 }
          }]
        });
      }
    }

    chart.off('click');
    chart.on('click', params => {
      if (params.componentType === 'geo' && params.name) {
        const province = geoNameToProvince(params.name);
        const count = MAP_SCATTER_DATA.filter(b => b.province === province).length;
        if (count === 0) return;
        if (currentFilter.province === province) {
          currentFilter.province = 'all';
        } else {
          currentFilter.province = province;
        }
        updateProvinceHint();
        refreshAll();
        return;
      }
      const name = params.data && (params.data.name || (params.dataIndex != null && scatterData[params.dataIndex] && scatterData[params.dataIndex].name));
      if (name) {
        const d = MAP_SCATTER_DATA.find(b => b.name === name);
        if (d) showPanoramaPanel(d);
      }
    });

    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(r => r.json())
      .then(geoJson => {
        echarts.registerMap('china', geoJson);
        renderMap(true);
      })
      .catch(() => renderMap(false));

    window.addEventListener('resize', () => chart.resize());
  }

  function updateProvinceHint() {
    const hint = document.getElementById('filterHint');
    const clearBtn = document.getElementById('clearProvince');
    if (!hint) return;
    if (currentFilter.province !== 'all') {
      const count = getFilteredData().length;
      hint.textContent = `当前：${currentFilter.province}（${count} 处）· 点击建筑查看详情`;
      if (clearBtn) {
        clearBtn.style.display = 'inline';
        clearBtn.onclick = () => {
          currentFilter.province = 'all';
          refreshAll();
        };
      }
    } else {
      hint.textContent = '点击地图省份筛选 · 点击建筑查看详情';
      if (clearBtn) clearBtn.style.display = 'none';
    }
  }

  function getDynastyCountsFromFiltered() {
    const filtered = getFilteredData();
    const dynasties = TIMELINE_DATA.map(t => t.dynasty);
    const counts = dynasties.map(() => 0);
    filtered.forEach(d => {
      if (!d.era) return;
      dynasties.forEach((dyn, i) => {
        if (d.era.includes(dyn)) counts[i]++;
      });
    });
    return counts;
  }

  function getProvinceTopFromFiltered() {
    const filtered = getFilteredData();
    const provinces = {};
    filtered.forEach(d => {
      if (d.province) provinces[d.province] = (provinces[d.province] || 0) + 1;
    });
    return Object.entries(provinces)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  function initTimelineChart() {
    const el = document.getElementById('chartTimeline');
    if (!el || typeof echarts === 'undefined') return;
    timelineChartInstance = echarts.init(el);
    updateTimelineChart();
    window.addEventListener('resize', () => timelineChartInstance && timelineChartInstance.resize());
  }

  function initProvinceChart() {
    const el = document.getElementById('chartProvince');
    if (!el || typeof echarts === 'undefined') return;
    provinceChartInstance = echarts.init(el);
    updateProvinceChart();
    window.addEventListener('resize', () => provinceChartInstance && provinceChartInstance.resize());
  }

  function updateProvinceChart() {
    if (!provinceChartInstance) return;
    const provinceTop = getProvinceTopFromFiltered();
    provinceChartInstance.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 60, right: 15, top: 10, bottom: 25 },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.15)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      yAxis: {
        type: 'category',
        data: provinceTop.map(p => p[0]),
        axisLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.4)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      series: [{
        type: 'bar',
        data: provinceTop.map(p => p[1]),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#d4a84b' },
            { offset: 1, color: '#8b7355' }
          ])
        },
        barMaxWidth: 18
      }]
    });
  }

  function updateTimelineChart() {
    if (!timelineChartInstance) return;
    const counts = getDynastyCountsFromFiltered();
    timelineChartInstance.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const idx = params[0]?.dataIndex;
          if (idx == null) return '';
          const t = TIMELINE_DATA[idx];
          return (t ? t.dynasty + '（' + t.year + '）' : '') + '<br/>' + (counts[idx] || 0) + ' 处建筑';
        }
      },
      grid: { left: 40, right: 20, top: 10, bottom: 30 },
      xAxis: {
        type: 'category',
        data: TIMELINE_DATA.map(t => t.dynasty),
        axisLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.4)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.15)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      series: [{
        type: 'bar',
        data: counts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#d4a84b' },
            { offset: 1, color: '#8b7355' }
          ])
        }
      }]
    });
  }

  function initBridgeChart() {
    const el = document.getElementById('chartBridge');
    if (!el || typeof echarts === 'undefined') return;
    const bridgeData = QIAOLIANG_DATA.filter(d => d.length > 0)
      .sort((a, b) => (b.length || 0) - (a.length || 0))
      .slice(0, 6);
    const chart = echarts.init(el);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 80, right: 20, top: 10, bottom: 30 },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.15)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      yAxis: {
        type: 'category',
        data: bridgeData.map(d => d.name),
        axisLine: { lineStyle: { color: 'rgba(212, 168, 75, 0.4)' } },
        axisLabel: { color: '#8b7355', fontSize: 10 }
      },
      series: [{
        type: 'bar',
        data: bridgeData.map(d => d.length),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#d4a84b' },
            { offset: 1, color: '#8b7355' }
          ])
        },
        barMaxWidth: 20
      }]
    });
    window.addEventListener('resize', () => chart.resize());
  }

  let buildingListScrollId = null;
  let buildingListPaused = false;
  let buildingListListenersAdded = false;

  function renderBuildingList() {
    stopBuildingListScroll();
    const inner = document.getElementById('buildingListInner');
    const list = document.getElementById('buildingList');
    if (!inner || !list) return;
    const data = getFilteredData();
    const itemHtml = data.map(d => `
      <div class="building-item" data-name="${d.name}">
        <div class="name">${d.name}</div>
        <div class="info">${TYPE_NAMES[d.type]} · ${d.location}</div>
      </div>
    `).join('');
    inner.innerHTML = data.length > 0 ? itemHtml + itemHtml : '';

    inner.querySelectorAll('.building-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const d = MAP_SCATTER_DATA.find(b => b.name === name);
        if (d) showPanoramaPanel(d);
      });
    });

    if (data.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startBuildingListScroll();
    }
  }

  function startBuildingListScroll() {
    const list = document.getElementById('buildingList');
    const inner = document.getElementById('buildingListInner');
    if (!list || !inner || inner.children.length === 0) return;
    const halfHeight = inner.offsetHeight / 2;

    if (!buildingListListenersAdded) {
      list.addEventListener('mouseenter', () => { buildingListPaused = true; });
      list.addEventListener('mouseleave', () => { buildingListPaused = false; });
      buildingListListenersAdded = true;
    }

    function tick() {
      if (buildingListPaused) {
        buildingListScrollId = requestAnimationFrame(tick);
        return;
      }
      list.scrollTop += 0.50;
      if (list.scrollTop >= halfHeight - 2) {
        list.scrollTop = 0;
      }
      buildingListScrollId = requestAnimationFrame(tick);
    }
    buildingListScrollId = requestAnimationFrame(tick);
  }

  function stopBuildingListScroll() {
    if (buildingListScrollId != null) {
      cancelAnimationFrame(buildingListScrollId);
      buildingListScrollId = null;
    }
  }

  function updateCarousel() {
    const data = getFilteredData();
    if (data.length === 0) return;
    carouselIndex = carouselIndex % data.length;
    const d = data[carouselIndex];
    const area = document.getElementById('carouselArea');
    const titleEl = document.getElementById('carouselTitle');
    const descEl = document.getElementById('carouselDesc');
    const btnEl = document.getElementById('carouselDetailBtn');

    if (area && titleEl && descEl) {
      area.classList.remove('carousel-enter');
      area.classList.add('carousel-transition');
      setTimeout(() => {
        titleEl.textContent = d.name;
        descEl.textContent = `${TYPE_NAMES[d.type]} · ${d.location} · ${d.feature || ''}`;
        if (btnEl) {
          btnEl.href = `detail.html?name=${encodeURIComponent(d.name)}`;
          btnEl.style.display = 'inline-block';
        }
        area.classList.remove('carousel-transition');
        area.classList.add('carousel-enter');
        setTimeout(() => area.classList.remove('carousel-enter'), 350);
      }, 250);
    } else if (titleEl && descEl) {
      titleEl.textContent = d.name;
      descEl.textContent = `${TYPE_NAMES[d.type]} · ${d.location} · ${d.feature || ''}`;
      if (btnEl) {
        btnEl.href = `detail.html?name=${encodeURIComponent(d.name)}`;
        btnEl.style.display = 'inline-block';
      }
    }
    carouselIndex = (carouselIndex + 1) % data.length;
  }

  function startCarousel() {
    updateCarousel();
    carouselTimer = setInterval(updateCarousel, 5000);
  }

  function destroyPannellum() {
    if (pannellumViewer && typeof pannellumViewer.destroy === 'function') {
      pannellumViewer.destroy();
      pannellumViewer = null;
    }
  }

  function showPanoramaPanel(d) {
    const modal = document.getElementById('panoramaModal');
    const titleEl = document.getElementById('panoramaTitle');
    const infoEl = document.getElementById('panoramaInfo');
    const viewerWrap = document.getElementById('panoramaViewerWrap');
    const detailBtn = document.getElementById('panoramaDetailBtn');
    const openBtn = document.getElementById('panoramaOpenBtn');
    const closeBtn = document.getElementById('panoramaClose');
    const backdrop = document.getElementById('panoramaBackdrop');
    if (!modal || !titleEl || !infoEl || !viewerWrap) return;

    destroyPannellum();
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    viewerWrap.innerHTML = '<div id="panoramaViewer"></div>';
    const viewerEl = document.getElementById('panoramaViewer');

    titleEl.textContent = d.name;
    infoEl.textContent = `${TYPE_NAMES[d.type]} · ${d.location} · ${d.era || ''} · ${d.feature || ''}`;
    if (detailBtn) {
      detailBtn.href = `detail.html?name=${encodeURIComponent(d.name)}`;
    }
    if (openBtn) {
      if (d.panoramaUrl) {
        openBtn.href = d.panoramaUrl;
        openBtn.style.display = 'inline-block';
      } else {
        openBtn.style.display = 'none';
      }
    }

    if (d.panoramaUrl && d.panoramaType === 'equirectangular' && typeof pannellum !== 'undefined') {
      pannellumViewer = pannellum.viewer(viewerEl, {
        type: 'equirectangular',
        panorama: d.panoramaUrl,
        autoLoad: true
      });
    } else if (d.panoramaUrl && (d.panoramaType === 'iframe' || d.panoramaUrl.indexOf('720yun') >= 0)) {
      viewerWrap.innerHTML = '<div class="panorama-720-hint"><p>点击下方「在新窗口打开实景」获得完整 360° 全景体验</p><iframe src="' + d.panoramaUrl + '" style="width:100%;height:600px;border:none" allowfullscreen></iframe></div>';
    } else {
      viewerEl.innerHTML = '<div class="panorama-placeholder"><span>暂无实景预览</span><img src="' + (d.imageUrl || '') + '" alt="" onerror="this.style.display=\'none\'" /></div>';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) closeBtn.onclick = hidePanoramaPanel;
    if (backdrop) backdrop.onclick = hidePanoramaPanel;
    document.addEventListener('keydown', onPanoramaKeydown);
  }

  function onPanoramaKeydown(e) {
    if (e.key === 'Escape') hidePanoramaPanel();
  }

  function hidePanoramaPanel() {
    const modal = document.getElementById('panoramaModal');
    const viewerWrap = document.getElementById('panoramaViewerWrap');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    destroyPannellum();
    if (viewerWrap) {
      viewerWrap.innerHTML = '<div id="panoramaViewer"></div>';
    }
    document.removeEventListener('keydown', onPanoramaKeydown);
  }

  function initFilters() {
    const typeSelect = document.getElementById('filterType');
    const eraSelect = document.getElementById('filterEra');
    if (typeSelect) {
      typeSelect.addEventListener('change', () => {
        currentFilter.type = typeSelect.value;
        refreshAll();
      });
    }
    if (eraSelect) {
      eraSelect.addEventListener('change', () => {
        currentFilter.era = eraSelect.value;
        refreshAll();
      });
    }
  }

  function refreshAll() {
    initMapChart();
    renderBuildingList();
    updateCarousel();
    updateProvinceHint();
    updateTimelineChart();
    updateProvinceChart();
  }

  function initTime() {
    const el = document.getElementById('currentTime');
    if (!el) return;
    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  function init() {
    initPieChart();
    initMapChart();
    initTimelineChart();
    initProvinceChart();
    initBridgeChart();
    renderBuildingList();
    initFilters();
    startCarousel();
    initTime();
    updateProvinceHint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
