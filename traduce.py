import os
import deepl
import whisper
from dotenv import load_dotenv

#Obtener la API para interactuar con deepL
load_dotenv()
api_key = os.getenv("API_KEY")

#Iniciar cliente de deepL
deepl_client = deepl.DeepLClient(api_key)

# 1. Calculamos la ruta exacta del audio de forma automática
carpeta_actual = os.path.dirname(__file__)
ruta_audio = os.path.join(carpeta_actual, "frenchC.mp3")

# 2. Cargamos el modelo
print("Cargando el modelo de Whisper...")
model = whisper.load_model("small")

print("Analizando y transcribiendo audio... Esto puede tomar unos momentos.")

# 3. EJECUTAMOS LA TRANSCRIPCIÓN SIN FIJAR EL IDIOMA
# Al quitar language="es", Whisper activará su detector automático en los primeros 30 segundos del audio
resultado = model.transcribe(ruta_audio)

# 4. LEEMOS EL IDIOMA DETECTADO
# Whisper devuelve un código de dos letras (ej: "es" para español, "en" para inglés)
idioma_detectado = resultado.get("language", "No detectado")

# 5. Mostramos los resultados en la consola
print("\n" + "="*40)
print(f"🌐 IDIOMA DETECTADO POR LA IA: {idioma_detectado.upper()}")
print("="*40)
print("\n--- Texto Transcrito ---")
print(resultado["text"])

result = deepl_client.translate_text(
    resultado["text"],
    target_lang="ES",
)
print("\n" + "="*40)
print("-----Texto Traducido a español-------")
print("\n" + "="*40)
print(result.text)
print("\n" + "="*40)
