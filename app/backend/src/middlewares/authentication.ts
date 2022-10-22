import { Request, Response, NextFunction } from 'express';
import * as bycrypt from 'bcryptjs';
import UserService from '../services/UserService';

const userService = new UserService();

async function loginAut(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  const user = await userService.login(email);

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const cryptPassword = await bycrypt.compare(password, user.password);

  if (!cryptPassword) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  next();
}

export default loginAut;
