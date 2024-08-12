import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import JWT_PASSWORD from '../config';

// Extend the Request interface to include userId
interface CustomRequest extends Request {
  userId?: string;
}

async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    
    // Check for Authorization header and Bearer scheme
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(403).json("Authorization header missing or invalid format");
      return; // Exit after sending response
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string };
      req.userId = decoded.userId;
      next(); // Proceed to next middleware
    } catch (error) {
      // Handle token verification errors
      res.status(401).json({ message: "Not authenticated" });
      return; // Exit after sending response
    }
  }

export { authMiddleware };
