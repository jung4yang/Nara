import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
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

// 0:genre 1:format 2:branch 3:questions 4:synopsis
// 5:upload 6:storyboard 7:clipreview 8:export

export default function App() {
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
      try {
        const text = scenarioText.trim() || `(파일 업로드됨: ${scenarioFile})`;
        const result = await summarizeSynopsisAPI(text, selectedGenre, selectedFormat);
        setSynopsis(result);
      } catch (err) {
        console.error('시놉시스 요약 실패:', err);
        setSynopsis(SYNOPSIS[selectedGenre] || SYNOPSIS.RPG);
      }
      hideOverlay();
      setSynopsisLoading(false);
    } else {
      goTo(3); // questions
    }
  };

  const generateSynopsis = async (answers) => {
    goTo(4); // synopsis
    setSynopsisLoading(true);
    showOverlay('AI가 시놉시스를 작성 중...', '답변을 바탕으로 서사 구성 중');
    try {
      const result = await generateSynopsisAPI(answers, selectedGenre, selectedFormat);
      setSynopsis(result);
    } catch (err) {
      console.error('시놉시스 생성 실패:', err);
      setSynopsis(SYNOPSIS[selectedGenre] || SYNOPSIS.RPG);
    }
    hideOverlay();
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
    showOverlay('움짤 클립 생성 중...', '확정된 컷을 짧은 영상으로 변환 중');
    await delay(2000);
    hideOverlay();
  };

  return (
    <>
      <Nav
        inApp={view === 'app'}
        currentScreen={screenIndex}
        totalScreens={SCREENS.length}
        onLogoClick={goLanding}
        onStart={startApp}
        view={view === 'pub' ? pubView : view}
        onGoFeed={goFeed}
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
              />
            )}
          </AnimatePresence>
        </div>
      )}
      {view === 'pub' && (
        <div className="pub-shell">
          <aside className="rail">
            <button className={`rail-icon${pubView === 'feed' || pubView === 'detail' || pubView === 'profile' ? ' active' : ''}`} onClick={goFeed} title="NARA 피드">▣</button>
            <button className={`rail-icon${pubView === 'favorites' ? ' active' : ''}`} onClick={goFavorites} title="관심 게임">♡</button>
          </aside>
          <main className="main">
            {pubView === 'feed' && <FeedPage onDetail={goDetail} />}
            {pubView === 'detail' && <DetailPage gameId={pubGameId} onBack={goFeed} onProfile={goProfile} />}
            {pubView === 'profile' && <ProfilePage devId={pubDevId} onBack={goFeed} onDetail={goDetail} />}
            {pubView === 'favorites' && <FavoritesPage onBack={goFeed} onDetail={goDetail} />}
          </main>
        </div>
      )}
      <Toast />
    </>
  );
}
