import express from 'express'
import cors from 'cors'
import userRoute from './routes/userRoute'
import authRoute from "./routes/authRoute"

const app = express()

app.use(cors());
app.use(express.json())

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)


export default app