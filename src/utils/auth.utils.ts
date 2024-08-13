import * as bcrypt from 'bcrypt';

const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hashSync(password, salt);
};

const validatePassword = async (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export { generateHash, validatePassword };
