import * as jwt from 'jsonwebtoken';
import 'dotenv';
import userInterface from '../interfaces/userInterface';

const JWT_SECRET = process.env.JWT_SECRET as string;

const validateToken = (token: string) => {
  const verifyToken = jwt.verify(token, JWT_SECRET) as userInterface;
  console.log('verifyToken', verifyToken);
  return verifyToken;
};

export default validateToken;
