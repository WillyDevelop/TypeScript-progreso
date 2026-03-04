import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Exportamos cada función por separado
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({ data: { name, email } });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar. ¿Existe el ID?" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ message: "Usuario eliminado", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar. ¿Existe el ID?" });
  }
};