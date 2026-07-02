import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutGrid, Heart } from 'lucide-react';
import { useLang } from './i18n';
import './style.css';
import './animations.css';

import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Overlay from './components/Overlay';

import GenreScreen from './screens/GenreScreen';
import BranchScreen from './screens/BranchScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import SynopsisScreen from './screens/SynopsisScreen';
import UploadScreen from './screens/UploadScreen';
import FormatScreen from './screens/FormatScreen';
import StoryboardScreen from './screens/StoryboardScreen';
import ClipReviewScreen from './screens/ClipReviewScreen';
import ExportScreen from './screens/ExportScreen';

import { SCREENS, SYNOPSIS, delay } from './data/content';
import {
  generateSynopsisAPI,
  summarizeSynopsisAPI,
  regenerateSynopsisAPI,
  editSynopsisAPI,
} from './api';

import FeedPage from './screens/publisher/FeedPage';
import DetailPage from './screens/publisher/DetailPage';
import ProfilePage from './screens/publisher/ProfilePage';
import FavoritesPage from './screens/publisher/FavoritesPage';
import { Toast } from './screens/publisher/Toast';
import LoginModal from './screens/publisher/LoginModal';
import ShortsViewer from './screens/publisher/ShortsViewer';

// 0:genre 1:format 2:branch 3:questions 4:synopsis
// 5:upload 6:storyboard 7:clipreview 8:export

export default function App() {
  const { t } = useLang();
  const [view, setView] = useState('landing');
  const [screenIndex, setScreenIndex] = useState(0);
  const hiwRef = useRef(null);

  const [branchMode, setBranchMode] = useState('');
  const [scenarioText, setScenarioText] = useState('');
  const [scenarioFile, setScenarioFile] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [synopsisLoading, setSynopsisLoading] = useState(false);
  const [charPreview, setCharPreview] = useState('');
  const [bgPreview, setBgPreview] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [regenKey, setRegenKey] = useState(0);

  // 퍼블리셔 피드 상태
  const [pubView, setPubView] = useState('feed'); // 'feed' | 'detail' | 'profile' | 'favorites'
  const [pubGameId, setPubGameId] = useState('');
  const [pubDevId, setPubDevId] = useState('');

  const goFeed = () => { setPubView('feed'); setView('pub'); };
  const goDetail = (id) => { setPubGameId(id); setPubView('detail'); setView('pub'); };
  const goProfile = (id) => { setPubDevId(id); setPubView('profile'); setView('pub'); };
  const goFavorites = () => { setPubView('favorites'); setView('pub'); };

  // 로그인 상태
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showShorts, setShowShorts] = useState(false);
  const [shortsIndex, setShortsIndex] = useState(0);

  const openShorts = (index = 0) => { setShortsIndex(index); setShowShorts(true); };

  const [overlay, setOverlay] = useState({ show: false, text: '', sub: '' });
  const showOverlay = (text, sub) => setOverlay({ show: true, text, sub });
  const hideOverlay = () => setOverlay((o) => ({ ...o, show: false }));

  const resetAll = () => {
    setBranchMode(''); setScenarioText(''); setScenarioFile('');
    setSelectedGenre(''); setSelectedFormat('');
    setSynopsis(''); setSynopsisLoading(false);
    setCharPreview(''); setBgPreview(''); setGameTitle('');
    setScreenIndex(0);
  };

  const startApp = () => { setView('app'); window.scrollTo(0, 0); };
  const goLanding = () => { resetAll(); setView('landing'); window.scrollTo(0, 0); };
  const goTo = (n) => { setScreenIndex(n); window.scrollTo(0, 0); };

  const handleBranchNext = async () => {
    if (branchMode === 'has') {
      goTo(4); // synopsis
      setSynopsisLoading(true);
      showOverlay('시놉시스 정리 중...', '업로드한 시나리오를 요약하고 있습니다');
      await delay(2000);
      hideOverlay();
      // 시연용 고정 시놉시스 (시네마틱 — PELAGIA-9)
      setSynopsis(`심해 연구시설 PELAGIA-9. 한때 인류의 미래를 바꿀 기술 "Reflect"를 연구하던 이곳은, 어느 날을 기점으로 모든 교신이 끊겼다.\n\n침묵한 시설에 홀로 눈을 뜬 존재, 베라(Vera). 그녀에게 남은 단서는 단 하나 — 실종된 동료 카이(Kai)를 찾아야 한다는 사실뿐이다.\n\n지지직거리는 CCTV 화면 너머로 처음 깨어난 순간부터, 베라는 자신이 무엇이었는지조차 확신할 수 없다. 복도 벽에 누군가 다급하게 남긴 낙서 — "FIND KAI" — 만이 유일한 이정표가 되어준다.\n\n시설 깊은 곳으로 향할수록, 침묵 속에 도사린 무언가의 기척이 점점 가까워진다. 이것은 구조 임무가 아니다. Reflect가 남긴 메아리를 따라가는, 정체성을 향한 추적이다.`);
      setSynopsisLoading(false);
    } else {
      goTo(3); // questions
    }
  };

  const generateSynopsis = async (answers) => {
    goTo(4); // synopsis
    setSynopsisLoading(true);
    showOverlay('AI가 시놉시스를 작성 중...', '답변을 바탕으로 서사 구성 중');
    await delay(2000);
    hideOverlay();
    // 시연용 고정 시놉시스 (숏폼 — Coffee Talk)
    setSynopsis(`시애틀에 어둠이 내리면, 하루 동안 각자의 걱정과 고민을 짊어졌던 이들이 하나둘 작은 카페로 모여든다.\n\n이곳의 규칙은 단순하다. 주문은 말이 아니라 사연으로 받는다. 손님이 오늘 있었던 일을, 마음에 걸리는 고민을, 혹은 그저 하루의 피로를 털어놓으면 — 바리스타는 그 이야기에 어울리는 한 잔을 조용히 내린다.\n\n말하지 못했던 것들이 여기서는 말이 된다. 밤은 깊어가지만, 이 카페의 불은 꺼지지 않는다. 오늘 밤도 누군가의 이야기가, 한 잔의 커피가 되어 흘러간다.`);
    setSynopsisLoading(false);
  };

  const regenerateSynopsis = async () => {
    setSynopsisLoading(true);
    showOverlay('시놉시스 재생성 중...', '다른 버전으로 생성합니다');
    try {
      const result = await regenerateSynopsisAPI(synopsis, selectedGenre, selectedFormat);
      setSynopsis(result);
    } catch (err) {
      console.error('재생성 실패:', err);
    }
    hideOverlay();
    setSynopsisLoading(false);
  };

  const applyEdit = async (prompt) => {
    setSynopsisLoading(true);
    showOverlay('수정 사항 반영 중...', `"${prompt}" 적용 중`);
    try {
      const result = await editSynopsisAPI(synopsis, prompt, selectedGenre, selectedFormat);
      setSynopsis(result);
    } catch (err) {
      console.error('수정 실패:', err);
    }
    hideOverlay();
    setSynopsisLoading(false);
  };

  const handleFormatNext = async () => {
    goTo(6); // storyboard
    showOverlay('스토리보드 생성 중...', '장면 구성 및 이미지 생성 중');
    await delay(2000);
    hideOverlay();
    setRegenKey((k) => k + 1);
  };

  const regenAllStoryboard = async () => {
    showOverlay('전체 재생성 중...', '새로운 스토리보드를 만들고 있습니다');
    await delay(2000);
    hideOverlay();
    setRegenKey((k) => k + 1);
  };

  const goToExport = async () => {
    goTo(8);
    const label = selectedFormat === 'cinematic' ? '시네마틱 트레일러' : '숏폼 트레일러';
    showOverlay(`${label} 생성 중...`, 'Kling AI로 렌더링 중 (약 30초)');
    await delay(2500);
    hideOverlay();
  };

  const goToClipReview = async () => {
    goTo(7);
    showOverlay('클립 생성 중...', '확정된 컷을 짧은 영상으로 변환 중');
    await delay(2000);
    hideOverlay();
  };

  return (
    <>
      <Nav
        inApp={view === 'app'}
        currentScreen={screenIndex}
        totalScreens={SCREENS.length}
        onLogoClick={startApp}
        onGoHome={goLanding}
        onGoFeed={goFeed}
        view={view === 'pub' ? pubView : view}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={() => setUser(null)}
        onProfileClick={() => goProfile('dev_001')}
      />
      <Overlay show={overlay.show} text={overlay.text} sub={overlay.sub} />

      {view === 'landing' && (
        <div id="landing">
          <Hero onStart={startApp} onHiw={() => hiwRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          <HowItWorks hiwRef={hiwRef} />
        </div>
      )}

      {view === 'app' && (
        <div id="app" className="show">
          <AnimatePresence mode="wait">
            {screenIndex === 0 && (
              <GenreScreen
                key="genre"
                selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
                onBack={goLanding}
                onNext={() => goTo(1)}
              />
            )}
            {screenIndex === 1 && (
              <FormatScreen
                key="format"
                selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat}
                onBack={() => goTo(0)}
                onNext={() => goTo(2)}
              />
            )}
            {screenIndex === 2 && (
              <BranchScreen
                key="branch"
                branchMode={branchMode} setBranchMode={setBranchMode}
                scenarioText={scenarioText} setScenarioText={setScenarioText}
                scenarioFile={scenarioFile} setScenarioFile={setScenarioFile}
                onBack={() => goTo(1)}
                onNext={handleBranchNext}
              />
            )}
            {screenIndex === 3 && (
              <QuestionsScreen
                key="questions"
                branchMode={branchMode}
                selectedGenre={selectedGenre}
                onBack={() => goTo(2)}
                onComplete={generateSynopsis}
              />
            )}
            {screenIndex === 4 && (
              <SynopsisScreen
                key="synopsis"
                loading={synopsisLoading}
                synopsis={synopsis}
                onBack={() => goTo(branchMode === 'has' ? 2 : 3)}
                onNext={() => goTo(5)}
                onRegenerate={regenerateSynopsis}
                onApplyEdit={applyEdit}
              />
            )}
            {screenIndex === 5 && (
              <UploadScreen
                key="upload"
                charPreview={charPreview} setCharPreview={setCharPreview}
                bgPreview={bgPreview} setBgPreview={setBgPreview}
                gameTitle={gameTitle} setGameTitle={setGameTitle}
                onBack={() => goTo(4)}
                onNext={handleFormatNext}
              />
            )}
            {screenIndex === 6 && (
              <StoryboardScreen
                key="storyboard"
                regenKey={regenKey}
                selectedGenre={selectedGenre}
                selectedFormat={selectedFormat}
                onRegenAll={regenAllStoryboard}
                onGenerateVideo={goToExport}
              />
            )}
            {screenIndex === 7 && (
              <ClipReviewScreen
                key="clipreview"
                selectedGenre={selectedGenre}
                selectedFormat={selectedFormat}
                onBack={() => goTo(6)}
                onNext={goToExport}
              />
            )}
            {screenIndex === 8 && (
              <ExportScreen
                key="export"
                selectedFormat={selectedFormat}
                onBack={() => goTo(6)}
                onEdit={goToClipReview}
                onRestart={goLanding}
                onGoFeed={goFeed}
              />
            )}
          </AnimatePresence>
        </div>
      )}
      {view === 'pub' && (
        <div className="pub-shell">
          <main className="main">
            <div className="pub-head">
              <p className="pub-head-label">{t.pub.publisher}</p>
              <div className="pub-tabs">
                <button className={`pub-tab${pubView === 'feed' || pubView === 'detail' || pubView === 'profile' ? ' active' : ''}`} onClick={goFeed}>
                  <LayoutGrid size={16} /> {t.pub.feed}
                </button>
                <button className={`pub-tab${pubView === 'favorites' ? ' active' : ''}`} onClick={goFavorites}>
                  <Heart size={16} /> {t.pub.favorites}
                </button>
              </div>
            </div>
            {pubView === 'feed' && <FeedPage onDetail={goDetail} onOpenShorts={openShorts} />}
            {pubView === 'detail' && <DetailPage gameId={pubGameId} onBack={goFeed} onProfile={goProfile} />}
            {pubView === 'profile' && <ProfilePage devId={pubDevId} onBack={goFeed} onDetail={goDetail} />}
            {pubView === 'favorites' && <FavoritesPage onBack={goFeed} onDetail={goDetail} />}
          </main>
        </div>
      )}
      <Toast />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => setUser(u)} />}
      {showShorts && <ShortsViewer initialIndex={shortsIndex} onClose={() => setShowShorts(false)} />}
    </>
  );
}
