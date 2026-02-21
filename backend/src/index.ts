 
 
 app.get('/api', (req: Request, res: Response) => {
    res.json({
        message: "Hola desde la API con TypeScript y Express"
        status: "succes"
    })
 })