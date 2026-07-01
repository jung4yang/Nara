// ============================================================
// api.js — Flask 백엔드 API 호출 함수 모음
//
// ⚠️ 이 파일의 함수들은 Flask 서버(backend/app.py)와 연동됩니다.
//    수정 시 backend/app.py도 함께 확인하세요.
// ============================================================

const BASE_URL = 'http://127.0.0.1:5000';

export async function generateSynopsisAPI(answers, genre, format) {
  const res = await fetch(`${BASE_URL}/api/synopsis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, genre, format }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.synopsis;
}

export async function summarizeSynopsisAPI(text, genre, format) {
  const res = await fetch(`${BASE_URL}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, genre, format }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.synopsis;
}

export async function regenerateSynopsisAPI(synopsis, genre, format) {
  const res = await fetch(`${BASE_URL}/api/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ synopsis, genre, format }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.synopsis;
}

export async function editSynopsisAPI(synopsis, prompt, genre, format) {
  const res = await fetch(`${BASE_URL}/api/edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ synopsis, prompt, genre, format }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.synopsis;
}
