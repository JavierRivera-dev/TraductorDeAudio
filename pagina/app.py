from pathlib import Path

from flask import Flask, jsonify, render_template, request
import whisper


app = Flask(__name__)

TIPOS_AUDIO = {
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
}


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/api/grabar_audio", methods=["POST"])
def grabar_audio():
    audio = request.files.get("audio")
    if audio is None:
        return jsonify({"error": "No se recibió ningún archivo de audio."}), 400

    extension = TIPOS_AUDIO.get(audio.mimetype)
    if extension is None:
        return jsonify({"error": "El formato de audio recibido no es compatible."}), 415

    contenido = audio.read()
    if not contenido:
        return jsonify({"error": "La grabación está vacía."}), 400

    ruta_audio = Path(__file__).parent / f"audio_temp{extension}"
    try:
        ruta_audio.write_bytes(contenido)
    except OSError:
        app.logger.exception("No se pudo guardar la grabación")
        return jsonify({"error": "No se pudo guardar la grabación en el servidor."}), 500

    return jsonify({
        "respuesta": "Audio grabado con éxito.",
        "archivo": ruta_audio.name,
    })

@app.route("/api/transcribir_audio", methods=["POST"])
def transcribir_audio(audio_path=None):
    if audio_path:
        ruta_audio = Path(audio_path)
    else:
        ruta_audio = Path(__file__).parent / "audio_temp.wav"
    if not ruta_audio.exists():
        return jsonify({"error": "No se encontró el archivo de audio para transcribir."}), 404

    try:
        model = whisper.load_model("small")
        resultado = model.transcribe(str(ruta_audio))
        texto_transcrito = resultado.get("text", "")
    except Exception as e:
        app.logger.exception("Error al transcribir el audio")
        return jsonify({"error": "Ocurrió un error al transcribir el audio."}), 500

    return jsonify({
        "texto_transcrito": texto_transcrito,
        "idioma_detectado": resultado.get("language", "No detectado"),
    })

if __name__ == "__main__":
    app.run(debug=True)