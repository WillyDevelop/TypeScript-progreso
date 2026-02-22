import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; // 1. Importamos la magia de Prisma
import { error } from "node:console";

const prisma = new PrismaClient(); // 2. Encendemos el motor para hablar con AWS
const app = express();
const PORT = 3000;

app.use(express.json());

// RUTA 1: Para saber si el servidor vive
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Mi primer servidor TS está vivo! 🚀" });
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany(); 
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios en la nube" });
  }
});

//GET
app.get('/api/seed', async (req: Request, res: Response) => {
  try {
    await prisma.user.createMany({
      data: [
        { name: "Willy", email: "willy@dev.com" },
        { name: "Willy2", email: "willy@gmail.com" }
      ],
      skipDuplicates: true
    });
    res.status(200).json({ message: "Hack exitoso. Usuarios inyectados en AWS." });
  } catch (error) {
    res.status(500).json({ error: "Error inyectando datos" });
  }
});

//POST
app.post('/api/users', async (req: Request, res: Response) => {
  try{
    const { name, email } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email
      }
    });

    res.status(201).json(newUser);

  } catch (error) {
    res.status(201).json({
      error: "Error al crear usuario. ¿Quizás el email ya existe?"
    })
  }
})

//PUT
app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: name,
        email: email
      }
    });

    res.status(200).json(updatedUser);
  }catch (error) {
    res.status(500).json({
      erorr: "Error al actualizar. ¿Seguro que ese ID existe?"
    })
  }

})

//DELETE
app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try{
    const userId = parseInt(req.params.id as string);
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });
    
    res.status(200).json({
      message: "Usuario elimado exitosamente",
      user: deletedUser
    })
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar. ¿Seguro que el ID existe?"
    })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});