import { motion } from 'framer-motion';

const steps = [
  { cat: 'ASSET', title: '캐릭터와 배경을 올려주세요', desc: '게임 에셋을 올리면 됩니다. 없으면 그냥 넘어가도 돼요. 이미지가 있을수록 영상이 정교해집니다.' },
  { cat: 'STORY', title: '몇 가지 질문에 답해주세요', desc: '시나리오가 있으면 바로 올려주세요. 없어도 됩니다. AI 질문에 몇 가지 답하면 충분합니다.' },
  { cat: 'FORMAT', title: '어디에 올릴 건지 고르세요', desc: '인스타그램, 틱톡, 유튜브 쇼츠 중 골라주세요. 포맷에 따라 편집 방식이 달라집니다.' },
  { cat: 'REVIEW', title: '마음에 드는 이미지를 골라주세요', desc: 'AI가 스토리보드 이미지를 제안합니다. 마음에 들면 확정, 아니면 한 번만 바꿔주세요.' },
  { cat: 'DONE', title: '기다리면 완성됩니다', desc: '탭을 닫아도 괜찮아요. 다 되면 알려드릴게요. 다운로드하고 SNS에 바로 올리시면 됩니다.' },
];

export default function HowItWorks({ hiwRef }) {
  return (
    <div className="hiw show" id="hiw" ref={hiwRef}>
      <div className="hiw-inner">
        <div className="hiw-sticky">
          <div className="hiw-eyebrow">HOW IT WORKS</div>
          <div className="hiw-headline">게임만<br />만드세요.</div>
          <div className="hiw-sub">나머지는<br />NARA가 합니다.</div>
          <div className="hiw-nara">
            <span>N</span>arrative — 서사 자동 생성<br />
            <span>A</span>I — 인공지능 파이프라인<br />
            <span>R</span>each — 더 많은 유저에게<br />
            <span>A</span>utomation — 전 과정 자동화
          </div>
        </div>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <motion.div
              className="hiw-step"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="hiw-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className="hiw-step-cat">{s.cat}</div>
                <div className="hiw-step-title">{s.title}</div>
                <div className="hiw-step-desc">{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
