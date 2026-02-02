import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ message: "Pehle Login karein: Token nahi mila!" });
  }

  try {
    const verified = verifyToken(token);
    (req as any).user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token!" });
  }
};