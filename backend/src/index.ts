import express, {type Request, type Response} from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
       res.status(200).json({ status: "ok", message: "Mi primer servidor TS está vivo!"})
 })

app.listen(PORT, () => {
        console.log(`servidor escuchando en http://localhost:${PORT}`)
    })
