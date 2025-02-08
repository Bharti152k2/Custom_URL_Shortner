const register = (req, res) => {
  res.send("regiter api");
};
const login = (req, res) => {
  res.send("login api");
};
module.exports = {
  register,
  login,
};
