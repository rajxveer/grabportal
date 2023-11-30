const Sequelize = require("sequelize");

module.exports = new Sequelize(
  "grab_driver_portal_staging",
  "gpuser",
  "b2f6566#11c40faddb332acc!",
  {
    host: "main-db-production.c0ce0dazixkg.ap-southeast-1.rds.amazonaws.com",
    port: "3306",
    dialect: "mysql",
    
  }
);
