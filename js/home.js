/**
 * 首页逻辑 - 精选建筑、数据统计
 */
(function () {
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };

  // 精选建筑图片：优先本地（见 images/featured/README.md），否则用 Wikipedia，失败显示占位图
  const FEATURED_LOCAL = {
    '北京故宫': 'images/featured/beijing-forbidden-city.jpg',
    '赵州桥': 'images/featured/zhaozhou-bridge.jpg',
    '宏村': 'images/featured/hongcun.jpg',
    '福建土楼': 'images/featured/fujian-tulou.jpg',
    '卢沟桥': 'images/featured/lugou-bridge.jpg',
    '承德避暑山庄': 'images/featured/chengde-resort.jpg'
  };
  // Wikimedia Commons 无水印免费图片（经 API 验证可用）
  const FEATURED_REMOTE = {
    '北京故宫': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Gate_of_Supreme_Harmony_at_the_Forbidden_City.jpg/400px-Gate_of_Supreme_Harmony_at_the_Forbidden_City.jpg',
    '赵州桥': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Zhaozhou_Bridge.jpg/400px-Zhaozhou_Bridge.jpg',
    '宏村': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ancient_Villages_in_Southern_Anhui_%E2%80%93_Xidi_and_Hongcun-114147.jpg/400px-Ancient_Villages_in_Southern_Anhui_%E2%80%93_Xidi_and_Hongcun-114147.jpg',
    '福建土楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Snail_pit_tulou.jpg/400px-Snail_pit_tulou.jpg',
    '卢沟桥': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lugouqiao2.jpg/400px-Lugouqiao2.jpg',
    '承德避暑山庄': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Chengde_Mountain_Resort_1.jpg/400px-Chengde_Mountain_Resort_1.jpg'
  };

  function svgPlaceholder(name) {
    const text = encodeURIComponent(name);
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect fill='%232d5a4a' width='400' height='160'/%3E%3Ctext fill='%23d4a84b' x='200' y='85' text-anchor='middle' font-size='22' font-family='sans-serif'%3E" + text + "%3C/text%3E%3C/svg%3E";
  }

  window.featuredImgFallback = function (name) {
    return svgPlaceholder(name);
  };

  function initHeroVideo() {
    const wrap = document.querySelector('.hero-video-wrap');
    const videos = wrap ? wrap.querySelectorAll('.hero-video') : [];
    if (videos.length === 0) return;

    function showFallback() {
      videos.forEach(function (v) { v.classList.remove('active'); });
    }

    videos.forEach(function (v) {
      const src = v.dataset.src;
      if (src) {
        v.src = src;
        v.load();
      }
      v.addEventListener('error', showFallback);
    });

    const first = videos[0];
    if (first) {
      first.play().catch(function () {});
    }

    let idx = 0;
    setInterval(function () {
      videos.forEach(function (v) { v.classList.remove('active'); });
      idx = (idx + 1) % videos.length;
      const next = videos[idx];
      if (next) {
        next.classList.add('active');
        next.play().catch(function () {});
      }
    }, 8000);
  }

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

  function initHomeMapPreview() {
    const chartEl = document.getElementById('homeMapChart');
    const typeEl = document.getElementById('homeMapTypeList');
    const provinceEl = document.getElementById('homeMapProvinceList');
    if (!chartEl || typeof echarts === 'undefined' || typeof MAP_SCATTER_DATA === 'undefined') return;

    const provinces = {};
    MAP_SCATTER_DATA.forEach(function (d) {
      if (d.province) provinces[d.province] = (provinces[d.province] || 0) + 1;
    });
    const provinceTop = Object.entries(provinces).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);

    var TYPE_ICONS = {
      '民居': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V10l7-7 7 7v11M9 21v-6h6v6"/></svg>',
      '官府': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v4H4V4zm0 6h16v10H4V10z"/><path d="M8 14h8M8 18h4"/></svg>',
      '皇宫': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L4 10v11h6v-6h4v6h6V10L12 3z"/></svg>',
      '桥梁': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16c2-4 4-8 10-8s8 4 10 8"/><path d="M2 16h20"/><path d="M6 16v4M12 16v4M18 16v4"/></svg>'
    };
    var TYPE_COLORS_NEW = { '民居': '#7a9c8a', '官府': '#b87272', '皇宫': '#c9a23f', '桥梁': '#7a9cba' };
    if (typeEl && typeof PIE_DATA !== 'undefined') {
      typeEl.innerHTML = PIE_DATA.map(function (p) {
        var color = TYPE_COLORS_NEW[p.name] || (p.itemStyle && p.itemStyle.color) || '#8b7355';
        var icon = TYPE_ICONS[p.name] || '';
        return '<div class="type-item"><span class="type-left"><span class="type-icon" style="color:' + color + '">' + icon + '</span><span class="type-name">' + p.name + '</span></span><span class="type-count">' + p.value + '处</span></div>';
      }).join('');
    }
    if (provinceEl) {
      provinceEl.innerHTML = provinceTop.map(function (p) {
        return '<a href="dashboard.html?province=' + encodeURIComponent(p[0]) + '" class="province-tag">' + p[0] + ' ' + p[1] + '</a>';
      }).join('');
    }

    function geoNameToProvince(geoName) {
      return GEO_TO_PROVINCE[geoName] || geoName.replace(/(省|市|自治区|特别行政区)$/, '').replace(/壮族|回族|维吾尔/g, '') || geoName;
    }

    function renderMap(useGeo) {
      const chart = echarts.init(chartEl);
      const maxCount = Math.max.apply(null, Object.values(provinces)) || 1;
      const regionData = Object.entries(GEO_TO_PROVINCE).map(function (_ref) {
        var geoName = _ref[0], prov = _ref[1];
        var count = provinces[prov] || 0;
        var intensity = count / maxCount;
        return {
          name: geoName,
          itemStyle: {
            areaColor: count > 0
              ? 'rgba(212, 168, 75, ' + (0.25 + intensity * 0.4) + ')'
              : 'rgba(45, 90, 74, 0.15)',
            borderColor: 'rgba(212, 168, 75, 0.4)',
            borderWidth: 1
          }
        };
      });

      var opt = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            var prov = geoNameToProvince(p.name);
            var count = provinces[prov] || 0;
            return '<b>' + p.name + '</b><br/>' + count + ' 处建筑 · 点击进入数据大屏';
          }
        },
        geo: useGeo ? {
          map: 'china',
          roam: false,
          itemStyle: { areaColor: 'rgba(45, 90, 74, 0.2)', borderColor: 'rgba(212, 168, 75, 0.4)', borderWidth: 1 },
          emphasis: { itemStyle: { areaColor: 'rgba(212, 168, 75, 0.5)' } },
          regions: regionData
        } : undefined
      };
      if (!useGeo) {
        opt.series = [{
          type: 'map',
          map: 'china',
          roam: false,
          itemStyle: { areaColor: 'rgba(45, 90, 74, 0.2)', borderColor: 'rgba(212, 168, 75, 0.4)' },
          emphasis: { itemStyle: { areaColor: 'rgba(212, 168, 75, 0.4)' } },
          data: regionData
        }];
      }
      chart.setOption(opt);

      chart.on('click', function (params) {
        if (params.componentType === 'geo' || params.componentType === 'series') {
          var prov = geoNameToProvince(params.name);
          if (provinces[prov]) {
            window.location.href = 'dashboard.html?province=' + encodeURIComponent(prov);
          }
        }
      });
      window.addEventListener('resize', function () { chart.resize(); });
    }

    fetch('data/china.json')
      .then(function (r) { return r.json(); })
      .then(function (geoJson) {
        echarts.registerMap('china', geoJson);
        renderMap(true);
      })
      .catch(function () { renderMap(false); });
  }

  function initFeaturedBuildings() {
    const el = document.getElementById('homeFeaturedBuildings');
    if (!el || typeof MAP_SCATTER_DATA === 'undefined') return;

    const featured = ['北京故宫', '赵州桥', '宏村', '福建土楼', '卢沟桥', '承德避暑山庄'];
    const buildings = featured
      .map(name => MAP_SCATTER_DATA.find(b => b.name === name))
      .filter(Boolean);

    if (buildings.length === 0) {
      buildings.push(...MAP_SCATTER_DATA.slice(0, 6));
    }

    el.innerHTML = buildings.map(b => {
      const localSrc = FEATURED_LOCAL[b.name];
      const remoteSrc = FEATURED_REMOTE[b.name] || b.imageUrl;
      const imgSrc = localSrc || remoteSrc || svgPlaceholder(b.name);
      const remoteFallback = remoteSrc && !localSrc ? remoteSrc : null;
      const nameAttr = b.name.replace(/"/g, '&quot;');
      const dataRemote = remoteFallback ? ' data-remote="' + remoteFallback.replace(/"/g, '&quot;') + '"' : '';
      return `
      <a href="detail.html?name=${encodeURIComponent(b.name)}" class="home-featured-card">
        <img src="${imgSrc}" alt="${nameAttr}" referrerpolicy="no-referrer" loading="eager"
             data-name="${nameAttr}"${dataRemote}
             onerror="var n=this.dataset.name,r=this.dataset.remote;if(r){this.dataset.remote='';this.src=r}else{this.onerror=null;this.src=window.featuredImgFallback(n)}" />
        <div class="home-featured-card-body">
          <span class="home-featured-card-title">${b.name}</span>
          <span class="home-featured-card-meta">${TYPE_NAMES[b.type]} · ${b.location}</span>
        </div>
      </a>
    `;
    }).join('');
  }

  function initStats() {
    if (typeof MAP_SCATTER_DATA === 'undefined') return;
    const buildingsEl = document.getElementById('homeStatBuildings');
    const provincesEl = document.getElementById('homeStatProvinces');
    if (buildingsEl) buildingsEl.textContent = MAP_SCATTER_DATA.length;
    if (provincesEl) {
      const provinces = new Set();
      MAP_SCATTER_DATA.forEach(b => { if (b.province) provinces.add(b.province); });
      provincesEl.textContent = provinces.size;
    }
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

  function initExploreRandom() {
    const btn = document.getElementById('exploreRandom');
    const overlay = document.getElementById('exploreTransitionOverlay');
    const textEl = document.getElementById('exploreTransitionText');
    const cards = document.querySelectorAll('.explore-card');
    if (!btn || !cards.length) return;

    const items = [
      { url: 'dashboard.html', name: '数据大屏' },
      { url: 'topics.html', name: '四大专题' },
      { url: 'craft.html', name: '建筑工艺' },
      { url: 'timeline.html', name: '朝代时间轴' },
      { url: 'overview.html', name: '营造拾趣' },
      { url: 'ai-chat.html', name: '营造助手' }
    ];

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      btn.disabled = true;

      const idx = Math.floor(Math.random() * items.length);
      const target = items[idx];
      const targetCard = cards[idx];

      btn.classList.add('random-spinning');

      var round = 0;
      var maxRounds = 9 + idx;
      var current = 0;
      var interval = setInterval(function () {
        cards.forEach(function (c) { c.classList.remove('random-highlight'); });
        cards[current].classList.add('random-highlight');
        current = (current + 1) % cards.length;
        round++;
        if (round >= maxRounds) {
          clearInterval(interval);
          cards.forEach(function (c) { c.classList.remove('random-highlight'); });
          if (targetCard) targetCard.classList.add('random-selected');
          if (textEl) textEl.textContent = '前往：' + target.name;
          if (overlay) overlay.classList.add('active');
          setTimeout(function () {
            window.location.href = target.url;
          }, 1200);
        }
      }, 120);
    });
  }

  function init() {
    initHeroVideo();
    initHomeMapPreview();
    initFeaturedBuildings();
    initStats();
    initTime();
    initExploreRandom();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
