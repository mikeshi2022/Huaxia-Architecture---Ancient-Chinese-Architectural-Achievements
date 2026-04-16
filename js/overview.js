/**
 * 营造拾趣 - 今日一筑、营造故事、建筑与文学、知识小测
 */
(function () {
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };

  // 今日一筑：优先精选建筑，带本地图
  const FEATURED_FOR_TODAY = ['北京故宫', '赵州桥', '宏村', '福建土楼', '卢沟桥', '承德避暑山庄'];
  const FEATURED_IMAGES = {
    '北京故宫': 'images/featured/beijing-forbidden-city.jpg',
    '赵州桥': 'images/featured/zhaozhou-bridge.jpg',
    '宏村': 'images/featured/hongcun.jpg',
    '福建土楼': 'images/featured/fujian-tulou.jpg',
    '卢沟桥': 'images/featured/lugou-bridge.jpg',
    '承德避暑山庄': 'images/featured/chengde-resort.jpg'
  };

  // 二十四节气（按公历约日）
  const SOLAR_TERMS = [
    { m: 1, d: 6, name: '小寒' }, { m: 1, d: 20, name: '大寒' }, { m: 2, d: 4, name: '立春' }, { m: 2, d: 19, name: '雨水' },
    { m: 3, d: 6, name: '惊蛰' }, { m: 3, d: 21, name: '春分' }, { m: 4, d: 5, name: '清明' }, { m: 4, d: 20, name: '谷雨' },
    { m: 5, d: 6, name: '立夏' }, { m: 5, d: 21, name: '小满' }, { m: 6, d: 6, name: '芒种' }, { m: 6, d: 21, name: '夏至' },
    { m: 7, d: 7, name: '小暑' }, { m: 7, d: 23, name: '大暑' }, { m: 8, d: 8, name: '立秋' }, { m: 8, d: 23, name: '处暑' },
    { m: 9, d: 8, name: '白露' }, { m: 9, d: 23, name: '秋分' }, { m: 10, d: 8, name: '寒露' }, { m: 10, d: 23, name: '霜降' },
    { m: 11, d: 7, name: '立冬' }, { m: 11, d: 22, name: '小雪' }, { m: 12, d: 7, name: '大雪' }, { m: 12, d: 22, name: '冬至' }
  ];

  // 营造故事（古籍翻页用）
  const STORIES = [
    {
      title: '李春与赵州桥',
      building: '赵州桥',
      dynasty: '隋',
      image: 'images/featured/zhaozhou-bridge.jpg',
      excerpt: '隋大业年间，匠师李春在河北赵县设计建造了世界上第一座敞肩石拱桥。大拱两肩各开两小拱，既减自重又利泄洪，比欧洲同类结构早约1200年。',
      // AI辅助修改：豆包，2026-02-15
      full: '赵州桥由隋代匠师李春设计建造，距今1400余年。其敞肩拱设计开创世界先河——主拱两侧拱肩处开设小拱，既减轻桥身自重、节省石料，又能在洪水时增加泄洪能力。茅以升在《中国石拱桥》中称其为"中国工程界一绝"。',
      link: 'detail.html?name=赵州桥'
    },
    {
      title: '蔡襄与洛阳桥',
      building: '洛阳桥',
      dynasty: '北宋',
      image: 'images/featured/lugou-bridge.jpg',
      excerpt: '北宋蔡襄主持建造洛阳桥时，江底为淤泥软基。匠人创制筏形基础、种蛎固基、浮运架梁三大技术，建成古代第一座跨海石桥。',
      full: '洛阳桥位于福建泉州洛阳江入海口，是"海内第一桥"。蔡襄采用筏形基础分散荷载，又在桥墩上养殖牡蛎加固石缝——种蛎固基是人类利用生物工程加固建筑的早期范例。',
      link: 'detail.html?name=洛阳桥'
    },
    {
      title: '牛形水系与宏村',
      building: '宏村',
      dynasty: '明',
      image: 'images/featured/hongcun.jpg',
      excerpt: '明永乐年间，汪氏家族将宏村规划为牛形：南湖、月沼为牛胃牛心，蜿蜒水渠为牛肠，家家门前有活水，体现"天人合一"的营造智慧。',
      full: '宏村牛形水系是古代村落规划的杰作。水从村西引入，经月沼、南湖，再沿水渠流经每户门前，既供生活之用，又兼防火、调节气候。2000年宏村与西递同列世界文化遗产。',
      link: 'detail.html?name=宏村'
    },
    {
      title: '客家人的东方城堡',
      building: '福建土楼',
      dynasty: '明清',
      image: 'images/featured/fujian-tulou.jpg',
      excerpt: '客家人南迁闽粤赣交界，为抵御匪患、聚族而居，以生土夯筑圆形或方形土楼。外墙厚达一米余，兼具防御与聚居功能。',
      full: '福建土楼以永定、南靖、华安最为集中。土楼冬暖夏凉、抗震性强，内部木构架、祖堂居中。永定土楼群2008年列入世界文化遗产，被誉为"东方古城堡"。',
      link: 'detail.html?name=福建土楼'
    },
    {
      title: '紫禁城中轴与故宫',
      building: '北京故宫',
      dynasty: '明清',
      image: 'images/detailed_images/宫殿图片/北京故宫/太和殿.jpg',
      excerpt: '明清两代皇宫，木构宫殿沿中轴线铺开，太和殿、中和殿、保和殿体现礼制与营造的最高规制，为世界现存最大古代木构建筑群之一。',
      full: '',
      link: 'detail.html?name=北京故宫'
    },
    {
      title: '卢沟晓月与石桥',
      building: '卢沟桥',
      dynasty: '金',
      image: 'images/detailed_images/桥/卢沟桥.jpg',
      excerpt: '金代十一孔联拱长桥，栏板石狮数以百计，曾为出入京师要道，「卢沟晓月」列入燕京八景。',
      full: '',
      link: 'detail.html?name=卢沟桥'
    },
    {
      title: '避暑山庄与康熙造园',
      building: '承德避暑山庄',
      dynasty: '清',
      image: 'images/detailed_images/宫殿图片/承德避暑山庄/45c5f176a2905ece55e16d547a1b5708.jpg',
      excerpt: '清代皇家行宫园林，融宫殿、湖区、山区、草原于一处，是中国现存规模最大的古典皇家园林之一。',
      full: '',
      link: 'detail.html?name=承德避暑山庄'
    },
    {
      title: '圜丘与祈年殿',
      building: '天坛',
      dynasty: '明',
      image: 'images/detailed_images/宫殿图片/天坛/天坛石雕.jpg',
      excerpt: '明清皇帝祭天之所，祈年殿、圜丘、回音壁将坛庙建筑与声学意匠结合为一。',
      full: '',
      link: 'detail.html?name=天坛'
    },
    {
      title: '十八梭船廿四洲',
      building: '广济桥',
      dynasty: '宋-明',
      image: 'images/detailed_images/桥/广济桥.jpg',
      excerpt: '潮州韩江上的启闭式石桥，石梁与浮舟相济，「十八梭船廿四洲」被誉为中国四大古桥之一。',
      full: '',
      link: 'detail.html?name=广济桥'
    }
  ];

  // 建筑与文学
  const LITERATURE = [
    {
      title: '枫桥夜泊',
      author: '张继',
      dynasty: '唐',
      text: '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。',
      building: '枫桥',
      note: '枫桥因这首诗闻名天下，与寒山寺、铁铃关共同构成苏州城西的文化景观。',
      link: 'detail.html?name=枫桥'
    },
    {
      title: '滕王阁序（节选）',
      author: '王勃',
      dynasty: '唐',
      text: '层台耸翠，上出重霄；飞阁流丹，下临无地。鹤汀凫渚，穷岛屿之萦回；桂殿兰宫，即冈峦之体势。',
      building: '滕王阁',
      note: '王勃笔下"飞阁流丹"描绘了古代楼阁建筑的飞檐与丹漆之美。',
      link: 'timeline.html'
    },
    {
      title: '阿房宫赋（节选）',
      author: '杜牧',
      dynasty: '唐',
      text: '五步一楼，十步一阁；廊腰缦回，檐牙高啄；各抱地势，钩心斗角。',
      building: '阿房宫',
      note: '"钩心斗角"原指建筑结构的交错精巧，后成为成语。',
      link: 'topics.html'
    },
    {
      title: '黄鹤楼',
      author: '崔颢',
      dynasty: '唐',
      text: '昔人已乘黄鹤去，此地空余黄鹤楼。黄鹤一去不复返，白云千载空悠悠。',
      building: '黄鹤楼',
      note: '黄鹤楼与滕王阁、岳阳楼并称江南三大名楼，历代屡毁屡建。',
      link: 'timeline.html'
    },
    {
      title: '登鹳雀楼',
      author: '王之涣',
      dynasty: '唐',
      text: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
      building: '鹳雀楼',
      note: '鹳雀楼位于山西永济，因王之涣此诗名扬天下，"更上一层楼"成为千古名句。',
      link: 'timeline.html'
    },
    {
      title: '登岳阳楼',
      author: '杜甫',
      dynasty: '唐',
      text: '昔闻洞庭水，今上岳阳楼。吴楚东南坼，乾坤日夜浮。',
      building: '岳阳楼',
      note: '岳阳楼与黄鹤楼、滕王阁并称江南三大名楼，杜甫此诗气象雄浑。',
      link: 'timeline.html'
    }
  ];

  // 建筑知识小测
  const QUIZ_QUESTIONS = [
    { q: '赵州桥的敞肩拱设计比欧洲早约多少年？', options: ['约600年', '约800年', '约1200年', '约1500年'], answer: 2, explain: '赵州桥由隋代匠师李春设计，敞肩拱技术比欧洲早约1200年，是世界桥梁史上的里程碑。' },
    { q: '洛阳桥建造时首创的"种蛎固基"利用了哪种生物？', options: ['海藻', '牡蛎', '珊瑚', '贝类'], answer: 1, explain: '种蛎固基是在桥墩上养殖牡蛎，利用其分泌物加固石缝，是人类利用生物工程加固建筑的早期范例。' },
    { q: '宏村的水系布局呈什么形状？', options: ['龙形', '牛形', '龟形', '凤形'], answer: 1, explain: '宏村按牛形规划：南湖、月沼为牛胃牛心，水渠为牛肠，体现"天人合一"的营造智慧。' },
    { q: '"如翚斯飞"出自《诗经》，形容的是建筑的哪个部分？', options: ['斗拱', '飞檐', '藻井', '马头墙'], answer: 1, explain: '《诗经·小雅·斯干》"如翚斯飞"形容屋檐如鸟翼舒展，飞檐之名由此而来。' },
    { q: '《清明上河图》中汴京虹桥采用的结构技术是？', options: ['石拱', '编木拱', '铁索', '石梁'], answer: 1, explain: '虹桥以短木编织而成，是编木拱技术的杰作，无钉无铆，跨径约20米。' },
    { q: '故宫太和殿的藻井装饰有哪种神兽？', options: ['凤凰', '麒麟', '金龙', '玄武'], answer: 2, explain: '太和殿藻井金龙衔珠，为皇家最高等级，体现"真龙天子"的象征。' }
  ];

  function getSolarTerm() {
    const now = new Date();
    const m = now.getMonth() + 1, d = now.getDate();
    for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
      const t = SOLAR_TERMS[i];
      if (m > t.m || (m === t.m && d >= t.d)) return t.name;
    }
    return '冬至';
  }

  function getDateLabel() {
    const now = new Date();
    const m = now.getMonth() + 1, d = now.getDate();
    const dateStr = m + '月' + d + '日';
    return dateStr + ' · ' + getSolarTerm();
  }

  function getTodayBuilding() {
    const list = typeof MAP_SCATTER_DATA !== 'undefined' ? MAP_SCATTER_DATA : [];
    const featured = FEATURED_FOR_TODAY.filter(n => list.some(b => b.name === n));
    const pool = featured.length ? featured : list.map(b => b.name);
    const day = Math.floor(Date.now() / 86400000);
    const idx = day % pool.length;
    const name = pool[idx];
    return list.find(b => b.name === name) || list[0];
  }

  function getRandomBuilding() {
    const list = typeof MAP_SCATTER_DATA !== 'undefined' ? MAP_SCATTER_DATA : [];
    const featured = FEATURED_FOR_TODAY.filter(n => list.some(b => b.name === n));
    const pool = featured.length ? featured : list.map(b => b.name);
    const idx = Math.floor(Math.random() * pool.length);
    const name = pool[idx];
    return list.find(b => b.name === name) || list[0];
  }

  const TYPE_COLORS_MINI = { minju: '#4a9c82', guanfu: '#c41e3a', huangong: '#d4a84b', qiaoliang: '#5b8fc4' };
  let todayMiniMapChart = null;
  let chinaGeoPromise = null;
  let chinaMapLoadFailed = false;
  let miniMapResizeHooked = false;

  function getTypeColorMini(type) {
    if (typeof TYPE_COLORS !== 'undefined' && TYPE_COLORS[type]) return TYPE_COLORS[type];
    return TYPE_COLORS_MINI[type] || '#d4a84b';
  }

  function lngLatToSvgPercent(lng, lat) {
    const minLng = 73.5;
    const maxLng = 134.5;
    const minLat = 18.0;
    const maxLat = 53.8;
    const x = Math.max(3, Math.min(97, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(3, Math.min(97, ((maxLat - lat) / (maxLat - minLat)) * 100));
    return { x, y };
  }

  function ensureChinaGeoMap() {
    if (typeof echarts === 'undefined') return Promise.reject(new Error('no echarts'));
    if (echarts.getMap && echarts.getMap('china')) return Promise.resolve();
    if (!chinaGeoPromise) {
      chinaGeoPromise = fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        .then(r => r.json())
        .then(geoJson => {
          echarts.registerMap('china', geoJson);
        });
    }
    return chinaGeoPromise;
  }

  function renderTodayMiniMapFallback(el, d) {
    const lng = d.coords[0];
    const lat = d.coords[1];
    const { x, y } = lngLatToSvgPercent(lng, lat);
    const c = getTypeColorMini(d.type);
    el.innerHTML = `
      <svg class="today-mini-map-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="tmgSea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(30,50,60,0.35)"/>
            <stop offset="100%" style="stop-color:rgba(20,35,45,0.5)"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#tmgSea)"/>
        <rect x="8" y="14" width="84" height="72" rx="2" fill="none" stroke="rgba(212,168,75,0.35)" stroke-width="0.5" stroke-dasharray="2 2"/>
        <text x="50" y="8" text-anchor="middle" fill="rgba(245,240,230,0.4)" font-size="4.5">中国大陆范围示意图 · 经纬度近似</text>
        <circle cx="${x}" cy="${y}" r="3.8" fill="${c}" stroke="rgba(255,255,255,0.9)" stroke-width="1"/>
      </svg>`;
  }

  function updateTodayMiniMap(d) {
    const el = document.getElementById('todayMiniMap');
    const caption = document.getElementById('todayMapCaption');
    const dashLink = document.getElementById('todayMapDashboardLink');
    if (!el) return;

    if (!d || !d.coords || d.coords.length < 2) {
      if (todayMiniMapChart) {
        todayMiniMapChart.dispose();
        todayMiniMapChart = null;
      }
      el.innerHTML = '';
      if (caption) caption.textContent = '';
      if (dashLink) dashLink.href = 'dashboard.html';
      return;
    }

    const lng = d.coords[0];
    const lat = d.coords[1];
    const color = getTypeColorMini(d.type);

    if (caption) {
      caption.textContent = (d.province || '') + ' · 约 ' + lng.toFixed(2) + '°E，' + lat.toFixed(2) + '°N';
    }
    if (dashLink) {
      dashLink.href = d.province
        ? 'dashboard.html?province=' + encodeURIComponent(d.province)
        : 'dashboard.html';
    }

    if (chinaMapLoadFailed || typeof echarts === 'undefined') {
      if (todayMiniMapChart) {
        todayMiniMapChart.dispose();
        todayMiniMapChart = null;
      }
      renderTodayMiniMapFallback(el, d);
      return;
    }

    if (todayMiniMapChart) {
      todayMiniMapChart.dispose();
      todayMiniMapChart = null;
    }
    el.innerHTML = '';
    todayMiniMapChart = echarts.init(el);

    if (!miniMapResizeHooked) {
      miniMapResizeHooked = true;
      window.addEventListener('resize', () => {
        if (todayMiniMapChart) todayMiniMapChart.resize();
      });
    }

    function applyMiniOption() {
      todayMiniMapChart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.data && p.data.name ? '<b>' + p.data.name + '</b>' : '';
          }
        },
        geo: {
          map: 'china',
          roam: false,
          zoom: 1.05,
          layoutCenter: ['50%', '52%'],
          layoutSize: '98%',
          itemStyle: {
            areaColor: 'rgba(45, 90, 74, 0.22)',
            borderColor: 'rgba(212, 168, 75, 0.45)',
            borderWidth: 0.8
          },
          emphasis: { disabled: true }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [{
            name: d.name,
            value: [lng, lat],
            itemStyle: { color: color, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.35)' }
          }],
          symbolSize: 16,
          label: { show: false }
        }]
      }, true);
      todayMiniMapChart.resize();
    }

    ensureChinaGeoMap()
      .then(() => {
        applyMiniOption();
      })
      .catch(() => {
        chinaMapLoadFailed = true;
        if (todayMiniMapChart) {
          todayMiniMapChart.dispose();
          todayMiniMapChart = null;
        }
        renderTodayMiniMapFallback(el, d);
      });
  }

  let todayActiveLayer = 'a';

  function renderTodayBuilding(d, isTransition) {
    if (!d) return;
    const wrap = document.getElementById('todayHeroWrap');
    const link = document.getElementById('todayBuildingLink');
    const bgA = document.getElementById('todayBuildingImageA');
    const bgB = document.getElementById('todayBuildingImageB');
    const dateLabel = document.getElementById('todayDateLabel');
    const nameEl = document.getElementById('todayBuildingName');
    const metaEl = document.getElementById('todayBuildingMeta');
    const descEl = document.getElementById('todayBuildingDesc');
    const solarBadge = document.getElementById('todaySolarBadge');
    const refreshBtn = document.getElementById('todayRefresh');

    const term = getSolarTerm();
    if (wrap) {
      wrap.setAttribute('data-term', term);
      if (isTransition) wrap.classList.add('today-switching');
    }
    if (solarBadge) solarBadge.textContent = term;
    if (link) link.href = 'detail.html?name=' + encodeURIComponent(d.name);
    if (dateLabel) dateLabel.textContent = getDateLabel();
    if (nameEl) nameEl.textContent = d.name;
    if (metaEl) metaEl.textContent = (TYPE_NAMES[d.type] || '') + ' · ' + (d.location || '');
    if (descEl) descEl.textContent = d.feature || (typeof BUILDING_DESCRIPTIONS !== 'undefined' && BUILDING_DESCRIPTIONS[d.name] ? BUILDING_DESCRIPTIONS[d.name].slice(0, 80) + '…' : '点击查看详情');

    const src = FEATURED_IMAGES[d.name] || d.imageUrl || '';

    function applyToLayer(el) {
      if (!el) return;
      if (src) {
        el.style.backgroundImage = "url('" + src + "')";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      } else {
        el.style.background = 'rgba(45,90,74,0.4)';
        el.style.backgroundImage = 'none';
      }
    }

    if (isTransition && refreshBtn) {
      refreshBtn.classList.add('loading');
      refreshBtn.disabled = true;
    }

    if (isTransition && bgA && bgB) {
      const nextLayer = todayActiveLayer === 'a' ? 'b' : 'a';
      const nextEl = nextLayer === 'a' ? bgA : bgB;
      const currEl = nextLayer === 'a' ? bgB : bgA;
      applyToLayer(nextEl);
      nextEl.classList.add('active');
      currEl.classList.remove('active');
      todayActiveLayer = nextLayer;
      setTimeout(function () {
        if (wrap) wrap.classList.remove('today-switching');
        if (refreshBtn) {
          refreshBtn.classList.remove('loading');
          refreshBtn.disabled = false;
        }
      }, 520);
    } else {
      if (bgA) {
        applyToLayer(bgA);
        bgA.classList.add('active');
      }
      if (bgB) bgB.classList.remove('active');
      todayActiveLayer = 'a';
    }

    const items = document.querySelectorAll('.today-hero-item');
    items.forEach(function (el) {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    updateTodayMiniMap(d);
  }

  function initTodayBuilding() {
    renderTodayBuilding(getTodayBuilding(), false);
    const refreshBtn = document.getElementById('todayRefresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (refreshBtn.classList.contains('loading')) return;
        renderTodayBuilding(getRandomBuilding(), true);
      });
    }
  }

  function initTabs() {
    const tabs = document.querySelectorAll('.story-tab');
    const panels = document.querySelectorAll('.story-tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const target = this.dataset.tab;
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        panels.forEach(p => {
          const isActive = p.id === 'panel-' + target;
          p.classList.toggle('active', isActive);
          p.hidden = !isActive;
        });
      });
    });
  }

  function renderStories() {
    const el = document.getElementById('storyCards');
    if (!el) return;
    const total = STORIES.length;
    el.innerHTML = `
      <div class="book-wrap">
        <div class="book-flipbook" id="bookFlipbook">
          <div class="book-page-left" id="bookPageLeft">
            <div class="book-left-content book-left-with-toc">
              <div class="book-left-top">
                <div class="book-left-seal">华夏营造</div>
                <div class="book-left-title">营造故事</div>
                <div class="book-left-sub">匠人 · 建筑 · 智慧</div>
              </div>
              <div class="book-left-toc">
                <p class="book-toc-tagline">精选篇目，持续增补</p>
                <ul class="book-toc-list">
                  ${STORIES.map((s, i) => `
                    <li>
                      <button type="button" class="book-toc-item" data-page="${i + 1}">
                        <span class="book-toc-idx">${i + 1}</span>
                        <span class="book-toc-title">${s.title}</span>
                      </button>
                    </li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          ${STORIES.map((s, i) => `
            <div class="book-page" id="bookPage${i + 1}" data-page="${i + 1}">
              <div class="book-page-inner">
                <div class="book-page-front">
                  <div class="book-page-header">
                    <span class="book-page-dynasty">${s.dynasty || ''}</span>
                    <div class="book-page-meta">
                      <span class="book-page-num">${s.building} · 第 ${i + 1} 篇 / 共 ${total} 篇</span>
                      <span class="book-page-hint">精选篇目，持续增补</span>
                    </div>
                  </div>
                  <h3 class="book-page-title">${s.title}</h3>
                  <div class="book-page-img" style="background-image:url('${s.image || ''}')"></div>
                  <p class="book-page-excerpt">${s.excerpt}</p>
                  <a href="${s.link}" class="book-page-link">了解 ${s.building} →</a>
                  ${i < total - 1 ? '<button type="button" class="book-page-next">下一篇</button>' : '<button type="button" class="book-page-next" data-action="restart">卷终 · 从头翻阅</button>'}
                </div>
                <div class="book-page-back">
                  <div class="book-page-back-pattern"></div>
                  <span class="book-page-back-num">${i + 2 <= total ? i + 2 : '卷终'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="book-controls">
          <button type="button" class="book-btn book-btn-prev" id="bookPrev">
            <span class="book-btn-line">上一篇</span>
            <span class="book-btn-ref" id="bookPrevRef"></span>
          </button>
          <span class="book-indicator" id="bookIndicator"></span>
          <button type="button" class="book-btn book-btn-next" id="bookNext">
            <span class="book-btn-line">下一篇</span>
            <span class="book-btn-ref" id="bookNextRef"></span>
          </button>
        </div>
      </div>
    `;
    initBookFlip();
  }

  function initBookFlip() {
    const flipbook = document.getElementById('bookFlipbook');
    const prevBtn = document.getElementById('bookPrev');
    const nextBtn = document.getElementById('bookNext');
    const indicator = document.getElementById('bookIndicator');
    if (!flipbook || !prevBtn || !nextBtn) return;

    let currentPage = 1;
    const total = STORIES.length;

    function updateBookChrome() {
      const story = STORIES[currentPage - 1];
      if (indicator) {
        indicator.textContent = story.building + ' · 第 ' + currentPage + ' 篇 / 共 ' + total + ' 篇';
      }
      const pref = document.getElementById('bookPrevRef');
      const nref = document.getElementById('bookNextRef');
      if (pref) {
        pref.textContent = currentPage > 1 ? '《' + STORIES[currentPage - 2].title + '》' : '';
      }
      if (nref) {
        nref.textContent = currentPage < total ? '《' + STORIES[currentPage].title + '》' : '';
      }
    }

    function goToPage(page) {
      page = Math.max(1, Math.min(total, page));
      currentPage = page;
      flipbook.querySelectorAll('.book-page').forEach((p, i) => {
        const pageNum = i + 1;
        p.classList.toggle('flipped', pageNum < page);
        if (pageNum < page) p.style.zIndex = pageNum;
        else if (pageNum === page) p.style.zIndex = 100;
        else p.style.zIndex = 50 + (total - pageNum);
      });
      updateBookChrome();
      flipbook.querySelectorAll('.book-toc-item').forEach(function (b, i) {
        b.classList.toggle('book-toc-item--active', i + 1 === currentPage);
      });
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= total;
    }

    flipbook.querySelectorAll('.book-toc-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goToPage(parseInt(btn.getAttribute('data-page'), 10));
      });
    });

    flipbook.addEventListener('click', function (e) {
      const nextBtnEl = e.target.closest('.book-page-next');
      if (nextBtnEl) {
        e.preventDefault();
        if (nextBtnEl.dataset.action === 'restart') goToPage(1);
        else goToPage(currentPage + 1);
      }
    });
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    goToPage(1);
  }

  // 建筑与文学：散落位置（百分比，避免重叠）
  const LIT_POSITIONS = [
    { left: '5%', top: '10%', rot: 5 },
    { left: '38%', top: '6%', rot: -4 },
    { left: '72%', top: '12%', rot: -2 },
    { left: '8%', top: '48%', rot: 6 },
    { left: '42%', top: '52%', rot: -3 },
    { left: '78%', top: '50%', rot: 4 }
  ];

  function renderLiterature() {
    const el = document.getElementById('literatureCards');
    if (!el) return;
    el.innerHTML = `
      <div class="lit-float-wrap" id="litFloatWrap">
        ${LITERATURE.map((l, i) => {
          const pos = LIT_POSITIONS[i] || LIT_POSITIONS[0];
          return `
          <div class="lit-card" data-idx="${i}" style="left:${pos.left};top:${pos.top};transform:rotate(${pos.rot}deg);">
            <div class="lit-card-inner">
              <div class="lit-card-back">
                <span class="lit-back-title">${l.title}</span>
                <span class="lit-back-meta">${l.author} · ${l.dynasty}</span>
              </div>
              <div class="lit-card-front">
                <div class="lit-front-header">
                  <span class="lit-front-title">${l.title}</span>
                  <span class="lit-front-meta">${l.author} · ${l.dynasty}</span>
                </div>
                <div class="lit-front-text" data-text="${l.text.replace(/"/g, '&quot;')}"></div>
                <p class="lit-front-note">${l.note}</p>
                <a href="${l.link}" class="lit-front-link">${l.building} →</a>
                <button type="button" class="lit-close-btn" aria-label="关闭">×</button>
              </div>
            </div>
          </div>
        `;
        }).join('')}
      </div>
      <div class="lit-overlay" id="litOverlay"></div>
    `;
    initLiteratureFloating();
  }

  function initLiteratureFloating() {
    const wrap = document.getElementById('litFloatWrap');
    const overlay = document.getElementById('litOverlay');
    if (!wrap || !overlay) return;

    const cards = wrap.querySelectorAll('.lit-card');
    let activeCard = null;
    let isClosing = false;

    function revealInkText(container, text) {
      container.innerHTML = '';
      const chars = text.split('');
      const baseDelay = Math.min(100, Math.max(55, 2800 / chars.length));
      chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'lit-ink-char';
        span.textContent = ch;
        span.style.animationDelay = (i * baseDelay) + 'ms';
        container.appendChild(span);
      });
    }

    function openCard(card) {
      if (activeCard) return;
      activeCard = card;
      const idx = parseInt(card.dataset.idx, 10);
      const lit = LITERATURE[idx];

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--lit-start-x', rect.left + 'px');
      card.style.setProperty('--lit-start-y', rect.top + 'px');

      overlay.classList.add('active');
      card.classList.add('lit-card-active');

      const textEl = card.querySelector('.lit-front-text');
      if (textEl && lit) {
        setTimeout(() => {
          revealInkText(textEl, lit.text);
        }, 950);
      }
    }

    function closeCard() {
      if (!activeCard || isClosing) return;
      isClosing = true;
      const card = activeCard;
      card.classList.add('lit-card-closing');
      overlay.classList.remove('active');

      const inner = card.querySelector('.lit-card-inner');
      const onFlipDone = () => {
        inner.removeEventListener('transitionend', onFlipDone);
        card.classList.add('lit-card-closing-out');
        card.classList.remove('lit-card-closing');
        setTimeout(() => {
          card.classList.add('lit-card-closed');
          card.classList.remove('lit-card-active', 'lit-card-closing-out');
          activeCard = null;
          isClosing = false;
          setTimeout(() => card.classList.remove('lit-card-closed'), 120);
        }, 360);
      };
      inner.addEventListener('transitionend', onFlipDone);
    }

    cards.forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.lit-close-btn') || e.target.closest('.lit-front-link')) return;
        if (card.classList.contains('lit-card-active')) return;
        openCard(card);
      });
      card.querySelector('.lit-close-btn')?.addEventListener('click', function (e) {
        e.stopPropagation();
        closeCard();
      });
    });
    overlay.addEventListener('click', closeCard);
  }

  let quizIndex = 0;
  let quizScore = 0;

  function updateQuizSteps(filledCount, isComplete) {
    const stepsEl = document.getElementById('quizProgressSteps');
    if (!stepsEl) return;
    const total = QUIZ_QUESTIONS.length;
    if (stepsEl.children.length !== total) {
      stepsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const step = document.createElement('div');
        step.className = 'quiz-step';
        step.setAttribute('aria-label', '第' + (i + 1) + '题');
        stepsEl.appendChild(step);
      }
    }
    stepsEl.querySelectorAll('.quiz-step').forEach((el, i) => {
      el.classList.remove('filled', 'current');
      if (i < filledCount) el.classList.add('filled');
      else if (i === filledCount && !isComplete) el.classList.add('current');
    });
  }

  function showQuizQuestion() {
    const q = QUIZ_QUESTIONS[quizIndex];
    if (!q) return;
    const progressEl = document.getElementById('quizProgress');
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const explanationEl = document.getElementById('quizExplanation');
    const resultEl = document.getElementById('quizResult');
    const nextBtn = document.getElementById('quizNext');
    const restartBtn = document.getElementById('quizRestart');

    updateQuizSteps(quizIndex, false);
    if (progressEl) progressEl.textContent = (quizIndex + 1) + ' / ' + QUIZ_QUESTIONS.length;
    if (questionEl) questionEl.textContent = q.q;
    if (resultEl) resultEl.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'none';
    if (nextBtn) { nextBtn.style.display = 'none'; nextBtn.classList.remove('quiz-btn-enter'); }
    if (explanationEl) { explanationEl.classList.remove('visible'); explanationEl.innerHTML = ''; }

    if (optionsEl) {
      optionsEl.style.display = '';
      optionsEl.innerHTML = q.options.map((opt, i) =>
        '<button type="button" class="quiz-option" data-idx="' + i + '">' + opt + '</button>'
      ).join('');
      optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = parseInt(this.dataset.idx, 10);
          optionsEl.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });
          if (idx === q.answer) {
            quizScore++;
            this.classList.add('correct');
          } else {
            this.classList.add('wrong');
            optionsEl.querySelectorAll('.quiz-option')[q.answer].classList.add('correct');
            if (explanationEl && q.explain) {
              explanationEl.innerHTML = '<strong>解析：</strong>' + q.explain;
              explanationEl.style.display = 'block';
              explanationEl.classList.add('visible');
            }
          }
          if (nextBtn) {
            nextBtn.style.display = 'inline-block';
            nextBtn.classList.add('quiz-btn-enter');
          }
        });
      });
    }
  }

  function showQuizResult() {
    const total = QUIZ_QUESTIONS.length;
    const pct = Math.round((quizScore / total) * 100);
    let msg = '', level = '', levelClass = '';
    if (pct >= 90) { msg = '博古通今！您对中国古代建筑了如指掌。'; level = '博古通今'; levelClass = 'quiz-result-excellent'; }
    else if (pct >= 70) { msg = '学识渊博！继续探索更多营造智慧。'; level = '学识渊博'; levelClass = 'quiz-result-good'; }
    else if (pct >= 50) { msg = '不错！还有提升空间，多看看详情页吧。'; level = '再接再厉'; levelClass = 'quiz-result-fair'; }
    else { msg = '再接再厉！前往建筑工艺、朝代时间轴了解更多。'; level = '初窥门径'; levelClass = 'quiz-result-improve'; }

    updateQuizSteps(total, true);
    const resultEl = document.getElementById('quizResult');
    const optionsEl = document.getElementById('quizOptions');
    const explanationEl = document.getElementById('quizExplanation');
    const nextBtn = document.getElementById('quizNext');
    const restartBtn = document.getElementById('quizRestart');

    if (resultEl) {
      resultEl.className = 'quiz-result ' + levelClass;
      resultEl.innerHTML = '<div class="quiz-result-header"><span class="quiz-result-level">' + level + '</span><span class="quiz-score">' + quizScore + ' / ' + total + '（' + pct + '%）</span></div><p class="quiz-msg">' + msg + '</p>';
      resultEl.style.display = 'block';
    }
    if (optionsEl) optionsEl.style.display = 'none';
    if (explanationEl) { explanationEl.classList.remove('visible'); explanationEl.style.display = 'none'; explanationEl.innerHTML = ''; }
    if (nextBtn) nextBtn.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'inline-block';
  }

  function initQuiz() {
    const nextBtn = document.getElementById('quizNext');
    const restartBtn = document.getElementById('quizRestart');

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        quizIndex++;
        if (quizIndex >= QUIZ_QUESTIONS.length) {
          showQuizResult();
        } else {
          showQuizQuestion();
        }
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        quizIndex = 0;
        quizScore = 0;
        updateQuizSteps(0, false);
        document.getElementById('quizOptions').style.display = '';
        showQuizQuestion();
      });
    }
    showQuizQuestion();
  }

  function init() {
    initTabs();
    initTodayBuilding();
    renderStories();
    renderLiterature();
    initQuiz();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
