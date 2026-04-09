const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'appdb',
  password: 'password',
  port: 5432,
});

pool.query('CREATE TABLE IF NOT EXISTS external_data (id SERIAL PRIMARY KEY, info TEXT)')
  .then(() => console.log("Tabla 'external_data' lista"))
  .catch(err => console.error("Error creando tabla", err));

app.get('/api/data', async (req, res) => {
  try {
    // 1. Consumir la API de Rick and Morty (Personaje 1: Rick Sanchez)
    const apiResponse = await fetch('https://rickandmortyapi.com/api/character/1');
    const apiData = await apiResponse.json();
    
    // Armamos un string para guardar en nuestra base de datos
    const infoToSave = `${apiData.name} - ${apiData.species}`;
    
    // 2. Guardar en BD
    await pool.query('INSERT INTO external_data (info) VALUES ($1)', [infoToSave]);

    // 3. Responder al frontend con más datos (incluyendo la imagen)
    res.json({ 
      message: "¡Hola Mundo desde el Backend Fullstack!", 
      characterName: apiData.name,
      characterSpecies: apiData.species,
      characterImage: apiData.image
    });
  } catch (error) {
    // Si algo falla, el error real se imprime en la terminal del contenedor
    console.error("Error interno detallado:", error); 
    res.status(500).json({ error: "Algo falló en el servidor interno" });
  }
});

app.listen(3000, () => {
  console.log('Backend corriendo en el puerto 3000');
});