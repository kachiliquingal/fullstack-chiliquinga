import { useState, useEffect } from "react";
import CharacterCard from "./components/CharacterCard"; 

function App() {
  const [characters, setCharacters] = useState([]);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [view, setView] = useState("explore");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Load saved characters as soon as you open the app
  useEffect(() => {
    fetch("/api/saved")
      .then((res) => res.json())
      .then((data) => setSavedCharacters(data))
      .catch((err) => console.error(err));
  }, []);

  const fetchAPICharacters = (currentPage, search) => {
    setLoading(true);
    fetch(`/api/characters?page=${currentPage}&name=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.results || []);
        setTotalPages(data.info ? data.info.pages : 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (view === "explore") {
      fetchAPICharacters(page, searchTerm);
    }
  }, [page, view]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAPICharacters(1, searchTerm);
  };

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
    })
      .then((res) => res.json())
      .then((data) => {
        // Add the character to the local state to instantly lock the button
        setSavedCharacters((prev) => [data.character, ...prev]);
        setMessage(`¡${char.name} guardado!`);
        setTimeout(() => setMessage(""), 2000);
      });
  };

  const deleteCharacter = (char) => {
    fetch(`/api/saved/${char.id}`, { method: "DELETE" }).then(() => {
      setSavedCharacters((prev) => prev.filter((c) => c.id !== char.id));
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
        <h1 style={{ color: "#102a43" }}>Directorio Rick and Morty</h1>

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
            Ver Base de Datos
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
              marginBottom: "15px",
            }}
          >
            {message}
          </div>
        )}

        {view === "explore" && (
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Buscar personaje (Ej. Rick)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px",
                width: "250px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Buscar
            </button>
          </form>
        )}
      </header>

      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando datos...</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {view === "explore" &&
              characters.map((char) => {
                // Check if the current character's API_ID already exists in the database
                const isSaved = savedCharacters.some(
                  (savedChar) => savedChar.api_id === char.id,
                );

                return (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    actionLabel={isSaved ? "Guardado en BD" : "Guardar"}
                    actionColor="#27ab83"
                    onAction={saveCharacter}
                    disabled={isSaved}
                  />
                );
              })}

            {view === "saved" &&
              savedCharacters.map((char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  actionLabel="Eliminar de BD"
                  actionColor="#e12d39"
                  onAction={deleteCharacter}
                />
              ))}
          </div>

          {view === "explore" && characters.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "30px" }}>
              No se encontraron personajes con ese nombre.
            </p>
          )}
          {view === "saved" && savedCharacters.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "30px" }}>
              No tienes personajes guardados aún.
            </p>
          )}

          {view === "explore" && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "40px",
                gap: "15px",
              }}
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "10px 20px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  background: "#d9e2ec",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                ← Anterior
              </button>
              <span style={{ fontWeight: "bold", color: "#102a43" }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "10px 20px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  background: "#d9e2ec",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
