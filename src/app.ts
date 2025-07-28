import express from 'express'
import cors from 'cors'
import userRoute from './routes/userRoute'

const app = express()

app.use(cors());
app.use(express.json())

app.use('/api/users', userRoute)


export default app