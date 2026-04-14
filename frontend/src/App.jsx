import { useState, useEffect } from "react";

function App() {
  const [characters, setCharacters] = useState([]);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [view, setView] = useState("explore");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Bring the complete list of the Backend API
  useEffect(() => {
    setLoading(true);
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      });
  }, []);

  // Retrieve saved characters in PostgreSQL
  const loadSavedCharacters = () => {
    setLoading(true);
    fetch("/api/saved")
      .then((res) => res.json())
      .then((data) => {
        setSavedCharacters(data);
        setLoading(false);
        setView("saved");
      });
  };

  const saveCharacter = (char) => {
    fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_id: char.id,
        name: char.name,
        species: char.species,
        image: char.image,
      }),
    }).then(() => {
      setMessage(`¡${char.name} guardado!`);
      setTimeout(() => setMessage(""), 2000);
    });
  };

  const deleteCharacter = (id) => {
    fetch(`/api/saved/${id}`, { method: "DELETE" }).then(() => {
      setSavedCharacters(savedCharacters.filter((c) => c.id !== id));
      setMessage("Eliminado de la base de datos");
      setTimeout(() => setMessage(""), 2000);
    });
  };

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
        <h1>Rick and Morty Fullstack</h1>

        {/* Simple navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setView("explore")}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              cursor: "pointer",
              background: view === "explore" ? "#102a43" : "#d9e2ec",
              color: view === "explore" ? "white" : "#334e68",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Explorar API
          </button>
          <button
            onClick={loadSavedCharacters}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: view === "saved" ? "#102a43" : "#d9e2ec",
              color: view === "saved" ? "white" : "#334e68",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Ver Personajes Guardados
          </button>
        </nav>

        {message && (
          <div
            style={{
              padding: "8px",
              background: "#334e68",
              color: "white",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {message}
          </div>
        )}
      </header>

      {loading ? (
        <p style={{ textAlign: "center" }}>Procesando...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Exploration View */}
          {view === "explore" &&
            characters.map((char) => (
              <div
                key={char.id}
                style={{
                  border: "1px solid #d9e2ec",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                  background: "#fff",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <h4>{char.name}</h4>
                <button
                  onClick={() => saveCharacter(char)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#27ab83",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Guardar
                </button>
              </div>
            ))}

          {/* Database View (CRUD) */}
          {view === "saved" &&
            savedCharacters.map((char) => (
              <div
                key={char.id}
                style={{
                  border: "1px solid #d9e2ec",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                  background: "#f0f4f8",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <h4>{char.name}</h4>
                <button
                  onClick={() => deleteCharacter(char.id)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#e12d39",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar de BD
                </button>
              </div>
            ))}

          {view === "saved" && savedCharacters.length === 0 && (
            <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
              No tienes personajes guardados aún.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
