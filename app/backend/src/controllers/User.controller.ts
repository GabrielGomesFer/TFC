import { Request, response, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;

class UserController {
  constructor(private userService = new UserService()) {}
  public login = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.login(email);

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { algorithm: 'HS256', expiresIn: '1d' },
    );

    console.log(token);
    return res.status(200).json({ token });
  };

  public validateRole = async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const role = this.userService.validateRole(token as string);

    return response.status(200).json(role);
  };
}

export default UserController;
