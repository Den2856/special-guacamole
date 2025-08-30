import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Нет токена' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }
    ;(req as any).userId = payload.id
    next()
    return
  } catch {
    res.status(401).json({ message: 'Неверный токен' })
    return
  }
}
