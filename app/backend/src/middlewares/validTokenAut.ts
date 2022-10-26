import { NextFunction, Response, Request } from 'express';
import validateToken from '../utils/validateToken';

const validTokenAut = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const errorMessage = 'Token must be a valid token';
  try {
    if (!token) {
      return res.status(401).json({ message: errorMessage });
    }

    const verifiedToken = validateToken(token as string);

    if (!verifiedToken) {
      return res.status(401).json({ message: errorMessage });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: errorMessage });
  }
};

export default validTokenAut;
