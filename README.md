# TraductorDeAudio
Proyecto de la materia de Inteligencia Artificial. Consiste en un software que te permitirá oír audios en diferentes idiomas y ascentos, y el programa será capáz de reconocer el idioma, además de permitir traducirlo y en un futuro, devolverte el texto traducido en un audio.


# Tecnologías
| Entorno | Costo |
|----------|-----------|
| Whisper AI | Gratuito
| DeepL API  | Gratuito (El primer millón de palabras) |

# ¿Cómo instalar Whisper AI?

Primero necesitaremos tener instalado el entorno de python.
Ejecutaremos este código en nuestra terminal de Windows para instalar el entorno de whisper a nuestra computadora, obtendrémos la versión más nueva del repocitorio de Github.

```bash
pip install git+https://github.com/openai/whisper.git
```

Ocuparemos instalar el entorno de `ffmpeg`, para ello puedes ejecutar el siguiente comando:

```bash
# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```

Si no tienes ningún package manager, puedes acceder a la siguiente página para buscar alternativas: [`ffmpeg`](https://ffmpeg.org/)

# Obtener la api de DeepL

Para tener acceso a esta api, deberás crear una cuenta gratuita en la [`Página oficial de DeepL`](https://www.deepl.com/es/home), al haber iniciado, darás en la opción de **Crear nueva clave api**, al obtenerla deberás de guardarla muy bien, ya que con esta clave será posible ejecutar todas las funciones especiales.

Se necesitará mucha discreción al momento de utilizar la api de DeepL, ya que acabando el millón de palabras, se deberá pagar una cuota por uso.