from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


def call_gemini(prompt: str) -> str:
    """Gemini API 호출 공통 함수 (키는 쿼리 파라미터로 전달 - 헤더 인코딩 문제 회피)"""
    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        headers={"Content-Type": "application/json"},
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )
    result = response.json()

    if "candidates" not in result:
        raise Exception(f"Gemini API 응답 이상: {result}")

    return result["candidates"][0]["content"]["parts"][0]["text"]


def get_format_guide(fmt: str) -> str:
    """형식별 시놉시스 작성 가이드"""
    if fmt == 'cinematic':
        return (
            "이 시놉시스는 30~45초 시네마틱 트레일러용이야. "
            "9개 장면으로 구성되므로, 기승전결이 뚜렷하고 감정 곡선이 있는 서사로 써줘. "
            "오프닝 → 세계관 소개 → 주인공 등장 → 갈등 고조 → 위기 → 결의 → 클라이맥스 → 여운 → 타이틀 흐름에 맞도록. "
            "웅장하고 서사적인 내레이션 톤으로."
        )
    else:
        return (
            "이 시놉시스는 15초 숏폼 SNS 트레일러용이야. "
            "5개 장면으로 구성되므로, 첫 문장부터 강렬한 훅으로 시작해줘. "
            "빠른 전개, 핵심 갈등 하나, 강렬한 비주얼 묘사 중심으로. "
            "스크롤을 멈추게 만드는 짧고 강렬한 톤으로."
        )


@app.route("/api/synopsis", methods=["POST"])
def generate_synopsis():
    """질문 답변(없음 경로) → AI가 시놉시스 생성"""
    data = request.json
    answers = data.get("answers", [])
    genre = data.get("genre", "")
    fmt = data.get("format", "shortform")

    format_guide = get_format_guide(fmt)
    scenes = "9개" if fmt == "cinematic" else "5개"

    prompt = (
        f"너는 인디게임 마케팅 카피라이터야. 장르: {genre}\n\n"
        f"{format_guide}\n\n"
        f"아래 질문 답변을 바탕으로 {scenes} 장면에 맞는 시놉시스를 4~5문장으로 작성해줘. "
        "답변에 나온 인물, 사건, 갈등, 분위기를 구체적으로 반영해줘. "
        "추상적이거나 모호한 표현 없이, 장면이 눈에 보이듯 써줘. "
        "목록 형식, 번호, 제목, 메타 설명은 절대 붙이지 마. 시놉시스 본문만 출력해.\n\n"
    )
    for i, ans in enumerate(answers):
        prompt += f"{i+1}. {ans}\n"

    print(f"===== [시놉시스 생성] format={fmt}, answers =====")
    print(answers)

    try:
        text = call_gemini(prompt)
        return jsonify({"synopsis": text})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/summarize", methods=["POST"])
def summarize_scenario():
    """업로드된 시나리오 텍스트(있음 경로) → AI가 요약/정리"""
    data = request.json
    scenario_text = data.get("text", "")
    genre = data.get("genre", "")
    fmt = data.get("format", "shortform")

    if not scenario_text.strip():
        return jsonify({"synopsis": "(요약할 시나리오 내용이 없습니다)"})

    format_guide = get_format_guide(fmt)
    scenes = "9개" if fmt == "cinematic" else "5개"

    prompt = (
        f"너는 인디게임 마케팅 카피라이터야. 장르: {genre}\n\n"
        f"{format_guide}\n\n"
        f"아래는 게임의 스토리 키워드나 메모야. {scenes} 장면에 맞는 시놉시스로 4~5문장 완성해줘. "
        "인물, 갈등, 분위기를 구체적으로 살려서 줄글로 써줘. "
        "추상적이거나 모호한 표현 없이, 장면이 눈에 보이듯 써줘. "
        "목록 형식, 번호, 제목, 메타 설명은 절대 붙이지 마. 시놉시스 본문만 출력해.\n\n"
        f"--- 게임 정보 ---\n{scenario_text}"
    )

    print(f"===== [시놉시스 요약] format={fmt} =====")
    print(scenario_text)

    try:
        text = call_gemini(prompt)
        return jsonify({"synopsis": text})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/regenerate", methods=["POST"])
def regenerate_synopsis():
    """기존 시놉시스를 다른 버전으로 재생성"""
    data = request.json
    original = data.get("synopsis", "")
    genre = data.get("genre", "")
    fmt = data.get("format", "shortform")

    format_guide = get_format_guide(fmt)

    prompt = (
        f"너는 인디게임 마케팅 카피라이터야. 장르: {genre}\n\n"
        f"{format_guide}\n\n"
        "아래는 기존에 작성된 시놉시스야. 같은 게임이지만 "
        "다른 문체, 다른 감정 포인트, 다른 문장 구조로 완전히 새로운 버전을 4~5문장으로 써줘. "
        "목록 형식, 번호, 제목, 메타 설명은 붙이지 마. 시놉시스 본문만 출력해.\n\n"
        f"--- 기존 시놉시스 ---\n{original}"
    )

    try:
        text = call_gemini(prompt)
        return jsonify({"synopsis": text})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/edit", methods=["POST"])
def edit_synopsis():
    """현재 시놉시스 + 수정 요청 프롬프트로 재작성"""
    data = request.json
    current = data.get("synopsis", "")
    edit_prompt = data.get("prompt", "")
    genre = data.get("genre", "")
    fmt = data.get("format", "shortform")

    format_guide = get_format_guide(fmt)

    prompt = (
        f"너는 인디게임 마케팅 카피라이터야. 장르: {genre}\n\n"
        f"{format_guide}\n\n"
        f"현재 시놉시스:\n{current}\n\n"
        f"수정 요청: {edit_prompt}\n\n"
        "위 수정 요청을 반영해서 시놉시스를 다시 써줘. "
        "4~5문장으로 완성하고, 목록 형식, 번호, 제목, 메타 설명은 붙이지 마. "
        "시놉시스 본문만 출력해."
    )

    try:
        text = call_gemini(prompt)
        return jsonify({"synopsis": text})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
