import User from './User.Model';

(async () => {
  const users = await User.findAll();
  console.log(users);
  process.exit(0);
})();
