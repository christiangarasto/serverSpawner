const bcrypt = require("bcryptjs");

const showPasswordHashed = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("SSGuest_2024", salt);
  console.log(password);
};

showPasswordHashed();
