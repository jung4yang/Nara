import { getDeveloper, getGames } from './publisher';
import GameCard from './GameCard';

function getLinkIcon(label) {
  const v = label.toLowerCase();
  if (v.includes('instagram')) return '◎';
  if (v.includes('discord')) return '◈';
  if (v.includes('youtube')) return '▶';
  if (v.includes('github')) return '⌘';
  if (v.includes('x @') || v.startsWith('x ')) return '𝕏';
  return '🔗';
}

export default function ProfilePage({ devId, onBack, onDetail }) {
  const dev = getDeveloper(devId);
  if (!dev) return (
    <div className="empty-state" style={{ marginTop: 48 }}>
      <h3>개발자를 찾을 수 없습니다.</h3>
      <button className="btn" onClick={onBack}>피드로 돌아가기</button>
    </div>
  );

  const devGames = getGames().filter((g) => g.developerId === dev.id);
  const linkItems = [...dev.sns, `GitHub ${dev.github}`];

  return (
    <>
      <div className="page-actions" style={{ padding: '20px 0 0' }}>
        <button className="btn" onClick={onBack}>← 피드로</button>
      </div>
      <section className="profile-hero">
        <div className="profile-cover" />
        <div className="profile-content">
          <div className="avatar">{dev.name.charAt(0)}</div>
          <div className="profile-header">
            <div>
              <h2 className="page-title" style={{ fontSize: 30, marginBottom: 4 }}>{dev.name}</h2>
              <p className="page-desc">{dev.location} · {dev.field}</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat"><b>{dev.teamSize}</b><span>팀 규모</span></div>
            <div className="stat"><b>{dev.experience}</b><span>개발 경력</span></div>
            <div className="stat"><b>{dev.released}</b><span>출시 경험</span></div>
            <div className="stat"><b>{dev.awards}</b><span>수상 경력</span></div>
          </div>
          <div className="two-col">
            <div className="panel">
              <div className="panel-body">
                <p className="section-title" style={{ marginTop: 0 }}>팀 소개</p>
                <p className="muted">{dev.summary}</p>
                <p className="section-title">연락처</p>
                <div className="contact-list">
                  <p><span>전화번호</span><strong>{dev.phone}</strong></p>
                  <p><span>이메일</span><strong>{dev.email}</strong></p>
                </div>
                <p className="section-title">SNS / 링크</p>
                <div className="link-chip-wrap">
                  {linkItems.map((item) => <span key={item} className="link-chip"><i>{getLinkIcon(item)}</i>{item}</span>)}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-body">
                <p className="section-title" style={{ marginTop: 0 }}>보유 기술</p>
                <p className="muted" style={{ marginBottom: 8 }}>개발 엔진 / 도구</p>
                <div className="chip-wrap">{dev.engines.map((item) => <span key={item} className="chip">{item}</span>)}</div>
                <p className="muted" style={{ marginTop: 16, marginBottom: 8 }}>AI 도구</p>
                <div className="chip-wrap">{dev.aiTools.map((item) => <span key={item} className="chip">{item}</span>)}</div>
              </div>
            </div>
          </div>
          <p className="section-title">업로드 영상 / 프로젝트</p>
          {devGames.length > 0
            ? <div className="profile-projects">{devGames.map((game) => <GameCard key={game.id} game={game} onDetail={onDetail} />)}</div>
            : <div className="empty-state"><p>등록된 프로젝트가 없습니다.</p></div>
          }
        </div>
      </section>
    </>
  );
}
