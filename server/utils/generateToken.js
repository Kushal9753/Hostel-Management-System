import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Since it's a backend API, we will just return the token to be used by the frontend.
  // Alternatively, you can set it as a cookie. Let's return it directly.
  return token;
};

export default generateToken;
