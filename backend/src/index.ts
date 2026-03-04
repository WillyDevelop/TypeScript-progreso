import express from "express";
import cors from "cors"; // 1. Importamos la librería de permisos
import userRoutes from "./routes/userRoutes.js";

const app = express();
// Le decimos: "Usa el puerto que me dé el servidor en la nube, o el 3000 si estoy en mi PC"
const PORT = process.env.PORT || 3000;

app.use(cors()); // 2. ¡ESTA ES LA LLAVE! Abre la puerta a tu frontend
app.use(express.json());

// Tus rutas van después del cors
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor con CORS activo en http://localhost:${PORT}`);
});