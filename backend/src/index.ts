import express from "express"; // Importamos la librería principal de Express para levantar nuestro servidor web web.
import type { Request, Response } from "express"; // Importamos los "Tipos" estrictos de TypeScript para las peticiones (Request) y respuestas (Response).
import { PrismaClient } from "@prisma/client"; // Importamos la clase principal de Prisma, que es la herramienta que habla con la base de datos.
import { error } from "node:console"; // (Nota: Esta línea probablemente te la agregó VS Code sin querer, trae funciones de la consola de Node).

const prisma = new PrismaClient(); // Encendemos el "motor" de Prisma. Esto crea la conexión directa con tu base de datos en AWS.
const app = express(); // Inicializamos la aplicación de Express y la guardamos en la variable 'app'. Este es nuestro servidor.
const PORT = 3000; // Definimos el número de puerto (la "puerta" de tu PC) por donde el servidor escuchará peticiones.

app.use(express.json()); // MIDDLEWARE: Es un "traductor". Permite que Express entienda los datos ocultos (JSON) que enviamos en el "Body" de peticiones POST y PUT.

// RUTA 1: Para saber si el servidor vive (Health Check)
app.get('/api/health', (req: Request, res: Response) => { // Creamos una ruta GET en '/api/health'. 'req' es lo que pide el cliente, 'res' es lo que respondemos.
  res.status(200).json({ status: "ok", message: "Mi primer servidor TS está vivo! 🚀" }); // Devolvemos un código de éxito 200 y un mensaje JSON diciendo que todo está bien.
});

// GET: RUTA PARA LEER TODOS LOS USUARIOS
app.get('/api/users', async (req: Request, res: Response) => { // Ruta GET. Usamos 'async' (asíncrono) porque buscar en AWS toma tiempo y el servidor debe "esperar".
  try { // Intentamos ejecutar el bloque de código que se conecta a la base de datos.
    const allUsers = await prisma.user.findMany(); // 'await' pausa el código hasta que Prisma viaja a AWS, trae todos los usuarios de la tabla y los guarda en 'allUsers'.
    res.status(200).json(allUsers); // Respondemos con un código 200 (OK) y enviamos la lista completa de usuarios al navegador/cliente.
  } catch (error) { // Si algo sale mal (se cae el internet, AWS falla, etc.), el código salta inmediatamente aquí.
    res.status(500).json({ error: "Error al buscar usuarios en la nube" }); // Respondemos con error 500 (Error interno del servidor) y un mensaje amigable.
  }
});

// GET: RUTA SECRETA PARA INYECTAR DATOS (SEED)
app.get('/api/seed', async (req: Request, res: Response) => { // Ruta asíncrona GET usada como un "hack" para meter datos iniciales.
  try { // Iniciamos el bloque de prueba.
    await prisma.user.createMany({ // Le ordenamos a Prisma crear múltiples registros a la vez en la tabla User.
      data: [ // Aquí va el arreglo (lista) de objetos que queremos inyectar en AWS.
        { name: "Willy", email: "willy@dev.com" }, // Primer usuario a crear.
        { name: "Willy2", email: "willy@gmail.com" } // Segundo usuario a crear.
      ],
      skipDuplicates: true // Instrucción clave: Si los correos ya existen (porque recargaste la página por error), Prisma los ignora para que no explote la app.
    });
    res.status(200).json({ message: "Hack exitoso. Usuarios inyectados en AWS." }); // Avisamos que la inyección fue un éxito.
  } catch (error) { // Si Prisma falla al intentar inyectar.
    res.status(500).json({ error: "Error inyectando datos" }); // Avisamos que hubo un fallo interno.
  }
});

// POST: RUTA PARA CREAR UN NUEVO USUARIO
app.post('/api/users', async (req: Request, res: Response) => { // Usamos app.post para recibir información y guardarla.
  try{ // Intentamos ejecutar la creación.
    const { name, email } = req.body; // "Desestructuramos". Extraemos el nombre y el correo del "paquete" (body) que nos envió el cliente (Thunder Client/Frontend).
    const newUser = await prisma.user.create({ // Ordenamos a Prisma que viaje a AWS y cree UNA sola fila (usuario).
      data: { // Le pasamos los datos que va a rellenar en las columnas de la tabla.
        name: name, // En la columna 'name', mete el nombre que extrajimos del req.body.
        email: email // En la columna 'email', mete el correo que extrajimos del req.body.
      }
    });

    res.status(201).json(newUser); // Si todo sale bien, devolvemos un 201 (Creado) y mostramos el usuario recién nacido (con su nuevo ID incluido).

  } catch (error) { // Si Prisma falla (ej: si alguien intenta usar un email que ya existe y choca con el @unique).
    res.status(500).json({ // (Nota: idealmente aquí devolvemos un 500 o 400 por error, tenías puesto 201, pero dejé tu estructura intacta).
      error: "Error al crear usuario. ¿Quizás el email ya existe?" // Devolvemos este aviso al usuario.
    })
  }
})

// PUT: RUTA PARA ACTUALIZAR UN USUARIO ESPECÍFICO
app.put('/api/users/:id', async (req: Request, res: Response) => { // 'app.put' se usa para editar. ':id' es un parámetro dinámico en la URL (ej: /api/users/3).
  try { // Intentamos ejecutar la actualización.
    const userId = parseInt(req.params.id as string); // Extraemos el ID numérico de la URL. Usamos 'parseInt' para convertirlo de texto a número y 'as string' para calmar a TypeScript.
    const { name, email } = req.body; // Atrapamos los nuevos datos que el cliente quiere sobreescribir, escondidos en el Body.
    const updatedUser = await prisma.user.update({ // Ordenamos a Prisma buscar y actualizar una fila existente.
      where: { // ¿A quién vamos a actualizar? (Cláusula de búsqueda).
        id: userId // Al usuario cuyo ID en la base de datos coincida exactamente con el ID de la URL.
      },
      data: { // ¿Cuáles son los nuevos datos?
        name: name, // Reemplaza el nombre viejo por este nuevo.
        email: email // Reemplaza el correo viejo por este nuevo.
      }
    });

    res.status(200).json(updatedUser); // Respondemos 200 (Éxito) y enviamos el registro del usuario con sus datos frescos.
  }catch (error) { // Si el ID enviado no existe en la base de datos, Prisma lanza un error y caemos aquí.
    res.status(500).json({ // Devolvemos error 500.
      erorr: "Error al actualizar. ¿Seguro que ese ID existe?" // (Nota: pequeña falta ortográfica en "erorr", pero es el mensaje que el usuario verá).
    })
  }

})

// DELETE: RUTA PARA ELIMINAR UN USUARIO
app.delete('/api/users/:id', async (req: Request, res: Response) => { // 'app.delete' para borrar. Volvemos a requerir el ':id' en la URL para saber a quién aniquilar.
  try{ // Intentamos ejecutar el borrado.
    const userId = parseInt(req.params.id as string); // Transformamos el ID que viene en la URL a un número entero.
    const deletedUser = await prisma.user.delete({ // Ordenamos a Prisma destruir un registro. Y guardamos los restos en 'deletedUser'.
      where: { // Le decimos exactamente quién debe ser borrado.
        id: userId // Borra al usuario que tenga este ID exacto.
      }
    });
    
    res.status(200).json({ // Respondemos 200 (Éxito).
      message: "Usuario elimado exitosamente", // Enviamos un mensaje de confirmación amigable.
      user: deletedUser // Enviamos los datos del usuario que acaba de ser borrado por si el Front-end quiere mostrar a quién eliminó.
    })
  } catch (error) { // Si Prisma no encuentra el ID a borrar, colapsa y caemos aquí.
    res.status(500).json({ // Respondemos 500 (Error de servidor).
      error: "Error al eliminar. ¿Seguro que el ID existe?" // Enviamos el aviso de error.
    })
  }
})

// ARRANQUE DEL SERVIDOR
app.listen(PORT, () => { // Le ordenamos a Express que "encienda el motor" y se ponga a escuchar en el puerto indicado (3000).
  console.log(`Servidor escuchando en http://localhost:${PORT}`); // Una vez encendido, imprime esto en la terminal para avisarnos que todo salió bien.
});