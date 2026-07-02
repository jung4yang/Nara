// ============================================================
// publisher.js — 퍼블리셔 피드 데이터 (껍데기 - 나중에 실제 데이터로 교체)
// ============================================================

// 게임 목록
const GAMES = [
  {
    id: 'game_001',
    title: 'Shadow of Aria',
    studio: 'DeepLight Studio',
    developerId: 'dev_001',
    description: '기억을 잃은 소녀가 멸망한 세계에서 진실을 찾아 떠나는 다크 판타지 RPG',
    genre: ['RPG', '다크판타지'],
    platform: ['PC', '모바일'],
    platformBadge: 'PC',
    progress: '개발 중',
    progressTone: 'yellow',
    teamSize: '4인',
    period: '18개월',
    engine: 'Unity',
    language: 'C#',
    supportNeeds: ['퍼블리셔', '투자'],
    colorClass: 'color-purple',
    thumbnail: '/game1.png',
    videos: ['메인 트레일러', '게임플레이 영상'],
  },
  {
    id: 'game_002',
    title: 'Skybound',
    studio: 'PixelForge',
    developerId: 'dev_002',
    description: '신비로운 세계에서 펼쳐지는 퍼즐 액션 어드벤처',
    genre: ['퍼즐', '탐험'],
    platform: ['모바일'],
    platformBadge: '모바일',
    progress: '얼리 액세스',
    progressTone: 'green',
    teamSize: '6인',
    period: '24개월',
    engine: 'Unreal',
    language: 'C++',
    supportNeeds: ['마케팅', '로컬라이제이션'],
    colorClass: 'color-cyan',
    thumbnail: '/game2.png',
    videos: ['트레일러'],
  },
  {
    id: 'game_003',
    title: 'Franko',
    studio: 'Magnifique',
    developerId: 'dev_003',
    description: '프랑스에서 펼쳐지는 한식당 경영 시뮬레이션',
    genre: ['쿠킹', '시뮬레이션'],
    platform: ['PC'],
    platformBadge: 'PC',
    progress: '베타',
    progressTone: 'blue',
    teamSize: '5인',
    period: '6개월',
    engine: 'Unity',
    language: 'C#',
    supportNeeds: ['퍼블리셔'],
    colorClass: 'color-green',
    thumbnail: '/game3.png',
    videos: ['트레일러'],
  },
  {
    id: 'game_004',
    title: 'The Last Lesson',
    studio: 'StarBurst',
    developerId: 'dev_004',
    description: '평범한 교실에서 시작되는 미스터리 비주얼 노벨',
    genre: ['미스터리', '학원'],
    platform: ['PC'],
    platformBadge: 'PC',
    progress: '개발 중',
    progressTone: 'yellow',
    teamSize: '3인',
    period: '10개월',
    engine: 'Unity',
    language: 'C#',
    supportNeeds: ['투자', '마케팅'],
    colorClass: 'color-red',
    thumbnail: '/game4.png',
    videos: ['티저'],
  },
  {
    id: 'game_005',
    title: 'Lapis Mystery',
    studio: '도원결의',
    developerId: 'dev_001',
    description: '사라진 청금석을 찾는 미스테리 추리 RPG',
    genre: ['RPG', '추리'],
    platform: ['PC', '모바일'],
    platformBadge: 'PC',
    progress: '출시',
    progressTone: 'green',
    teamSize: '3인',
    period: '3개월',
    engine: 'Godot',
    language: 'GDscript',
    supportNeeds: ['마케팅'],
    colorClass: 'color-cyan',
    thumbnail: '/game5.png',
    videos: ['출시 트레일러', '게임플레이'],
  },
];

const DEVELOPERS = [
  {
    id: 'dev_001',
    name: 'DeepLight Studio',
    field: '다크 판타지 RPG 전문',
    location: '서울',
    teamSize: '4인',
    experience: '5년',
    released: '2개',
    awards: '3회',
    summary: '스토리 중심의 몰입감 있는 게임을 만드는 인디 스튜디오입니다.',
    phone: '010-0000-0000',
    email: 'hello@deeplight.kr',
    sns: ['Instagram @deeplight', 'X @deeplight_dev'],
    github: 'deeplight-studio',
    engines: ['Unity', 'Godot'],
    aiTools: ['Midjourney', 'ChatGPT', 'NARA'],
  },
  {
    id: 'dev_002',
    name: 'PixelForge',
    field: '액션 게임 전문',
    location: '부산',
    teamSize: '6인',
    experience: '8년',
    released: '5개',
    awards: '7회',
    summary: '빠른 전투와 강렬한 연출을 추구하는 게임 스튜디오입니다.',
    phone: '010-1111-1111',
    email: 'contact@pixelforge.kr',
    sns: ['Instagram @pixelforge'],
    github: 'pixelforge',
    engines: ['Unreal'],
    aiTools: ['DALL-E', 'NARA'],
  },
  {
    id: 'dev_003',
    name: 'MoonSeed',
    field: '힐링 게임 전문',
    location: '제주',
    teamSize: '2인',
    experience: '3년',
    released: '1개',
    awards: '1회',
    summary: '따뜻하고 감성적인 게임을 만드는 소규모 스튜디오입니다.',
    phone: '010-2222-2222',
    email: 'hello@moonseed.kr',
    sns: ['Instagram @moonseed'],
    github: 'moonseed',
    engines: ['Godot'],
    aiTools: ['Stable Diffusion', 'NARA'],
  },
  {
    id: 'dev_004',
    name: 'StarBurst',
    field: '슈팅 게임 전문',
    location: '대전',
    teamSize: '3인',
    experience: '4년',
    released: '2개',
    awards: '2회',
    summary: '우주를 배경으로 한 게임을 주로 개발하는 스튜디오입니다.',
    phone: '010-3333-3333',
    email: 'info@starburst.kr',
    sns: ['X @starburst_game'],
    github: 'starburst',
    engines: ['Unity'],
    aiTools: ['NARA'],
  },
];

// 관심 게임 (localStorage)
export function getFavorites() {
  try { return JSON.parse(localStorage.getItem('pub_favorites') || '[]'); }
  catch { return []; }
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1); else favs.push(id);
  localStorage.setItem('pub_favorites', JSON.stringify(favs));
  return idx < 0;
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

// 게임 조회
export function getGames() { return GAMES; }
export function getGame(id) { return GAMES.find((g) => g.id === id) || null; }
export function getDeveloper(id) { return DEVELOPERS.find((d) => d.id === id) || null; }

export function filterGames(genre = '전체', platform = '전체', sort = '최신순') {
  let result = [...GAMES];
  if (genre !== '전체') result = result.filter((g) => g.genre.includes(genre));
  if (platform !== '전체') result = result.filter((g) => g.platform.includes(platform));
  if (sort === '관심순') result.sort((a, b) => (isFavorite(b.id) ? 1 : 0) - (isFavorite(a.id) ? 1 : 0));
  return result;
}

export function getGenreOptions() {
  const genres = new Set(GAMES.flatMap((g) => g.genre));
  return ['전체', ...genres];
}

export function badgeTone(tone) {
  if (tone === 'green') return 'badge-green';
  if (tone === 'blue') return 'badge-blue';
  return 'badge-yellow';
}
