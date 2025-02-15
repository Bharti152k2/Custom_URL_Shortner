

const register = async (req, res) => {
  console.log("register");
};
const login = (req, res) => {
  res.send("login api");
};
module.exports = {
  register,
  login,
};
