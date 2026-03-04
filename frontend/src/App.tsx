import { useState, useEffect } from 'react'

// Definimos qué forma tiene un Usuario para que TS no se queje
interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  // Aquí guardaremos los usuarios que vengan del backend
  const [users, setUsers] = useState<User[]>([]);

  // useEffect se ejecuta apenas carga la página
  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error conectando con el backend:", error));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#646cff' }}>Usuarios en AWS (Prisma)</h1>
      
      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {users.length === 0 ? (
          <p>Cargando usuarios o lista vacía...</p>
        ) : (
            users.map(user => (
              <div key={user.id} style={{ 
                padding: '15px', 
                border: '1px solid #444', 
                borderRadius: '12px',
                backgroundColor: '#242424', // Fondo oscuro para que resalte
                color: 'white',             // Letras blancas
                textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#646cff' }}>{user.name}</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>{user.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App