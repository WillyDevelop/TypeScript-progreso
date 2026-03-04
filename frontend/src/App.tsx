import { useState, useEffect } from 'react'

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // 1. NUEVO ESTADO: ¿Estamos editando a alguien? Guardamos su ID aquí.
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsers = () => {
    fetch('https://typescript-progreso.onrender.com/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. FUNCIÓN MEJORADA: Ahora decide si hacer POST (Crear) o PUT (Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      if (editingId) {
        // MODO EDICIÓN (PUT)
        const response = await fetch(`https://typescript-progreso.onrender.com/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          fetchUsers();
          cancelEdit(); // Limpiamos todo
        } else {
          alert("Error al actualizar el usuario");
        }
      } else {
        // MODO CREACIÓN (POST) - Lo que ya tenías
        const response = await fetch('https://typescript-progreso.onrender.com/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          fetchUsers();
          setName('');
          setEmail('');
        } else {
          alert("Error al crear. ¿El email ya existe?");
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const response = await fetch(`https://typescript-progreso.onrender.com/api/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 3. NUEVAS FUNCIONES: Para entrar y salir del modo edición
  const handleEditClick = (user: User) => {
    setEditingId(user.id); // Activamos el modo edición
    setName(user.name);    // Llenamos el input con su nombre
    setEmail(user.email);  // Llenamos el input con su email
  };

  const cancelEdit = () => {
    setEditingId(null); // Apagamos el modo edición
    setName('');
    setEmail('');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#646cff', textAlign: 'center' }}>Usuarios en AWS (Prisma)</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', gap: '10px', marginBottom: '30px', padding: '20px', 
        backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333',
        flexWrap: 'wrap' // Permite que los botones se acomoden bien
      }}>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: 'none', flex: 1, minWidth: '150px' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: 'none', flex: 1, minWidth: '150px' }}
        />
        
        {/* El botón cambia de color y texto dependiendo del modo */}
        <button type="submit" style={{ 
          padding: '10px 20px', backgroundColor: editingId ? '#4caf50' : '#646cff', 
          color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          {editingId ? "Actualizar" : "Agregar"}
        </button>

        {/* Botón de cancelar que solo aparece si estamos editando */}
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ 
            padding: '10px 20px', backgroundColor: '#555', color: 'white', 
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            Cancelar
          </button>
        )}
      </form>

      <div style={{ display: 'grid', gap: '10px' }}>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Cargando usuarios o lista vacía...</p>
        ) : (
          users.map(user => (
            <div key={user.id} style={{ 
              padding: '15px', border: '1px solid #444', borderRadius: '12px',
              backgroundColor: '#242424', color: 'white', display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#646cff' }}>{user.name}</h3>
                <p style={{ margin: 0, opacity: 0.8 }}>{user.email}</p>
              </div>
              
              {/* Contenedor para los botones de acción */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEditClick(user)}
                  style={{
                    backgroundColor: '#ffa500', color: 'white', border: 'none',
                    padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  style={{
                    backgroundColor: '#ff4a4a', color: 'white', border: 'none',
                    padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App