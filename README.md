# TraductorDeAudio
Proyecto de la materia de Inteligencia Artificial. Consiste en un software que te permitirá oír audios en diferentes idiomas y ascentos, y el programa será capáz de reconocer el idioma, además de permitir traducirlo y en un futuro, devolverte el texto traducido en un audio.


# Tecnologías
| Entorno | Costo |
|----------|-----------|
| Whisper AI | Gratuito
| DeepL API  | Gratuito (El primer millón de palabras) |
| Flask | Gratuito |
| SoundDevice y SoundFile | Gratuitos |

# Preparar el entorno de Python

Con Python instalado, ejecuta desde la raíz del proyecto estos comandos en PowerShell para crear y activar el entorno virtual e instalar las dependencias:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

`requirements.txt` instala Flask, Whisper, DeepL, `python-dotenv`, SoundDevice y SoundFile.

Whisper también necesita `ffmpeg` instalado en el sistema. En Windows puedes instalarlo con Chocolatey o Scoop:

```bash
# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```

Si no tienes ningún package manager, puedes acceder a la siguiente página para buscar alternativas: [`ffmpeg`](https://ffmpeg.org/)

## Ejecutar la aplicación web

Desde la raíz del proyecto, con el entorno virtual activado, inicia el servidor:

```powershell
python .\pagina\app.py
```

Abre [http://127.0.0.1:5000](http://127.0.0.1:5000) en el navegador. La página permite enviar un nombre al servidor y solicitar una grabación de audio.

- `POST /api/saludar` recibe un nombre en formato JSON y devuelve un saludo.
- `POST /api/grabar_audio` graba cinco segundos en estéreo a 44.1 kHz usando el micrófono disponible en la computadora que ejecuta Flask y guarda el resultado en `pagina/audio_temp.wav`. Una nueva grabación sobrescribe ese archivo.

La grabación se captura en el servidor, no desde el micrófono del navegador. Aunque la página muestra el título «Transcripción de Audio», actualmente esta ruta solo graba y guarda el WAV; todavía no lo transcribe.

## Obtener la API de DeepL

Para tener acceso a esta api, deberás crear una cuenta gratuita en la [`Página oficial de DeepL`](https://www.deepl.com/es/home), al haber iniciado, darás en la opción de **Crear nueva clave api**, al obtenerla deberás de guardarla muy bien, ya que con esta clave será posible ejecutar todas las funciones especiales.

Se necesitará mucha discreción al momento de utilizar la api de DeepL, ya que acabando el millón de palabras, se deberá pagar una cuota por uso.

Guarda la clave en un archivo `.env` en la raíz del proyecto. Puedes copiar `.env.example` y sustituir el valor de ejemplo:

```text
API_KEY=tu_clave_de_deepl
```

Para ejecutar el programa de transcripción y traducción, desde la raíz del proyecto ejecuta:

```powershell
python .\traduce.py
```

El programa procesa `frenchC.mp3`, detecta el idioma con Whisper y traduce el texto al español con DeepL. Para usarlo necesitas configurar `API_KEY` y tener `ffmpeg` instalado.

## Activar o desactivar el entorno virtual

Si cerraste la terminal, vuelve a activar el entorno virtual desde la raíz del proyecto con este comando en PowerShell:

```powershell
    .venv\Scripts\Activate.ps1
```

Y para desactivarlo escribe:

```powershell
    deactivate
```