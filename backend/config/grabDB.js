const Sequelize = require("sequelize");

module.exports = new Sequelize(
  "grab_driver_mirror",
  "gpuser",
  "b2f6566#11c40faddb332acc!",
  {
    host: "main-db-production.c0ce0dazixkg.ap-southeast-1.rds.amazonaws.com",
    port: "3306",
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);
