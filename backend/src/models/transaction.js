const { Model,DataTypes,Sequelize } = require('sequelize');
const grabDB = require("../config/grabDB");

const sequelize = new Sequelize(
    "grab_driver_mirror",
    "gpuser",
    "b2f6566#11c40faddb332acc!",
    {
      host: "main-db-production.c0ce0dazixkg.ap-southeast-1.rds.amazonaws.com",
      port: "3306",
      dialect: "mysql",
      
    }
  );

class Transaction extends Model {}
Transaction.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  agent_transaction_id: { type: DataTypes.STRING, allowNull: false },
  currency_id: { type: DataTypes.STRING },
  amount_value: { type: DataTypes.DOUBLE, allowNull: false },
  amount_total: { type: DataTypes.DOUBLE },
  amount_cashback: { type: DataTypes.DOUBLE },
  amount_tax: { type: DataTypes.DOUBLE },
  user_id: { type: DataTypes.INTEGER },
  user_name: { type: DataTypes.STRING },
  user_email: { type: DataTypes.STRING },
  user_dialcode: { type: DataTypes.STRING },
  user_phone: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
  pin: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  product_code: { type: DataTypes.STRING },
  novati_status: { type: DataTypes.STRING },
  provider: { type: DataTypes.STRING },
  bank: { type: DataTypes.STRING },
  is_resubmit: { type: DataTypes.TINYINT, allowNull: false },
  resubmit_at: { type: DataTypes.DATE },
}, {
    sequelize,
  modelName: 'Transaction',
  timestamps: true,
  underscored: true,
  tableName: 'transactions', 
});

module.exports = Transaction;