const jwt = require('jsonwebtoken');

const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,        // 🔥 ALWAYS TRUE in production
    sameSite: 'None',    // 🔥 MUST BE CAPITAL N
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return token;
};

module.exports = generateToken;
