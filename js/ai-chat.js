/**
 * 营造助手 - 基于项目数据的中国古代建筑 AI 问答（模拟）
 */
(function () {
  const TYPE_NAMES = { minju: '民居', guanfu: '官府', huangong: '皇宫', qiaoliang: '桥梁' };

  function findBuilding(name) {
    if (typeof MAP_SCATTER_DATA === 'undefined') return null;
    const q = String(name).trim().replace(/[？?]/g, '');
    if (!q) return null;
    const exact = MAP_SCATTER_DATA.find(b => b.name === q);
    if (exact) return exact;
    const partial = MAP_SCATTER_DATA.find(b => b.name.includes(q) || q.includes(b.name));
    return partial || null;
  }

  function findBuildingsByKeyword(keyword) {
    if (typeof MAP_SCATTER_DATA === 'undefined') return [];
    const k = String(keyword).trim();
    return MAP_SCATTER_DATA.filter(b =>
      b.name.includes(k) ||
      (b.location && b.location.includes(k)) ||
      (b.subtype && b.subtype.includes(k)) ||
      (b.feature && b.feature.includes(k)) ||
      (b.craft && b.craft.includes(k))
    );
  }

  function findBuildingsByType(type) {
    if (typeof MAP_SCATTER_DATA === 'undefined') return [];
    const t = { '民居': 'minju', '官府': 'guanfu', '皇宫': 'huangong', '桥梁': 'qiaoliang' }[type] || type;
    return MAP_SCATTER_DATA.filter(b => b.type === t);
  }

  function findBuildingsByDynasty(dynasty) {
    if (typeof MAP_SCATTER_DATA === 'undefined') return [];
    return MAP_SCATTER_DATA.filter(b => b.era && b.era.includes(dynasty));
  }

  function getBuildingDesc(name) {
    if (typeof BUILDING_DESCRIPTIONS === 'undefined') return null;
    return BUILDING_DESCRIPTIONS[name] || null;
  }

  function generateReply(text) {
    const t = String(text).trim().replace(/[？?。！!]/g, '');
    if (!t) return '您好，请问有什么关于中国古代建筑的问题？';

    // 1. 建筑名称查询
    const building = findBuilding(t);
    if (building) {
      const desc = getBuildingDesc(building.name);
      let html = '<p><strong>' + building.name + '</strong>（' + TYPE_NAMES[building.type] + '）</p>';
      html += '<p>' + (desc || building.feature || building.craft || '暂无详细介绍') + '</p>';
      html += '<p>所在地：' + building.location + ' · 年代：' + building.era + '</p>';
      html += '<p>您可前往 <a href="detail.html?name=' + encodeURIComponent(building.name) + '">查看详情</a>。</p>';
      return html;
    }

    // 2. 工艺关键词查询
    if (typeof CRAFT_INFO !== 'undefined') {
      for (const key of Object.keys(CRAFT_INFO)) {
        if (key === t || key.includes(t) || t.includes(key)) {
          const craft = CRAFT_INFO[key];
          let html = '<p><strong>' + key + '</strong></p>';
          html += '<p>' + (craft.desc || '').slice(0, 450) + (craft.desc && craft.desc.length > 450 ? '…' : '') + '</p>';
          html += '<p>可前往 <a href="craft-detail.html?keyword=' + encodeURIComponent(key) + '">' + key + '详细介绍</a> 或 <a href="craft.html">建筑工艺</a> 页面。</p>';
          return html;
        }
      }
    }

    // 3. 类型查询：民居有哪些、桥梁有哪些
    const typeMatch = t.match(/(民居|官府|皇宫|桥梁)(有|包括|包含|有哪些|有哪些建筑)/);
    if (typeMatch) {
      const typeName = typeMatch[1];
      const list = findBuildingsByType(typeName);
      if (list.length === 0) return '暂无该类型建筑数据。';
      const names = list.slice(0, 12).map(b => b.name).join('、');
      const more = list.length > 12 ? ' 等' + list.length + '处' : '';
      return '<p><strong>' + typeName + '</strong> 在本项目中收录：' + names + more + '。</p><p>可前往 <a href="topics.html">四大专题</a> 查看树形结构。</p>';
    }

    // 4. 朝代查询
    const dynastyMatch = t.match(/(隋|唐|宋|金|元|明|清)(代|朝)?(有|包括|有哪些)/);
    if (dynastyMatch) {
      const dynasty = dynastyMatch[1];
      const list = findBuildingsByDynasty(dynasty);
      if (list.length === 0) return '暂无该朝代建筑数据。';
      const names = list.slice(0, 10).map(b => b.name).join('、');
      const more = list.length > 10 ? ' 等' + list.length + '处' : '';
      return '<p><strong>' + dynasty + '代</strong> 建筑包括：' + names + more + '。</p><p>可前往 <a href="timeline.html">朝代时间轴</a> 查看分布。</p>';
    }

    // 5. 关键词模糊匹配建筑
    const byKeyword = findBuildingsByKeyword(t);
    if (byKeyword.length > 0 && byKeyword.length <= 5) {
      const names = byKeyword.map(b => '<a href="detail.html?name=' + encodeURIComponent(b.name) + '">' + b.name + '</a>').join('、');
      return '<p>您可能想了解：' + names + '。</p>';
    }
    if (byKeyword.length > 5) {
      const names = byKeyword.slice(0, 5).map(b => b.name).join('、');
      return '<p>找到多处相关建筑，例如：' + names + ' 等。可尝试输入具体建筑名称，或前往 <a href="dashboard.html">数据大屏</a> 浏览。</p>';
    }

    // 6. 通用建筑问题
    if (/建筑|古建|营造|斗拱|榫卯|飞檐|马头墙|梁架|藻井|砖雕|木雕|石雕/.test(t)) {
      return '<p>您的问题涉及中国古代建筑的方方面面。我主要基于本项目收录的49处建筑与18种工艺作答。</p><p>建议您：</p><ul><li>输入具体建筑名称，如「北京故宫」「赵州桥」</li><li>输入工艺名称，如「斗拱」「榫卯」</li><li>前往 <a href="craft.html">建筑工艺</a> 查看技艺介绍</li></ul>';
    }

    // 7. 非建筑相关
    if (/今天|天气|你好|你好|谢谢|再见|你是谁/.test(t)) {
      return '<p>您好！我是营造助手，专注中国古代建筑（1911年以前）的问答。请问有什么建筑相关的问题？</p>';
    }

    // 8. 默认
    return '<p>抱歉，我暂时无法回答这个问题。我专注于本项目收录的中国古代建筑与工艺。</p><p>您可以试试：</p><ul><li>输入建筑名称，如「宏村」「卢沟桥」</li><li>输入工艺名称，如「斗拱」「榫卯」</li><li>问「民居有哪些」「清代有哪些建筑」</li></ul>';
  }

  function init() {
    const messagesEl = document.getElementById('chatMessages');
    const inputEl = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    if (!messagesEl || !inputEl || !sendBtn) return;

    function appendMessage(role, content, isHtml) {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg-' + role;
      const avatar = document.createElement('span');
      avatar.className = 'chat-avatar';
      avatar.textContent = role === 'user' ? '我' : '匠';
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      if (isHtml) bubble.innerHTML = content; else bubble.textContent = content;
      div.appendChild(avatar);
      div.appendChild(bubble);
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function appendTyping() {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg-bot';
      div.id = 'chatTyping';
      div.innerHTML = '<span class="chat-avatar">匠</span><div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      const el = document.getElementById('chatTyping');
      if (el) el.remove();
    }

    function send() {
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      appendMessage('user', text);
      sendBtn.disabled = true;
      appendTyping();

      setTimeout(function () {
        removeTyping();
        const reply = generateReply(text);
        appendMessage('bot', reply, true);
        sendBtn.disabled = false;
      }, 600 + Math.random() * 400);
    }

    sendBtn.addEventListener('click', send);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
