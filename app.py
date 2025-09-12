from flask import Flask, request, render_template, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS
import os
import datetime

app = Flask(__name__, template_folder="templates")
CORS(app)


# Helper: normalize language code for gTTS where necessary
def normalize_gtts_lang(code: str) -> str:
    if not code:
        return "en"
    c = code.lower()
    # common mapping cases
    if c == "zh-cn" or c == "zh_cn" or c == "zh-cn":
        return "zh-CN"
    if "-" in c and not c.startswith("zh"):
        return c.split("-")[0]
    return c


@app.route("/")
def index():
    return render_template("v.html")


@app.route("/tts", methods=["POST"])
def tts():
    """
    Accepts JSON: { text: "...", lang: "hi" }
    Uses gTTS to generate MP3 and returns it.
    """
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get("text") or "").strip()
    lang = data.get("lang") or "en"

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        gtts_lang = normalize_gtts_lang(lang)
        # Create audio directory if not exists
        audio_dir = os.path.join("static", "audio")
        os.makedirs(audio_dir, exist_ok=True)

        # timestamped unique filename
        filename = f"tts_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S%f')}.mp3"
        filepath = os.path.join(audio_dir, filename)

        # Generate TTS
        tts = gTTS(text=text, lang=gtts_lang)
        tts.save(filepath)

        # return file (do not force download)
        return send_file(filepath, mimetype="audio/mpeg", as_attachment=False)
    except Exception as e:
        # return a JSON error (useful for client-side display)
        return jsonify({"error": str(e)}), 500


@app.route("/languages")
def list_languages():
    """
    Returns gTTS supported languages mapping as JSON.
    """
    try:
        from gtts.lang import tts_langs
        return jsonify(tts_langs())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
