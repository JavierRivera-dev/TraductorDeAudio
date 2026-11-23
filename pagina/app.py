from flask import Flask, render_template, request, jsonify
import os
import deepl
import whisper
from dotenv import load_dotenv
import sounddevice as sd
import soundfile as sf


app = Flask(__name__)

# 1. Ruta principal: entrega el archivo HTML al navegador
@app.route("/")
def inicio():
    return render_template("index.html")

# 2. Ruta de API: recibe datos del frontend y responde con JSON
@app.route("/api/saludar", methods=["POST"])
def saludar():
    datos = request.get_json()
    nombre = datos.get("nombre", "").strip()

    if not nombre:
        return jsonify({"error": "Por favor escribe un nombre"}), 400

    mensaje_procesado = f"¡Hola, {nombre}! Este mensaje fue generado desde Python."
    return jsonify({"respuesta": mensaje_procesado})


@app.route("/api/grabar_audio", methods=["POST"])
def grabar_audio():
    freq = 44100  # Frecuencia de muestreo
    duracion = 5  # Duración de la grabación en segundos

    print("Grabando audio...")
    audio = sd.rec(int(duracion * freq), samplerate=freq, channels=2)
    sd.wait()  # Espera a que termine la grabación

    # Guardar el audio en un archivo temporal
    ruta_audio = os.path.join(os.path.dirname(__file__), "audio_temp.wav")
    sf.write(ruta_audio, audio, freq)

    return jsonify({"respuesta": "Audio grabado con éxito."})

if __name__ == "__main__":
    app.run(debug=True)