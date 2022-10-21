import * as jwt from 'jsonwebtoken';
import * as bycrypt from 'bcryptjs';
import UserModel from '../database/models/User.Model';
import tokenInterface from '../interfaces/tokenInterface';
import userInterface from '../interfaces/userInterface';
import 'dotenv/config';

const secret = process.env.JWT_SECRET as string;

class UserService {
  private model = UserModel;

  public async login(email: string, password: string): Promise<tokenInterface> {
    const user = await this.model.findOne({ where: { email }, raw: true }) as userInterface;

    if (!bycrypt.compareSync(password, user.password)) {
    //   return null;
    }

    // const config = {
    // //   expiresIn: '1d',
    //   algorithm: 'HS256',
    // };

    const token = jwt.sign(email, secret);
    return token as unknown as tokenInterface;
  }
}

export default UserService;
