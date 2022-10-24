import validateToken from '../utils/validateToken';
import UserModel from '../database/models/User.Model';
import userInterface from '../interfaces/userInterface';

class UserService {
  private model = UserModel;

  public async login(email: string): Promise<userInterface> {
    const result = await this.model.findOne({ where: { email }, raw: true }) as userInterface;

    return result as unknown as userInterface;
  }

  public validateRole = async (token: string) => {
    const result = validateToken(token);
    // console.log('Result service', result);
    return result;
  };
}
export default UserService;
