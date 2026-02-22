import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; // 1. Importamos la magia de Prisma

const prisma = new PrismaClient(); // 2. Encendemos el motor para hablar con AWS
const app = express();
const PORT = 3000;

app.use(express.json());

// RUTA 1: Para saber si el servidor vive
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Mi primer servidor TS está vivo! 🚀" });
});

// RUTA 2: Tu nueva ruta REAL que busca datos en AWS
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany(); 
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios en la nube" });
  }
});

// RUTA SECRETA: Nuestro Hack para inyectar a Willy y a Rodri
app.get('/api/seed', async (req: Request, res: Response) => {
  try {
    await prisma.user.createMany({
      data: [
        { name: "Willy", email: "willy@dev.com" },
        { name: "Rodri", email: "rodri@gmail.com" }
      ],
      skipDuplicates: true
    });
    res.status(200).json({ message: "¡Hack exitoso! Usuarios inyectados en AWS." });
  } catch (error) {
    res.status(500).json({ error: "Error inyectando datos" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});