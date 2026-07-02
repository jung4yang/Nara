import { ArrowLeft, Camera, MessageCircle, MonitorPlay, Code2, Globe, Link } from 'lucide-react';
import { getDeveloper, getGames } from './publisher';
import GameCard from './GameCard';
import { useLang } from '../../i18n';

function LinkIcon({ label }) {
  const v = label.toLowerCase();
  const size = 14;
  if (v.includes('instagram')) return <Camera size={size} />;
  if (v.includes('discord')) return <MessageCircle size={size} />;
  if (v.includes('youtube')) return <MonitorPlay size={size} />;
  if (v.includes('github')) return <Code2 size={size} />;
  if (v.includes('x @') || v.startsWith('x ')) return <Globe size={size} />;
  return <Link size={size} />;
}

export default function ProfilePage({ devId, onBack, onDetail }) {
  const { t } = useLang();
  const dev = getDeveloper(devId);
  if (!dev) return (
    <div className="empty-state" style={{ marginTop: 48 }}>
      <h3>{t.profile.notFound}</h3>
      <button className="btn" onClick={onBack}>{t.profile.backToFeedFull}</button>
    </div>
  );

  const devGames = getGames().filter((g) => g.developerId === dev.id);
  const linkItems = [...dev.sns, `GitHub ${dev.github}`];

  return (
    <>
      {/* <div className="page-actions" style={{ padding: '20px 0 0' }}>
        <button className="btn" onClick={onBack}><ArrowLeft size={16} style={{ verticalAlign: '-3px', marginRight: 4 }} />피드로</button>
      </div> */}
      <section className="profile-hero">
        {dev.cover ? (
          <div className="profile-cover" style={{ backgroundImage: `url(${dev.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ) : (
          <div className="profile-cover" />
        )}
        <div className="profile-content">
          {dev.avatar ? (
            <img className="avatar avatar-img" src={dev.avatar} alt={dev.name} />
          ) : (
            <div className="avatar">{dev.name.charAt(0)}</div>
          )}
          <div className="profile-header">
            <div>
              <h2 className="page-title" style={{ fontSize: 30, marginBottom: 4 }}>{dev.name}</h2>
              <p className="page-desc">{dev.location} · {dev.field}</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat"><b>{dev.teamSize}</b><span>{t.profile.teamSize}</span></div>
            <div className="stat"><b>{dev.experience}</b><span>{t.profile.experience}</span></div>
            <div className="stat"><b>{dev.released}</b><span>{t.profile.released}</span></div>
            <div className="stat"><b>{dev.awards}</b><span>{t.profile.awards}</span></div>
          </div>
          <div className="two-col">
            <div className="panel">
              <div className="panel-body">
                <p className="section-title" style={{ marginTop: 0 }}>{t.profile.about}</p>
                <p className="muted">{dev.summary}</p>
                <p className="section-title">{t.profile.contact}</p>
                <div className="contact-list">
                  <p><span>{t.profile.phone}</span><strong>{dev.phone}</strong></p>
                  <p><span>{t.profile.email}</span><strong>{dev.email}</strong></p>
                </div>
                <p className="section-title">{t.profile.links}</p>
                <div className="link-chip-wrap">
                  {linkItems.map((item) => <span key={item} className="link-chip"><i><LinkIcon label={item} /></i>{item}</span>)}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-body">
                <p className="section-title" style={{ marginTop: 0 }}>{t.profile.skills}</p>
                <p className="muted" style={{ marginBottom: 8 }}>{t.profile.engines}</p>
                <div className="chip-wrap">{dev.engines.map((item) => <span key={item} className="chip">{item}</span>)}</div>
                <p className="muted" style={{ marginTop: 16, marginBottom: 8 }}>{t.profile.aiTools}</p>
                <div className="chip-wrap">{dev.aiTools.map((item) => <span key={item} className="chip">{item}</span>)}</div>
              </div>
            </div>
          </div>
          <p className="section-title">{t.profile.projects}</p>
          {devGames.length > 0
            ? <div className="profile-projects">{devGames.map((game) => <GameCard key={game.id} game={game} onDetail={onDetail} />)}</div>
            : <div className="empty-state"><p>{t.profile.noProjects}</p></div>
          }
        </div>
      </section>
    </>
  );
}
