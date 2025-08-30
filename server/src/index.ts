import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import plantRoutes from "./routes/plants";
import reviewRoutes from "./routes/review";

// Импортируем ваши роуты
import authRouter from './routes/auth'

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// 1) JSON-парсер для body
app.use(express.json())

// 2) Cookie-парсер (если вы его используете)
app.use(cookieParser())

// 3) CORS с конкретным origin и credentials: true
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

// 3) Пинг сервера
app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is running')
})

// 4) Монтируем роуты
app.use('/api/auth', authRouter)
app.use("/api/plants", plantRoutes);
app.use("/api/reviews", reviewRoutes);



// 5) Глобальный error‐handler
app.use((
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

// 6) Подключаем Mongo и стартуем
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected')
    const port = process.env.PORT || 4000
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })
