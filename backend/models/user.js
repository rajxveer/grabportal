const Sequelize = require("sequelize");

const db = require("../config/database");

const UserModel = db.define("accounts", {
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
});

module.exports = UserModel;
