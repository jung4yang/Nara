import { createContext, useContext, useState, useEffect } from 'react';

// 데이터 토큰(장르·플랫폼·개발상태·지원·정렬 등) 한→영 매핑.
// ko는 원문 그대로 사용, en일 때만 이 표로 치환. 매핑 없으면 원문 유지.
const TERMS_EN = {
  // 장르 (선택 화면 + 게임 태그)
  RPG: 'RPG', 액션: 'Action', '공포·서바이벌': 'Horror·Survival', '퍼즐·어드벤처': 'Puzzle·Adventure',
  로그라이크: 'Roguelike', '전략·시뮬레이션': 'Strategy·Sim', 비주얼노벨: 'Visual Novel',
  플랫포머: 'Platformer', 오픈월드: 'Open World', 기타: 'Other',
  다크판타지: 'Dark Fantasy', 추리: 'Mystery', 미스터리: 'Mystery', 학원: 'School',
  쿠킹: 'Cooking', 시뮬레이션: 'Simulation', 퍼즐: 'Puzzle', 탐험: 'Exploration',
  사이버펑크: 'Cyberpunk', 힐링: 'Healing', 어드벤처: 'Adventure', 슈팅: 'Shooter',
  // 플랫폼
  전체: 'All', 모바일: 'Mobile', 콘솔: 'Console',
  // 개발 상태
  '개발 중': 'In Development', 베타: 'Beta', '얼리 액세스': 'Early Access', 출시: 'Released',
  // 필요 지원
  마케팅: 'Marketing', 로컬라이제이션: 'Localization', 투자: 'Investment', 퍼블리셔: 'Publisher',
  // 정렬
  최신순: 'Latest', 관심순: 'Most liked',
  // 숏폼 라벨
  '메인 트레일러': 'Main Trailer', '액션 하이라이트': 'Action Highlights', 게임플레이: 'Gameplay',
  티저: 'Teaser', 예고편: 'Trailer',
};

// 번역 사전. 필요한 화면부터 점진적으로 채워 넣으면 됩니다.
const dict = {
  ko: {
    nav: { home: '홈', create: 'AI 영상 생성', feed: '퍼블리셔 피드', login: '로그인', logout: '로그아웃' },
    hero: {
      subtitle: 'Let Your Game Stories Fly',
      desc: ['게임 에셋만 넣으면 AI가 시놉시스부터', '숏폼 트레일러까지 자동으로 만들어드립니다.'],
      cta: '무료로 시작하기',
      how: 'HOW IT WORKS',
    },
    hiw: {
      eyebrow: 'HOW IT WORKS',
      headline: ['게임만', '만드세요.'],
      sub: ['나머지는', 'NARA가 합니다.'],
      steps: [
        { cat: 'ASSET', title: '캐릭터와 배경을 올려주세요', desc: '게임 에셋을 올리면 됩니다. 없으면 그냥 넘어가도 돼요. 이미지가 있을수록 영상이 정교해집니다.' },
        { cat: 'STORY', title: '몇 가지 질문에 답해주세요', desc: '시나리오가 있으면 바로 올려주세요. 없어도 됩니다. AI 질문에 몇 가지 답하면 충분합니다.' },
        { cat: 'FORMAT', title: '어디에 올릴 건지 고르세요', desc: '인스타그램, 틱톡, 유튜브 쇼츠 중 골라주세요. 포맷에 따라 편집 방식이 달라집니다.' },
        { cat: 'REVIEW', title: '마음에 드는 이미지를 골라주세요', desc: 'AI가 스토리보드 이미지를 제안합니다. 마음에 들면 확정, 아니면 한 번만 바꿔주세요.' },
        { cat: 'DONE', title: '기다리면 완성됩니다', desc: '탭을 닫아도 괜찮아요. 다 되면 알려드릴게요. 다운로드하고 SNS에 바로 올리시면 됩니다.' },
      ],
    },
    login: {
      title: '퍼블리셔 로그인',
      desc: 'NARA 퍼블리셔 계정으로 로그인하세요.',
      email: '이메일',
      password: '비밀번호',
      submit: '로그인',
      or: '또는',
      google: 'Google로 계속하기',
      noAccount: '계정이 없으신가요?',
      signup: '회원가입',
    },
    pub: { publisher: '퍼블리셔', feed: '피드', favorites: '관심 게임' },
    feed: {
      shorts: '숏폼', shortsSub: '클릭해서 감상하세요',
      search: '검색', searchPlaceholder: '게임명, 스튜디오, 태그 검색',
      sort: '정렬', genre: '장르', platform: '플랫폼',
      emptyTitle: '게임이 없습니다', emptyDesc: '검색어 또는 필터 조건을 다시 확인해보세요.',
    },
    detail: {
      backToFeed: '피드로', notFound: '게임을 찾을 수 없습니다.', backToFeedFull: '피드로 돌아가기',
      viewProfile: '프로필 보기', devProfile: 'DEVELOPER PROFILE', defaultStudio: '게임 개발 스튜디오',
      platform: '플랫폼', progress: '개발 현황', support: '필요 지원',
      gameDesc: '게임 설명', moreInfo: '추가 정보',
      teamSize: '팀 규모', period: '개발 기간', engine: '주요 엔진', language: '언어',
      relatedTitle: '관련 태그 추천 영상', relatedSub: '기반 추천',
      supportLabel: 'SUPPORT', supporters: '후원 중인 멤버', more: '더보기 ›', collapse: '접기',
      message: '메시지', review: '퍼블리싱 검토', sponsor: '후원',
      supporterNote: 'NARA를 통해 후원과 퍼블리싱 검토가 이어지고 있습니다.',
    },
    profile: {
      notFound: '개발자를 찾을 수 없습니다.', backToFeed: '피드로', backToFeedFull: '피드로 돌아가기',
      teamSize: '팀 규모', experience: '개발 경력', released: '출시 경험', awards: '수상 경력',
      about: '팀 소개', contact: '연락처', phone: '전화번호', email: '이메일',
      links: 'SNS / 링크', skills: '보유 기술', engines: '개발 엔진 / 도구', aiTools: 'AI 도구',
      projects: '업로드 영상 / 프로젝트', noProjects: '등록된 프로젝트가 없습니다.',
    },
    fav: { emptyTitle: '관심 등록한 게임이 없습니다.', emptyDesc: 'NARA 피드에서 하트를 눌러 저장해보세요.' },
    shorts: { like: '관심', share: '공유' },
    toast: { saved: '관심 게임에 저장했습니다.', removed: '관심 게임에서 제거했습니다.' },
    common: { back: '이전', next: '다음' },
    flow: {
      genre: { title: '게임 장르가 뭔가요?', desc: '장르에 따라 질문 방식이 달라져요.', hint: '가장 가까운 장르를 골라도 괜찮아요.' },
      format: {
        title: '어떤 영상을 만들까요?', desc: '목적에 따라 영상 구조와 포맷이 달라집니다.',
        cineBadge: '시네마틱', cineDur: '30~45초 · 16:9 · 게임 론칭용',
        cineDesc: '세계관과 캐릭터를 드라마틱하게 소개해요. 스팀 페이지와 유튜브 채널에 올리기 좋아요.',
        cineTags: ['스팀 페이지', '유튜브', '론칭'],
        shortBadge: '숏폼', shortDur: '15초 · 9:16 · SNS 바이럴용',
        shortDesc: '캐릭터 이면의 이야기를 숏폼으로 연재해요. 틱톡·릴스·쇼츠에 최적화되어 있어요.',
        shortTags: ['틱톡', '릴스', '쇼츠'],
      },
      branch: {
        title: '게임 스토리가 이미 있나요?', desc: '질문에 따라 시놉시스를 만드는 방식이 달라집니다.',
        hasTitle: '네, 있어요', hasDesc: '기존 시나리오, GDD, 스토리 문서가 있다면 파일을 올려주세요. AI가 분석해서 바로 시놉시스로 정리해드립니다.',
        hasTags: ['PDF 업로드', '텍스트 입력', 'GDD'],
        noTitle: '아니요, 같이 만들어요', noDesc: 'AI가 5가지 질문을 드립니다. 답변만 하면 시놉시스가 자동으로 만들어집니다.',
        noTags: ['AI 질문 5개', '자동 시놉시스'],
        fileUpload: '파일 업로드', fileSupport: 'PDF, TXT, DOCX 지원', orInput: '또는 직접 입력',
        placeholder: '시나리오나 스토리를 직접 붙여넣어주세요...\n\n예: 주인공 아리아는 기억을 잃은 채 멸망한 세계에서 눈을 뜬다...',
        analyze: '분석 시작', start: '시작하기',
      },
      synopsis: {
        titleSummary: '시놉시스 요약', title: '시놉시스',
        descSummary: '업로드한 시나리오를 바탕으로 정리한 시놉시스입니다. 마음에 들지 않으면 수정하거나 재생성할 수 있습니다.',
        desc: 'AI가 생성한 시놉시스입니다. 마음에 들지 않으면 수정하거나 재생성할 수 있습니다.',
        loadingSummary: '시놉시스를 정리하는 중...', loading: 'AI가 시놉시스를 작성 중...',
        regen: '재생성', editBtn: '이렇게 수정해줘', apply: '적용하기',
        placeholder: '예: 더 어둡고 비극적인 분위기로, 주인공의 내면 갈등을 더 강조해줘',
      },
      upload: {
        title: '게임 에셋 업로드', desc: '캐릭터와 배경 이미지를 올려주세요. 없으면 건너뛰어도 됩니다.',
        charImage: '캐릭터 이미지', bgImage: '배경 이미지', optional: 'PNG, JPG · 선택사항',
        gameTitle: '게임 제목',
      },
      storyboard: {
        title: '이미지 검토',
        descCine: '시네마틱 트레일러용 9장 장면입니다. 마음에 들지 않으면 싫어요를 눌러주세요.',
        descShort: '숏폼 트레일러용 5장 장면입니다. 마음에 들지 않으면 싫어요를 눌러주세요.',
        confirm: '확정', like: '좋아요', dislike: '수정 요청', noImage: '이미지 없음', editing: '수정 중...',
        regenAll: '전체 재생성', genVideo: '영상 생성', footerHint: '모든 컷에 좋아요를 누르면 영상 생성으로 넘어가요.',
        panelTitle: '어떤 점을 수정할까요?', panelDesc: '원하는 분위기, 표정, 배경, 동작, 색감 등을 적어주세요.',
        panelPlaceholder: '예: 얼굴 위주의 이미지로 바꿔주세요.', close: '닫기', regenerate: '재생성하기',
      },
      clip: {
        title: '클립 검토',
        descCine: '시네마틱 트레일러용 9개 클립입니다. 마음에 들지 않으면 싫어요를 눌러 수정해주세요.',
        descShort: '숏폼 트레일러용 5개 클립입니다. 마음에 들지 않으면 싫어요를 눌러 수정해주세요.',
        confirm: '확정', like: '좋아요', dislike: '수정 요청', noClip: '클립 없음', editing: '수정 중...',
        footerHint: '모든 클립에 좋아요를 누르면 최종 영상으로 넘어가요.',
        panelTitle: '어떤 점을 수정할까요?', panelDesc: '원하는 분위기, 속도, 색감 등을 적어주세요.',
        panelPlaceholder: '예: 카메라 무빙을 더 느리게, 색감을 더 어둡게', close: '닫기', regenerate: '재생성하기',
        genFinal: '최종 영상 생성',
      },
      export: {
        title: '결과물', doneCine: '시네마틱 트레일러', doneShort: '숏폼 트레일러', doneSuffix: '가 완성됐습니다.',
        preview: '영상 미리보기', edit: '수정하기 (클립 재검토)', snsGen: 'SNS 캡션 자동 생성',
        download: '영상 다운로드', register: '퍼블리셔에 등록', registered: '등록 완료!', share: '공유하기', restart: '처음으로',
      },
      questions: {
        title: '세계관 질문', desc: 'AI가 장르에 맞는 질문을 드립니다. 답변할수록 더 좋은 영상이 만들어집니다.',
        progress: '질문', genSynopsis: '시놉시스 생성',
      },
    },
  },
  en: {
    nav: { home: 'Home', create: 'AI Video', feed: 'Publisher Feed', login: 'Log in', logout: 'Log out' },
    hero: {
      subtitle: 'Let Your Game Stories Fly',
      desc: ['Just drop in your game assets — AI builds', 'everything from the synopsis to a short-form trailer.'],
      cta: 'Get started free',
      how: 'HOW IT WORKS',
    },
    hiw: {
      eyebrow: 'HOW IT WORKS',
      headline: ['Just make', 'your game.'],
      sub: ['NARA handles', 'the rest.'],
      steps: [
        { cat: 'ASSET', title: 'Upload your characters & scenes', desc: 'Just drop in your game assets. No assets? Skip it. The more images you add, the sharper the video gets.' },
        { cat: 'STORY', title: 'Answer a few questions', desc: 'Have a scenario? Upload it. If not, that’s fine — just answer a few AI questions and you’re set.' },
        { cat: 'FORMAT', title: 'Choose where it goes', desc: 'Pick Instagram, TikTok, or YouTube Shorts. The editing style adapts to each format.' },
        { cat: 'REVIEW', title: 'Pick the images you like', desc: 'AI suggests storyboard images. Keep the ones you like, or regenerate once.' },
        { cat: 'DONE', title: 'Sit back — it’s done', desc: 'Feel free to close the tab. We’ll let you know when it’s ready. Download and post straight to social.' },
      ],
    },
    login: {
      title: 'Publisher Login',
      desc: 'Sign in with your NARA publisher account.',
      email: 'Email',
      password: 'Password',
      submit: 'Log in',
      or: 'or',
      google: 'Continue with Google',
      noAccount: 'Don’t have an account?',
      signup: 'Sign up',
    },
    pub: { publisher: 'PUBLISHER', feed: 'Feed', favorites: 'Saved' },
    feed: {
      shorts: 'Shorts', shortsSub: 'Tap to watch',
      search: 'Search', searchPlaceholder: 'Search games, studios, tags',
      sort: 'Sort', genre: 'Genre', platform: 'Platform',
      emptyTitle: 'No games found', emptyDesc: 'Try adjusting your search or filters.',
    },
    detail: {
      backToFeed: 'Feed', notFound: 'Game not found.', backToFeedFull: 'Back to feed',
      viewProfile: 'View profile', devProfile: 'DEVELOPER PROFILE', defaultStudio: 'Game studio',
      platform: 'Platform', progress: 'Status', support: 'Needs',
      gameDesc: 'About the game', moreInfo: 'More info',
      teamSize: 'Team size', period: 'Dev time', engine: 'Engine', language: 'Language',
      relatedTitle: 'Related trailers', relatedSub: 'based recommendations',
      supportLabel: 'SUPPORT', supporters: 'Supporters', more: 'More ›', collapse: 'Collapse',
      message: 'Message', review: 'Reviewing', sponsor: 'Sponsor',
      supporterNote: 'Support and publishing reviews are happening through NARA.',
    },
    profile: {
      notFound: 'Developer not found.', backToFeed: 'Feed', backToFeedFull: 'Back to feed',
      teamSize: 'Team size', experience: 'Experience', released: 'Released', awards: 'Awards',
      about: 'About the team', contact: 'Contact', phone: 'Phone', email: 'Email',
      links: 'Social / Links', skills: 'Skills', engines: 'Engines / Tools', aiTools: 'AI Tools',
      projects: 'Videos / Projects', noProjects: 'No projects yet.',
    },
    fav: { emptyTitle: 'No saved games yet.', emptyDesc: 'Tap the heart on the NARA feed to save games.' },
    shorts: { like: 'Save', share: 'Share' },
    toast: { saved: 'Saved to your games.', removed: 'Removed from saved games.' },
    common: { back: 'Back', next: 'Next' },
    flow: {
      genre: { title: 'What genre is your game?', desc: 'The questions adapt to your genre.', hint: 'Picking the closest genre is fine.' },
      format: {
        title: 'What kind of video?', desc: 'The structure and format change with your goal.',
        cineBadge: 'Cinematic', cineDur: '30–45s · 16:9 · for launch',
        cineDesc: 'Introduce your world and characters dramatically. Great for Steam pages and YouTube.',
        cineTags: ['Steam page', 'YouTube', 'Launch'],
        shortBadge: 'Short-form', shortDur: '15s · 9:16 · for social virality',
        shortDesc: 'Serialize the story behind your characters in short form. Optimized for TikTok, Reels, Shorts.',
        shortTags: ['TikTok', 'Reels', 'Shorts'],
      },
      branch: {
        title: 'Do you already have a story?', desc: 'How we build the synopsis depends on your answer.',
        hasTitle: 'Yes, I do', hasDesc: 'Got an existing scenario, GDD, or story doc? Upload it and AI will analyze it into a synopsis.',
        hasTags: ['PDF upload', 'Text input', 'GDD'],
        noTitle: 'No, let’s build it', noDesc: 'AI asks 5 questions. Just answer them and the synopsis is generated automatically.',
        noTags: ['5 AI questions', 'Auto synopsis'],
        fileUpload: 'Upload a file', fileSupport: 'PDF, TXT, DOCX', orInput: 'or type directly',
        placeholder: 'Paste your scenario or story here...\n\ne.g. Aria wakes in a ruined world with no memory...',
        analyze: 'Start analysis', start: 'Get started',
      },
      synopsis: {
        titleSummary: 'Synopsis Summary', title: 'Synopsis',
        descSummary: 'A synopsis based on your uploaded scenario. Edit or regenerate if you’re not happy.',
        desc: 'An AI-generated synopsis. Edit or regenerate if you’re not happy with it.',
        loadingSummary: 'Summarizing the synopsis...', loading: 'AI is writing the synopsis...',
        regen: 'Regenerate', editBtn: 'Edit like this', apply: 'Apply',
        placeholder: 'e.g. Make it darker and more tragic, emphasize the hero’s inner conflict',
      },
      upload: {
        title: 'Upload game assets', desc: 'Add character and background images. Skip if you don’t have any.',
        charImage: 'Character image', bgImage: 'Background image', optional: 'PNG, JPG · optional',
        gameTitle: 'Game title',
      },
      storyboard: {
        title: 'Review images',
        descCine: '9 scenes for your cinematic trailer. Hit dislike on any you’d like to change.',
        descShort: '5 scenes for your short-form trailer. Hit dislike on any you’d like to change.',
        confirm: 'confirmed', like: 'Like', dislike: 'Request edit', noImage: 'No image', editing: 'Editing...',
        regenAll: 'Regenerate all', genVideo: 'Generate video', footerHint: 'Like every cut to move on to video generation.',
        panelTitle: 'What would you like to change?', panelDesc: 'Describe the mood, expression, background, motion, colors, etc.',
        panelPlaceholder: 'e.g. Make it a close-up of the face.', close: 'Close', regenerate: 'Regenerate',
      },
      clip: {
        title: 'Review clips',
        descCine: '9 clips for your cinematic trailer. Hit dislike to request changes.',
        descShort: '5 clips for your short-form trailer. Hit dislike to request changes.',
        confirm: 'confirmed', like: 'Like', dislike: 'Request edit', noClip: 'No clip', editing: 'Editing...',
        footerHint: 'Like every clip to move on to the final video.',
        panelTitle: 'What would you like to change?', panelDesc: 'Describe the mood, pacing, colors, etc.',
        panelPlaceholder: 'e.g. Slower camera movement, darker colors', close: 'Close', regenerate: 'Regenerate',
        genFinal: 'Generate final video',
      },
      export: {
        title: 'Result', doneCine: 'Your cinematic trailer', doneShort: 'Your short-form trailer', doneSuffix: ' is ready.',
        preview: 'Video preview', edit: 'Edit (review clips)', snsGen: 'Auto-generated social captions',
        download: 'Download video', register: 'Register to publishers', registered: 'Registered!', share: 'Share', restart: 'Start over',
      },
      questions: {
        title: 'World-building questions', desc: 'AI asks questions tailored to your genre. The more you answer, the better the video.',
        progress: 'Question', genSynopsis: 'Generate synopsis',
      },
    },
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('nara_lang') || 'ko'; } catch { return 'ko'; }
  });

  useEffect(() => {
    try { localStorage.setItem('nara_lang', lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang((l) => (l === 'ko' ? 'en' : 'ko'));
  const t = dict[lang] ?? dict.ko;
  // 데이터 토큰 번역기: ko면 원문, en이면 매핑(없으면 원문)
  const tw = (token) => (lang === 'en' ? (TERMS_EN[token] ?? token) : token);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t, tw }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
