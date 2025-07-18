import express, { Request, Response } from "express"
import { GlobalErrorHandler } from "./error/GlobalErrorHandler"
import { notFound } from "./error/notFound"
const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})


// global error handler
app.use(GlobalErrorHandler)
// not found handler
app.use(notFound)

export default app