const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "appdb",
  password: "password",
  port: 5432,
});

// Table for CRUD
pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS saved_characters (
    id SERIAL PRIMARY KEY,
    api_id INTEGER,
    name VARCHAR(255),
    species VARCHAR(255),
    image VARCHAR(255)
  )
`,
  )
  .then(() => console.log("Tabla 'saved_characters' lista para el CRUD"))
  .catch((err) => console.error("Error creando tabla", err));

// Retrieve the character list from the API
app.get("/api/characters", async (req, res) => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error obteniendo personajes de la API externa" });
  }
});

// It receives a character from the frontend and saves it in the database.
app.post("/api/saved", async (req, res) => {
  const { api_id, name, species, image } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO saved_characters (api_id, name, species, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [api_id, name, species, image],
    );
    res.json({ message: "¡Personaje guardado!", character: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error guardando en la base de datos" });
  }
});

// Bring all the characters saved in the database
app.get("/api/saved", async (req, res) => {
  try {
    // The newest one comes out first
    const result = await pool.query(
      "SELECT * FROM saved_characters ORDER BY id DESC",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error leyendo la base de datos" });
  }
});

// Delete a character from database using its internal ID
app.delete("/api/saved/:id", async (req, res) => {
  const dbId = req.params.id;
  try {
    await pool.query("DELETE FROM saved_characters WHERE id = $1", [dbId]);
    res.json({ message: "Personaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando de la base de datos" });
  }
});

app.listen(3000, () => {
  console.log("Backend corriendo en el puerto 3000 con CRUD completo");
});
