import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Pencil, Clapperboard } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';

export default function VideoPreviewScreen({ selectedFormat, onEdit, onNext, onRestart }) {
    const [videoError, setVideoError] = useState(false);

    return (
        <ScreenShell>
            <div className="screen-wrap" style={{ maxWidth: 600 }}>
                <div className="screen-title">영상 프리뷰</div>
                <div className="screen-desc">생성된 영상을 확인해보세요. 마음에 들지 않으면 수정할 수 있어요.</div>

                {/* 영상 미리보기 */}
                <div className="export-video" style={{ margin: '0 auto 28px' }}>
                    {!videoError ? (
                        <video
                            autoPlay muted loop playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={() => setVideoError(true)}
                        >
                            <source src="/finalvideo.mp4" type="video/mp4" />
                        </video>
                    ) : (
                        <>
                            <span style={{ color: 'var(--text3)' }}><Clapperboard size={48} strokeWidth={1.4} /></span>
                            <span style={{ fontSize: 14, color: 'var(--text3)' }}>영상 미리보기</span>
                        </>
                    )}
                </div>

                {/* 액션 버튼 3개 */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
                    <motion.button
                        className="btn-export download"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = '/finalvideo.mp4';
                            a.download = 'nara_trailer.mp4';
                            a.click();
                        }}
                    >
                        <Download size={16} strokeWidth={2} /> 다운로드
                    </motion.button>
                    <motion.button
                        className="btn-export sns"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={onNext}
                    >
                        <Share2 size={16} strokeWidth={2} /> 공유하기
                    </motion.button>
                    <motion.button
                        className="btn-export sns"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={onEdit}
                    >
                        <Pencil size={16} strokeWidth={2} /> 수정하기
                    </motion.button>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center' }}>
                    수정하기를 누르면 클립별로 다시 검토할 수 있어요.
                </div>
            </div>

            <div className="bottom-nav">
                <button className="btn-back" onClick={onRestart}>← 처음으로</button>
                <button className="btn-next" onClick={onNext}>공유 페이지로 →</button>
            </div>
        </ScreenShell>
    );
}