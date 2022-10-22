import UserModel from '../database/models/User.Model';
import userInterface from '../interfaces/userInterface';

class UserService {
  private model = UserModel;

  public async login(email: string): Promise<userInterface> {
    const result = await this.model.findOne({ where: { email }, raw: true }) as userInterface;

    return result as unknown as userInterface;
  }
}

export default UserService;
