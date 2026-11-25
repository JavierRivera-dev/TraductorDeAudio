const btnGrabar = document.getElementById("btnGrabar");
const resultado = document.getElementById("resultado");
const btnDetener = document.getElementById("btnDetener");
const estado = document.getElementById("estado");
const tab = document.getElementById("tablaResultados");

let grabadora = null;
let flujoAudio = null;
let fragmentosAudio = [];

function detenerMicrofono() {
    if (flujoAudio) {
        flujoAudio.getTracks().forEach((pista) => pista.stop());
        flujoAudio = null;
    }
}

function restablecerControles() {
    detenerMicrofono();
    grabadora = null;
    btnDetener.style.display = "none";
    btnDetener.disabled = false;
    btnGrabar.disabled = false;
    btnGrabar.style.display = "inline-block";
}

async function convertirAWav(audioBlob) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        throw new Error("Este navegador no permite convertir la grabación a WAV.");
    }

    const contexto = new AudioContext();
    try {
        const audioBuffer = await contexto.decodeAudioData(await audioBlob.arrayBuffer());
        const canales = audioBuffer.numberOfChannels;
        const bytesPorMuestra = 2;
        const bytesDeAudio = audioBuffer.length * canales * bytesPorMuestra;
        const wavBuffer = new ArrayBuffer(44 + bytesDeAudio);
        const vista = new DataView(wavBuffer);
        const escribirTexto = (offset, texto) => {
            for (let indice = 0; indice < texto.length; indice += 1) {
                vista.setUint8(offset + indice, texto.charCodeAt(indice));
            }
        };

        escribirTexto(0, "RIFF");
        vista.setUint32(4, 36 + bytesDeAudio, true);
        escribirTexto(8, "WAVE");
        escribirTexto(12, "fmt ");
        vista.setUint32(16, 16, true);
        vista.setUint16(20, 1, true);
        vista.setUint16(22, canales, true);
        vista.setUint32(24, audioBuffer.sampleRate, true);
        vista.setUint32(28, audioBuffer.sampleRate * canales * bytesPorMuestra, true);
        vista.setUint16(32, canales * bytesPorMuestra, true);
        vista.setUint16(34, 16, true);
        escribirTexto(36, "data");
        vista.setUint32(40, bytesDeAudio, true);

        const datosPorCanal = [];
        for (let canal = 0; canal < canales; canal += 1) {
            datosPorCanal.push(audioBuffer.getChannelData(canal));
        }

        let offset = 44;
        for (let indice = 0; indice < audioBuffer.length; indice += 1) {
            for (let canal = 0; canal < canales; canal += 1) {
                const muestra = Math.max(-1, Math.min(1, datosPorCanal[canal][indice]));
                vista.setInt16(
                    offset,
                    muestra < 0 ? muestra * 0x8000 : muestra * 0x7fff,
                    true,
                );
                offset += bytesPorMuestra;
            }
        }

        return new Blob([wavBuffer], { type: "audio/wav" });
    } finally {
        if (contexto.state !== "closed") {
            await contexto.close();
        }
    }
}

function tipoDeAudioCompatible() {
    const tipos = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/webm",
        "audio/ogg",
    ];

    return tipos.find((tipo) => MediaRecorder.isTypeSupported(tipo));
}

btnGrabar.addEventListener("click", async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
        resultado.textContent = "Este navegador no permite grabar audio.";
        resultado.style.color = "#dc2626";
        return;
    }

    btnGrabar.disabled = true;
    resultado.textContent = "";
    estado.textContent = "Estado: Solicitando acceso al micrófono...";

    try {
        flujoAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
        const tipo = tipoDeAudioCompatible();
        grabadora = tipo
            ? new MediaRecorder(flujoAudio, { mimeType: tipo })
            : new MediaRecorder(flujoAudio);
        fragmentosAudio = [];

        grabadora.addEventListener("dataavailable", (evento) => {
            if (evento.data.size > 0) {
                fragmentosAudio.push(evento.data);
            }
        });

        grabadora.addEventListener("stop", async () => {
            detenerMicrofono();
            try {
                const tipoAudio = grabadora.mimeType || "audio/webm";
                const audioGrabado = new Blob(fragmentosAudio, { type: tipoAudio });
                if (audioGrabado.size === 0) {
                    throw new Error("La grabación está vacía.");
                }

                estado.textContent = "Estado: Convirtiendo a WAV y guardando...";
                const archivoAudio = await convertirAWav(audioGrabado);
                const formulario = new FormData();
                formulario.append("audio", archivoAudio, "grabacion.wav");
                const respuesta = await fetch("/api/grabar_audio", {
                    method: "POST",
                    body: formulario,
                });
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.error || "No se pudo guardar la grabación.");
                }

                resultado.textContent = `${datos.respuesta} Archivo: ${datos.archivo}`;
                resultado.style.color = "#16a34a";
                estado.textContent = "Estado: Transcribiendo audio...";
                btnDetener.style.display = "none";
                const transcripcion = await trascribirAudio(archivoAudio);
                document.getElementById("archivo").textContent = datos.archivo;
                document.getElementById("transcripcion").textContent = transcripcion.texto_transcrito;
                document.getElementById("idioma").textContent = transcripcion.idioma_detectado;
                estado.textContent = "Estado: Inactivo";
                
            } catch (error) {
                resultado.textContent = `Error: ${error.message}`;
                resultado.style.color = "#dc2626";
                estado.textContent = "Estado: Inactivo";
            } finally {
                restablecerControles();
            }
        });

        grabadora.start();
        btnGrabar.style.display = "none";
        btnDetener.style.display = "inline-block";
        estado.textContent = "Estado: Grabando...";
    } catch (error) {
        resultado.textContent = `No se pudo iniciar la grabación: ${error.message}`;
        resultado.style.color = "#dc2626";
        estado.textContent = "Estado: Inactivo";
        restablecerControles();
    }
});

btnDetener.addEventListener("click", async () => {
    if (!grabadora || grabadora.state !== "recording") {
        return;
    }

    btnDetener.disabled = true;
    estado.textContent = "Estado: Guardando grabación...";
    grabadora.stop();
});

async function trascribirAudio(archivo) {
    const formulario = new FormData();
    formulario.append("audio", archivo, "grabacion.wav");
    const respuesta = await fetch("/api/transcribir_audio", {
        method: "POST",
        body: formulario,
    });
    const datos = await respuesta.json();
    return datos;
}