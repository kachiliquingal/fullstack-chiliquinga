import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error conectando al backend:", err))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Hola Mundo Fullstack</h1>
      <p>Este frontend está dockerizado y ahora consume Rick and Morty.</p>
      
      <div style={{ background: '#f0f4f8', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', border: '1px solid #d9e2ec' }}>
        <h3 style={{ marginTop: 0, color: '#102a43' }}>Respuesta desde el Backend:</h3>
        
        {data ? (
          data.error ? (
            <p style={{ color: 'red' }}>Error: {data.error}</p>
          ) : (
            <>
              <p><strong>Mensaje del servidor:</strong> {data.message}</p>
              
              {/* Tarjeta del personaje */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img 
                  src={data.characterImage} 
                  alt={data.characterName} 
                  style={{ width: '80px', borderRadius: '50%' }} 
                />
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{data.characterName}</p>
                  <p style={{ margin: 0, color: '#627d98' }}>{data.characterSpecies}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#27ab83' }}>✓ Guardado en PostgreSQL</p>
                </div>
              </div>
            </>
          )
        ) : (
          <p style={{ color: '#627d98' }}>Cargando datos interdimensionales...</p>
        )}
      </div>
    </div>
  )
}

export default App