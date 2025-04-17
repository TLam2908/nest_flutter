const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPassword = async (password: string) => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error(error.message);
  }
};

export const comparePassword = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error(error.message); 
    }
}