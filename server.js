const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- ESCENAS DEL JUEGO ---
const escenas = {
  inicio: {
    texto: "Estás en la entrada del Bosque del Chingadazo.",
    opciones: [
      { id: "entrar", texto: "Entrar al bosque" },
      { id: "hablar", texto: "Hablar con el viejo sospechoso" },
      { id: "huellas", texto: "Buscar huellas en el piso" }
    ]
  },

  lobo: {
    texto: "Un lobo enorme aparece, pero está cansado.",
    opciones: [
      { id: "atacar", texto: "Atacarlo" },
      { id: "acariciar", texto: "Acariciarlo" },
      { id: "lonche", texto: "Darle tu lonche" }
    ]
  },

  arbol: {
    texto: "Un árbol gigante pregunta: 'Tengo hojas pero no soy un libro. ¿Qué soy?'",
    opciones: [
      { id: "arbol", texto: "Responder: árbol" },
      { id: "otra", texto: "Responder otra cosa" }
    ]
  },

  final: {
    texto: "Has llegado a la Pluma del Destino. ¿Qué deseas?",
    opciones: [
      { id: "fuerza", texto: "Ser fuerte" },
      { id: "rico", texto: "Ser rico" },
      { id: "vivir", texto: "Salir vivo del bosque" }
    ]
  }
};

// --- EASTER EGGS ---
function revisarEasterEgg(comando) {
  if (!comando) return null;

  comando = comando.toLowerCase();

  if (comando.includes("hongo")) {
    return {
      texto: "Te comiste el hongo morado. Ahora ves colores que ni existen, cabrón.",
      escena: "inicio"
    };
  }

  if (comando.includes("chancla")) {
    return {
      texto: "Invocaste a la Señora Suprema del Chanclazo. Te suelta un madrazo cósmico.",
      escena: "final"
    };
  }

  if (comando.includes("omae")) {
    return {
      texto: "NANI?! Eliminaste al lobo automáticamente.",
      escena: "arbol"
    };
  }

  if (comando.includes("deploy gratis")) {
    return {
      texto: "El espíritu del Hosting Gratuito te bendice. Recuperas toda la vida.",
      escena: "lobo"
    };
  }

  return null;
}

// --- RUTA PRINCIPAL ---
app.post("/evento", (req, res) => {
  const { escenaActual, eleccion, comando } = req.body;

  // Easter eggs
  const egg = revisarEasterEgg(comando);
  if (egg) {
    return res.json({
      texto: egg.texto,
      opciones: escenas[egg.escena].opciones,
      escena: egg.escena
    });
  }

  if (escenaActual === "inicio") {
    return res.json({
      texto: escenas.lobo.texto,
      opciones: escenas.lobo.opciones,
      escena: "lobo"
    });
  }

  if (escenaActual === "lobo") {
    return res.json({
      texto: escenas.arbol.texto,
      opciones: escenas.arbol.opciones,
      escena: "arbol"
    });
  }

  if (escenaActual === "arbol") {
    return res.json({
      texto: escenas.final.texto,
      opciones: escenas.final.opciones,
      escena: "final"
    });
  }

  if (escenaActual === "final") {
    return res.json({
      texto: "Fin del juego. Elegiste: " + eleccion,
      opciones: [],
      escena: "fin"
    });
  }

  res.json({ texto: "Error", opciones: [], escena: "inicio" });
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend corriendo en puerto " + PORT));
