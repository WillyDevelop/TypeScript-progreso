import express, {type Request, type Response} from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Willy", email: "willy@dev.com" },
  { id: 2, name: "Ana", email: "ana@dev.com" }
];

app.get('/api/health', (req: Request, res: Response) => {
       res.status(200).json({ status: "ok", message: "Mi primer servidor TS está vivo!"})
 })

 app.get('/api/users', (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.listen(PORT, () => {
        console.log(`servidor escuchando en http://localhost:${PORT}`)
    })
