import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;

class UserController {
  constructor(private userService = new UserService()) {}
  public login = async (req: Request, res: Response) => {
    // console.log('ta funcionando');
    const { email } = req.body;
    const user = await this.userService.login(email);

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { algorithm: 'HS256', expiresIn: '1d' },
    );

    return res.status(200).json(token);
  };
}

export default UserController;
