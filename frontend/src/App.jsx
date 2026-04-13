import { useState, useEffect } from "react";

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Bring the complete list of the Backend
  useEffect(() => {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando API:", err);
        setLoading(false);
      });
  }, []);

  // Save the selected character in PostgreSQL
  const saveCharacter = (char) => {
    const characterToSave = {
      api_id: char.id,
      name: char.name,
      species: char.species,
      image: char.image,
    };

    fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characterToSave),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(`¡${char.name} guardado con éxito!`);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => console.error("Error al guardar:", err));
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Cargando personajes...
      </div>
    );

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#102a43" }}>Explorador Rick and Morty</h1>
        <p style={{ color: "#627d98" }}>
          Selecciona los personajes que quieres persistir en tu Base de Datos.
        </p>
        {message && (
          <div
            style={{
              padding: "10px",
              background: "#27ab83",
              color: "white",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {message}
          </div>
        )}
      </header>

      {/* Character grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {characters.map((char) => (
          <div
            key={char.id}
            style={{
              border: "1px solid #d9e2ec",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={char.image}
              alt={char.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h4 style={{ margin: "0 0 5px 0", color: "#334e68" }}>
              {char.name}
            </h4>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#627d98",
                marginBottom: "15px",
              }}
            >
              {char.species}
            </p>
            <button
              onClick={() => saveCharacter(char)}
              style={{
                width: "100%",
                padding: "8px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Guardar en BD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
