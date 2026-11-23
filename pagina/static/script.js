const btnEnviar = document.getElementById("btnEnviar");
const btnGrabar = document.getElementById("btnGrabar");
const inputNombre = document.getElementById("inputNombre");
const resultado = document.getElementById("resultado");

btnEnviar.addEventListener("click", async () => {
    const nombre = inputNombre.value;

    try {
        const respuesta = await fetch("/api/saludar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre: nombre })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            resultado.textContent = data.error;
            resultado.style.color = "#dc2626";
            return;
        }

        resultado.textContent = data.respuesta;
        resultado.style.color = "#16a34a";
    } catch (error) {
        resultado.textContent = "Error al conectar con el servidor.";
    }

});

btnGrabar.addEventListener("click", async () => {
    try{
        const respuesta = await fetch("/api/grabar_audio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            resultado.textContent = data.error;
            resultado.style.color = "#dc2626";
            return;
        }

        resultado.textContent = data.respuesta;
        resultado.style.color = "#16a34a";
    } catch (error) {
        resultado.textContent = "Error: " + error.message;
    }
});