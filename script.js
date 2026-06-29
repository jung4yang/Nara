/* ===================== STATE ===================== */
const state = {
  step: 'home',
  characterFile: null,
  backgroundFile: null,
  gameTitle: 'Untitled',
  qIndex: 0,
  genre: null,
  panelIndex: 0,
  ratings: [null, null, null, null, null], // 'up' | 'down' | null
  playing: false,
};

const screens = {
  home: document.getElementById('screen-home'),
  upload: document.getElementById('screen-upload'),
  story: document.getElementById('screen-story'),
  genre: document.getElementById('screen-genre'),
  panel: document.getElementById('screen-panel'),
  final: document.getElementById('screen-final'),
};
const sendFab = document.getElementById('send-fab');
const logoHome = document.getElementById('logo-home');

function goTo(step){
  state.step = step;
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[step].classList.add('active');
  logoHome.classList.toggle('hidden', step === 'home');
  updateFab();
  if(step === 'story') renderStory();
  if(step === 'panel') renderPanel();
  if(step === 'final') renderFinal();
}

document.getElementById('start-btn').addEventListener('click', () => goTo('upload'));
logoHome.addEventListener('click', () => {
  if(state.step === 'home') return;
  const ok = confirm('처음으로 돌아가면 지금까지의 진행 내용이 초기화돼요. 계속할까요?');
  if(ok) location.reload();
});

function updateFab(){
  if(state.step === 'home'){
    sendFab.style.display = 'none';
  } else if(state.step === 'upload'){
    setFab(!!state.characterFile, () => goTo('story'));
  } else if(state.step === 'story'){
    setFab(state.qIndex >= QUESTIONS.length, () => goTo('genre'));
  } else if(state.step === 'genre'){
    setFab(!!state.genre, () => goTo('panel'));
  } else {
    sendFab.style.display = 'none';
  }
}
function setFab(ready, onClick){
  sendFab.style.display = 'flex';
  sendFab.classList.toggle('ready', ready);
  sendFab.onclick = ready ? onClick : null;
}

/* ===================== 1. UPLOAD ===================== */
function setupUploadBox(boxId, inputId, key){
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  box.addEventListener('click', (e) => { /* label triggers input natively */ });
  input.addEventListener('change', () => {
    const file = input.files[0];
    if(!file) return;
    state[key] = file;
    box.classList.add('filled');
    box.innerHTML = `<span class="filename-tag">${escapeHtml(file.name)}</span>`;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.createElement('img');
      img.className = 'thumb';
      img.src = ev.target.result;
      box.appendChild(img);
    };
    reader.readAsDataURL(file);

    if(key === 'characterFile'){
      const base = file.name.replace(/\.[^/.]+$/, '').replace(/character/ig, '').trim();
      state.gameTitle = base || 'Untitled';
    }
    updateFab();
  });
}
setupUploadBox('box-character', 'input-character', 'characterFile');
setupUploadBox('box-background', 'input-background', 'backgroundFile');

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ===================== 2. STORYBUILDER ===================== */
const QUESTIONS = [
  {
    eyebrow: 'Q1',
    text: '게임 제목이 뭔가요?',
    type: 'title',
  },
  {
    eyebrow: 'Q2',
    text: '어떤 콘텐츠가 필요하세요?',
    options: ['시네마틱 트레일러 (16:9 / 1분 이내)', '숏폼 마케팅 (9:16 / SNS용)', '숏드라마 연재 (세계관 기반)', '전부 다'],
    defaultPick: 2,
  },
  {
    eyebrow: 'Q3',
    text: '주인공이 산을 오르는 진짜 이유는?',
    options: ['도망치고 싶어서 — 현실의 무언가로부터', '증명하고 싶어서 — 자기 자신에게', '잃어버린 것을 찾으려 — 과거의 무언가', '직접 입력할게요'],
    defaultPick: 1,
  },
  {
    eyebrow: 'Q4',
    text: '주인공이 자기 자신에게 증명하고 싶은 게 뭔가요?',
    options: ['두려움을 이겨낼 수 있다는 것', '포기하지 않을 수 있다는 것', '혼자서도 해낼 수 있다는 것', '살아갈 자격이 있다는 것', '직접 입력할게요'],
    defaultPick: 2,
  },
  {
    eyebrow: 'Q5',
    text: '내면의 그림자가 주인공에게 하는 말은?',
    options: ['"넌 원래 이런 사람이야, 포기해."', '"혼자서 실패하는 거야. 네 잘못이 아니야."', '"올라가도 아무것도 안 바뀌어, 산이 문제가 아니잖아."', '"넌 도움을 받아야만 해, 그게 네 한계야."', '직접 입력할게요'],
    defaultPick: 2,
  },
  {
    eyebrow: 'Q6',
    text: '주인공이 만나는 결정적인 순간은?',
    options: ['정상 직전에 포기하려는 순간', '그림자와 처음으로 대화하는 순간', '다른 누군가를 도우면서 자신을 발견하는 순간', '과거의 기억이 떠오르며 무너지는 순간', '직접 입력할게요'],
    defaultPick: 0,
  },
  {
    eyebrow: 'Q7',
    text: '이야기가 끝날 때 주인공은?',
    options: ['정상에 오른다 — 하지만 예상과 다른 감정을 느낀다', '포기하고 내려온다 — 하지만 그게 진짜 답이었다', '정상 직전에 멈춘다 — 열린 결말', '그림자와 화해한다 — 정상보다 중요한 것을 깨닫는다', '직접 입력할게요'],
    defaultPick: 0,
  },
];
const answers = new Array(QUESTIONS.length).fill(null);

function renderStory(){
  const card = document.getElementById('story-card');
  card.innerHTML = '';
  for(let i = 0; i <= state.qIndex && i < QUESTIONS.length; i++){
    card.appendChild(buildQABlock(i));
  }
  card.scrollTop = card.scrollHeight;
}

function buildQABlock(i){
  const q = QUESTIONS[i];
  const answered = answers[i] !== null;
  const block = document.createElement('div');
  block.className = 'qa-block' + (answered ? ' answered' : '');

  const eyebrow = document.createElement('div');
  eyebrow.className = 'qa-eyebrow';
  eyebrow.textContent = q.eyebrow;
  block.appendChild(eyebrow);

  const question = document.createElement('div');
  question.className = 'qa-question';
  question.textContent = q.text;
  block.appendChild(question);

  if(q.type === 'title'){
    const input = document.createElement('input');
    input.className = 'qa-title-input';
    input.value = answered ? answers[i] : state.gameTitle;
    input.placeholder = '게임 제목을 입력하세요';
    if(answered) input.disabled = true;
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && !answered){ commitTitle(i, input.value); }
    });
    input.addEventListener('blur', () => {
      if(!answered && input.value.trim()) commitTitle(i, input.value);
    });
    block.appendChild(input);
    setTimeout(() => input.focus(), 50);
    return block;
  }

  const optWrap = document.createElement('div');
  optWrap.className = 'qa-options';

  q.options.forEach((opt, idx) => {
    const isCustom = opt === '직접 입력할게요';
    const isSelected = answered && answers[i].text === opt;
    if(answered && !isSelected) return; // collapse unselected once answered

    const row = document.createElement('div');
    row.className = 'qa-option' + (isSelected ? ' selected' : '') + (answered ? ' locked' : '');
    const dot = document.createElement('span');
    dot.className = 'dot';
    const label = document.createElement('span');
    label.textContent = (answered && isSelected && answers[i].custom) ? answers[i].custom : opt;
    row.appendChild(dot);
    row.appendChild(label);

    if(!answered){
      row.addEventListener('click', () => {
        if(isCustom){
          showCustomInput(block, i, opt);
        } else {
          selectOption(i, opt, null);
        }
      });
    }
    optWrap.appendChild(row);
  });

  block.appendChild(optWrap);
  return block;
}

function showCustomInput(block, i, optLabel){
  const existing = block.querySelector('.qa-custom-input');
  if(existing) return;
  const wrap = document.createElement('div');
  wrap.className = 'qa-custom-input';
  const input = document.createElement('input');
  input.placeholder = '직접 입력...';
  const btn = document.createElement('button');
  btn.textContent = '확인';
  btn.addEventListener('click', () => {
    if(input.value.trim()) selectOption(i, optLabel, input.value.trim());
  });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && input.value.trim()) selectOption(i, optLabel, input.value.trim());
  });
  wrap.appendChild(input);
  wrap.appendChild(btn);
  block.appendChild(wrap);
  setTimeout(() => input.focus(), 30);
}

function commitTitle(i, value){
  answers[i] = { text: value };
  state.gameTitle = value;
  advanceQuestion();
}
function selectOption(i, text, custom){
  answers[i] = { text, custom };
  advanceQuestion();
}
function advanceQuestion(){
  renderStory();
  setTimeout(() => {
    state.qIndex = Math.min(state.qIndex + 1, QUESTIONS.length);
    renderStory();
    updateFab();
  }, 260);
}

/* ===================== 3. GENRE ===================== */
document.querySelectorAll('.genre-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.genre-card').forEach(c => c.classList.remove('picked'));
    card.classList.add('picked');
    state.genre = card.dataset.genre;
    updateFab();
    setTimeout(() => goTo('panel'), 350);
  });
});

/* ===================== 4. PANEL REVIEW ===================== */
const PANELS = [
  { caption: '주인공이 산 앞에 선다.', kind: 'wide' },
  { caption: '각오를 다지며 배낭을 멘다.', kind: 'figure' },
  { caption: '그녀의 눈동자에 산 정상이 비친다.', kind: 'eye' },
  { caption: '한 걸음씩, 산을 오르기 시작한다.', kind: 'climb' },
  { caption: '물 위로 누군가의 그림자가 비친다 — "넌 왜 올라가려고 해?"', kind: 'shadow' },
];

function svgFor(kind){
  const sky = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3a2f63"/>
        <stop offset="55%" stop-color="#6c5a9c"/>
        <stop offset="100%" stop-color="#a98fc0"/>
      </linearGradient>
      <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5b4f7d"/>
        <stop offset="100%" stop-color="#2c2540"/>
      </linearGradient>
    </defs>`;
  const stars = Array.from({length:14}).map(() =>
    `<circle cx="${Math.random()*180}" cy="${Math.random()*120}" r="${(Math.random()*1+0.4).toFixed(1)}" fill="#fff" opacity="${(Math.random()*0.6+0.3).toFixed(2)}"/>`
  ).join('');
  const crystals = (n, areaY) => Array.from({length:n}).map(() => {
    const x = 20 + Math.random()*140, y = areaY + Math.random()*60;
    return `<polygon points="${x},${y-6} ${x+3},${y} ${x},${y+6} ${x-3},${y}" fill="${Math.random()>0.5?'#caa6e8':'#f0a8c8'}" opacity="0.85"/>`;
  }).join('');

  if(kind === 'wide'){
    return `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">
      ${sky}<rect width="180" height="320" fill="url(#sky)"/>${stars}
      <polygon points="90,40 140,200 40,200" fill="url(#mtn)"/>
      <polygon points="90,40 115,140 65,140" fill="#7868a0" opacity="0.5"/>
      ${crystals(8, 90)}
      <rect x="0" y="195" width="180" height="125" fill="#1c1830"/>
      <circle cx="90" cy="285" r="5" fill="#e8845c"/>
      <rect x="86" y="290" width="8" height="14" fill="#3a3a3a"/>
    </svg>`;
  }
  if(kind === 'figure'){
    return `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">
      ${sky}<rect width="180" height="320" fill="url(#sky)" opacity="0.5"/>
      <rect width="180" height="320" fill="#241f3a"/>
      <polygon points="90,60 150,300 30,300" fill="url(#mtn)" opacity="0.55"/>
      <ellipse cx="90" cy="210" rx="34" ry="92" fill="#181428"/>
      <circle cx="90" cy="150" r="20" fill="#e8b08a"/>
      <path d="M70 150 Q90 120 110 150" fill="none" stroke="#a85a3a" stroke-width="10" stroke-linecap="round"/>
      <rect x="68" y="172" width="44" height="70" rx="14" fill="#3a3a52"/>
      <rect x="58" y="190" width="14" height="40" rx="6" fill="#5d4a78"/>
      ${crystals(4, 50)}
    </svg>`;
  }
  if(kind === 'eye'){
    return `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="skin" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#f1c8a6"/><stop offset="100%" stop-color="#caa17c"/>
      </radialGradient></defs>
      <rect width="180" height="320" fill="url(#skin)"/>
      <ellipse cx="90" cy="170" rx="62" ry="34" fill="#2c2030"/>
      <ellipse cx="90" cy="170" rx="62" ry="34" fill="none" stroke="#3a2a3c" stroke-width="3"/>
      <circle cx="90" cy="170" r="26" fill="#5d4a86"/>
      <polygon points="90,156 100,182 80,182" fill="#2c2540"/>
      <circle cx="90" cy="170" r="11" fill="#15101c"/>
      <circle cx="83" cy="160" r="4" fill="#fff" opacity="0.8"/>
      <path d="M28 170 Q90 120 152 170" fill="none" stroke="#5a4030" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  }
  if(kind === 'climb'){
    return `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">
      ${sky}<rect width="180" height="320" fill="url(#sky)"/>
      <polygon points="90,10 170,300 10,300" fill="url(#mtn)"/>
      <polygon points="90,10 130,180 50,180" fill="#7868a0" opacity="0.45"/>
      ${crystals(10, 60)}
      ${crystals(6, 160)}
      <circle cx="92" cy="268" r="6" fill="#e8845c"/>
      <rect x="87" y="274" width="10" height="18" fill="#3a3a3a"/>
      <rect x="80" y="278" width="8" height="22" fill="#5d4a78"/>
    </svg>`;
  }
  // shadow / reflection
  return `<svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">
      ${sky}<rect width="180" height="160" fill="url(#sky)"/>
      <polygon points="90,30 140,160 40,160" fill="url(#mtn)"/>
      <g transform="translate(0,320) scale(1,-1)">
        <rect width="180" height="160" fill="#241f3a" opacity="0.9"/>
        <polygon points="90,30 140,160 40,160" fill="url(#mtn)" opacity="0.55"/>
      </g>
      <rect y="158" width="180" height="4" fill="#aef0e8" opacity="0.3"/>
      <path d="M0 200 q15 4 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#9fe7df" stroke-width="2" fill="none" opacity="0.3"/>
      <ellipse cx="90" cy="245" rx="22" ry="40" fill="#0d0a16"/>
      <circle cx="83" cy="228" r="3" fill="#e64d6b"/>
      <circle cx="97" cy="228" r="3" fill="#e64d6b"/>
    </svg>`;
}

function renderPanel(){
  const p = PANELS[state.panelIndex];
  document.getElementById('panel-img-wrap').innerHTML = svgFor(p.kind);
  document.getElementById('panel-caption').textContent = p.caption;

  const dotsEl = document.getElementById('panel-dots');
  dotsEl.innerHTML = PANELS.map((_, i) => {
    let cls = 'd';
    if(i === state.panelIndex) cls += ' active';
    else if(i < state.panelIndex) cls += ' done';
    return `<span class="${cls}"></span>`;
  }).join('');

  document.getElementById('panel-title').textContent =
    state.genre === 'trailer' ? 'Cinematic Trailer' : 'Short Form';

  const up = document.getElementById('btn-up');
  const down = document.getElementById('btn-down');
  up.classList.toggle('picked', state.ratings[state.panelIndex] === 'up');
  down.classList.toggle('picked', state.ratings[state.panelIndex] === 'down');
}

function rate(value){
  state.ratings[state.panelIndex] = value;
  renderPanel();
  setTimeout(() => {
    if(state.panelIndex < PANELS.length - 1){
      state.panelIndex++;
      renderPanel();
    } else {
      goTo('final');
    }
  }, 380);
}
document.getElementById('btn-up').addEventListener('click', () => rate('up'));
document.getElementById('btn-down').addEventListener('click', () => rate('down'));

/* ===================== 5. FINAL ===================== */
let playTimer = null;
function renderFinal(){
  const phone = document.getElementById('phone-screen');
  phone.innerHTML = PANELS.map((p, i) => {
    const wrapped = `<g>${svgFor(p.kind)}</g>`;
    return `<svg class="${i===0?'show':''}" data-idx="${i}" viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg">${svgInner(p.kind)}</svg>`;
  }).join('');

  const approvedCount = state.ratings.filter(r => r === 'up').length;
  const redoCount = state.ratings.filter(r => r === 'down').length;

  const strip = document.getElementById('final-strip');
  strip.innerHTML = PANELS.map((p, i) => {
    const r = state.ratings[i];
    const tag = r === 'down'
      ? '<span class="strip-tag redo">재생성 필요</span>'
      : '<span class="strip-tag ok">사용</span>';
    return `<div class="strip-item">
      <div class="strip-thumb">${svgFor(p.kind)}</div>
      <span>${i+1}. ${p.caption.length > 16 ? p.caption.slice(0,16)+'…' : p.caption}</span>
      ${tag}
    </div>`;
  }).join('');

  document.getElementById('final-hint').textContent = redoCount > 0
    ? `${redoCount}개 컷이 재생성 대기 중이에요. 나머지 ${approvedCount}개 컷으로 미리보기를 만들었어요.`
    : `${approvedCount}개 컷 모두 승인되었어요. 15초 숏폼이 준비됐어요.`;

  startSlideshow();
}
function svgInner(kind){
  // returns the inner markup of svgFor without the outer <svg> wrapper, reused as-is since svgFor already returns full svg;
  // simplification: just call svgFor and strip outer tags
  const full = svgFor(kind);
  return full.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}
function startSlideshow(){
  clearInterval(playTimer);
  let idx = 0;
  const nodes = () => document.querySelectorAll('#phone-screen svg');
  state.playing = true;
  document.getElementById('btn-play').textContent = '❙❙ 정지';
  playTimer = setInterval(() => {
    const list = nodes();
    list.forEach(n => n.classList.remove('show'));
    idx = (idx + 1) % list.length;
    list[idx].classList.add('show');
  }, 1400);
}
document.getElementById('btn-play').addEventListener('click', () => {
  if(state.playing){
    clearInterval(playTimer);
    state.playing = false;
    document.getElementById('btn-play').textContent = '▶ 재생';
  } else {
    startSlideshow();
  }
});
document.getElementById('btn-download').addEventListener('click', () => {
  alert('데모 프로토타입이라 실제 다운로드는 지원하지 않아요. 곧 연결할게요!');
});

/* ===================== INIT ===================== */
logoHome.classList.add('hidden');
updateFab();
