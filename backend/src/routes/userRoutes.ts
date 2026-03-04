import { Router } from "express";
// Añadimos las nuevas funciones al import
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js"; 

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);    // El ID viene después de /api/users/
router.delete("/:id", deleteUser); // El ID viene después de /api/users/

export default router;

