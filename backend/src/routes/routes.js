const router = require("express").Router();
const userDB = require("../config/userDB");
const grabDB = require("../config/grabDB");
const XLSX = require("xlsx");
const path = require("path");
const jwt = require("jsonwebtoken");
// const paginate = require("jw-paginate");
const fastcsv = require("fast-csv");
const fs = require("fs");
const JWTHelper = require("../helper/JWT.helper");
const { validateTransactionStat } = require("../validation/DashboardInput.validation");
const LocalDatetime = require("../helper/Date.helper");
const { start } = require("repl");
const paginate = require('sequelize-pagination');
const Transaction  = require('../models/transaction');
const {Op} = require("sequelize");
const { validateHisoryFilter, validateExportFilter } = require("../validation/HistoryInput.validation");
const moment = require('moment');
const { log } = require("console");


const jwtHelper = new JWTHelper();


// http://localhost:8080/api/login
router.post("/login", async (req, res, next) => {
  // Capture the input fields
  let username = req.body.username;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    try {
      const token = await jwtHelper.login(username, password);
      res.send({ message: "success", token: token });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  } else {
    res.status(400).send({
      message: "Please enter Username and Password!",
    });
  }
});

// http://localhost:8080/api/auth
router.post("/auth", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(400).send({
      message: "token not provided",
    });
  }
  try {
    const response = await jwtHelper.authenticate(token);
    return res.status(response.status).send({
      message: response.message,
      user: response.user,
    });
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});

// http://localhost:1000/api/logout
router.post("/logout", (req, res) => {
  jwt.
  res.send({
    message: "Logout Success",
  });
});

// http://localhost:1000/api/dashboard/getTotalCard
router.post("/dashboard/getTotalCard", async (req, res) => {
  let validationRes;
  try{
    validationRes = validateTransactionStat(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }

  // Data Query
  let condition = "WHERE created_at BETWEEN '" + startDate +"%' AND '" + endDate + "%'";
  
  let transactionStatQuery =
    "SELECT SUM(amount_total) AS totalPayout, COUNT(DISTINCT user_email) AS totalCustomer, COUNT(*) AS totalTransaction FROM transactions as t " + condition;

  let queryRes = await grabDB
    .query(transactionStatQuery, {
      type: userDB.QueryTypes.SELECT,
    })

  res.send({
    message: "success",
    data:queryRes[0],
    startDate: startDate,
    endDate: endDate
  });
  
});

// http://localhost:1000/api/dashboard/getStatusChart
router.post("/dashboard/getStatusChart", async (req, res) => {
  let validationRes;
  try{
    validationRes = validateTransactionStat(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }
  let subQuery =
      "SELECT status FROM transactions WHERE created_at BETWEEN '" +
      startDate +
      "%' AND '" +
      endDate +
      "%'";

  let query =
    "SELECT COUNT(*) AS count, status FROM (" +
    subQuery +
    ") as T GROUP BY status";

  let queryRes = await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })

  res.send({
    message: "success",
    data:{
      success: Object.values(queryRes).find((obj) => {
        return obj.status == "SUCCESS";
      }),
      failed: Object.values(queryRes).find((obj) => {
        return obj.status == "FAILED";
      }),
      pending: Object.values(queryRes).find((obj) => {
        return obj.status == "PENDING";
      }),
    },
    startDate: startDate,
    endDate: endDate
  });
});

// http://localhost:1000/api/dashboard/getAmountChart
router.post("/dashboard/getAmountChart", async (req, res) => {
  let validationRes;
  try{
    validationRes = validateTransactionStat(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }
  let subQuery =
      "SELECT amount_value FROM transactions WHERE created_at BETWEEN '" +
      startDate +
      "%' AND '" +
      endDate +
      "%'";
  
  let query =
    "SELECT COUNT(*) AS count, amount_value FROM (" +
    subQuery +
    ") as T GROUP BY amount_value";

  let queryRes = await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })
  let data = [];
  data.push(Object.values(queryRes).find((obj) => {
    return obj.amount_value == 10;
  }));
  data.push(Object.values(queryRes).find((obj) => {
    return obj.amount_value == 30;
  }));
  data.push(Object.values(queryRes).find((obj) => {
    return obj.amount_value == 50;
  }));

  res.send({
    message: "success",
    data: data.filter(item => item !== null),
    startDate: startDate,
    endDate: endDate
  });
});

// http://localhost:1000/api/dashboard/getMIStatusChart
router.post("/dashboard/getMIStatusChart", async (req, res) => {
  let validationRes;
  try{
    validationRes = validateTransactionStat(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }

  let subQuery = 
      "SELECT novati_status FROM transactions WHERE created_at BETWEEN '" +
      startDate +
      "%' AND '" +
      endDate +
      "%'";
 
  let query =
    "SELECT COUNT(*) AS count, novati_status FROM (" +
    subQuery +
    ") as T GROUP BY novati_status";

  let queryRes = await grabDB
      .query(query, {
        type: userDB.QueryTypes.SELECT,
      })

  res.send({
    message: "success",
    data:{
      success: Object.values(queryRes).find((obj) => {
        return obj.novati_status == "SUCCESS";
      }),
      failed: Object.values(queryRes).find((obj) => {
        return obj.novati_status == "FAILED";
      }),
      pending: Object.values(queryRes).find((obj) => {
        return obj.novati_status == "PENDING";
      }),
    },
    startDate: startDate,
    endDate: endDate
  });
});

// http://localhost:1000/api/dashboard/getMOPChart
router.post("/dashboard/getMOPChart", async (req, res) => {
 let validationRes;
  try{
    validationRes = validateTransactionStat(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }
  let subQuery = 
    "SELECT provider FROM transactions WHERE created_at BETWEEN '" +
    startDate +
    "%' AND '" +
    endDate +
    "%'";
 
  let query =
    "SELECT COUNT(*) AS count, provider FROM (" +
    subQuery +
    ") as T GROUP BY provider";

  let queryRes = await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    });

  res.send({
    message: "success",
    data:{
      paynet: Object.values(queryRes).find((obj) => {
        return obj.provider == "paynet";
      }),
      KiplePay: Object.values(queryRes).find((obj) => {
        return obj.provider == "KiplePay";
      }),
      CC: Object.values(queryRes).find((obj) => {
        return obj.provider == "CC";
      }),
    },
    startDate: startDate,
    endDate: endDate
  });
});

// http://localhost:1000/api/history/getFilteredData/:page/
router.post("/history/getFilteredData/:page/", async (req, res, next) => {
  let validationRes;
  try{
    validationRes = validateHisoryFilter(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }

  let where = {
    created_at: {
      [Op.between]: [startDate, endDate]
    }
  };

  console.log(validationRes);

  if(validationRes.transactionID && validationRes.transactionID.length !== 0){
    where.agent_transaction_id = validationRes.transactionID;
  }
  if(validationRes.userEmail && validationRes.userEmail.length !== 0){
    where.user_email = validationRes.userEmail;
  }
  if(validationRes.userPhone && validationRes.userPhone.length !== 0){
    where.user_phone = validationRes.userPhone;
  }
  if(validationRes.deno && validationRes.deno.length !== 0){
    where.amount_value = validationRes.deno;
  }
  if(validationRes.status && validationRes.status.length !== 0){
    where.status = validationRes.status;
  }

  // date filter is required for every query
  const page = req.params.page || 1;
  const pageSize = 200;

  const { count, rows } = await Transaction.findAndCountAll({
    attributes: [
      'id','created_at','updated_at','user_name','user_email','user_phone','amount_value','status','agent_transaction_id', 'novati_status', 'provider'
    ],
    offset: (page - 1) * pageSize,
    limit: pageSize,
    where: where,
    order: [ ['created_at', 'DESC'] ],
  });

  const totalPageCount = Math.ceil(count / pageSize);

  const list = [];

  if (totalPageCount <= 11) {
    for (let i = 1; i <= totalPageCount; i++) {
      list.push(i);
    }
  } else {
    if (page <= 6) {
      for (let i = 1; i <= 7; i++) {
        list.push(i);
      }
      list.push('...');
      for (let i = totalPageCount - 4; i <= totalPageCount; i++) {
        list.push(i);
      }
    } else if (page >= totalPageCount - 5) {
      for (let i = 1; i <= 4; i++) {
        list.push(i);
      }
      list.push('...');
      for (let i = totalPageCount - 6; i <= totalPageCount; i++) {
        list.push(i);
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        list.push(i);
      }
      list.push('...');
      for (let i = page - 2; i <= page + 2; i++) {
        list.push(i);
      }
      list.push('...');
      for (let i = totalPageCount - 2; i <= totalPageCount; i++) {
        list.push(i);
      }
    }
  }

  return res.json({
    totalPages: totalPageCount,
    totalItems: count,
    currentPage: page,
    pages: list,
    startIndex: (page-1) * pageSize,
    endIndex: (rows.length == 0) ? -1 : (page == totalPageCount) ? count - 1 : (page-1) * pageSize + pageSize,
    data: rows,
  });
});

// http://localhost:1000/api/export
router.post("/export", async (req, res) => {
  let validationRes;
  try{
    validationRes = validateExportFilter(req.body)
  }catch(e){
    return res.status(400).send({
      message: e.message.replace(/"/g, ''),
    });
  }

  let endDate = LocalDatetime.getCurrentDate();
  let startDate = LocalDatetime.getStartOfThisMonthDate();

  if(validationRes.startDate){
    startDate = validationRes.startDate;
  }
  if(validationRes.endDate){
    endDate = validationRes.endDate;
  }

  let where = {
    created_at: {
      [Op.between]: [startDate, endDate]
    }
  };

  console.log(validationRes);

  if(validationRes.transactionID && validationRes.transactionID.length !== 0){
    where.id = validationRes.transactionID;
  }
  if(validationRes.userEmail && validationRes.userEmail.length !== 0){
    where.user_email = validationRes.userEmail;
  }
  if(validationRes.userPhone && validationRes.userPhone.length !== 0){
    where.user_phone = validationRes.userPhone;
  }
  if(validationRes.deno && validationRes.deno.length !== 0){
    where.amount_value = validationRes.deno;
  }
  if(validationRes.status && validationRes.status.length !== 0){
    where.status = validationRes.status;
  }

  const data  = await Transaction.findAll({
    attributes: [
      'id','created_at','user_name','user_email','user_phone','amount_value','status','agent_transaction_id', 'novati_status', 'provider'
    ],
    where: where,
    order: [ ['created_at', 'ASC'] ],
  });

  const headers = [
    'Transaction ID',
    'Created At',
    'Updated At',
    // 'User Name',
    'User Email',
    'User Phone',
    'Amount Value',
    'Status',
    // 'Agent Transaction ID',
    'Novati Status',
    'Provider'
  ];

  
  const convertToCSV = (dataExport, res) => {
    const records = dataExport.map((transaction) => {
      return [
        String(transaction.agent_transaction_id),
        moment(transaction.created_at).format('YYYY-MM-DD HH:mm:ss'),
        moment(transaction.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        // transaction.user_name,
        String(transaction.user_email),
        String(transaction.user_phone),
        String(transaction.amount_value),
        String(transaction.status),
        // transaction.agent_transaction_id,
        String(transaction.novati_status),
        transaction.provider,
      ];
    });

    const csvFilePath = path.join(__dirname, '../transactionHistory.csv');
  
    const ws = fs.createWriteStream(csvFilePath);
    ws.on('error', (err) => {
      console.error(err);
      res.status(500).send('Failed to create CSV file');
    });

    console.log(csvFilePath);
  
    fastcsv
      .write([headers, ...records], { headers: true })
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('Failed to write data to CSV file');
      })
      .pipe(ws)
      .on('finish', () => {
        if (validationRes.fileType === "CSV") {
          res.sendFile(csvFilePath, (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Failed to send CSV file');
            }
          });
        }else{
          convertToXLSX(csvFilePath, res);
        }
      });
  };

  const convertToXLSX = (csvFilePath, res) => {
    const workbook = XLSX.readFile(csvFilePath);
    const dateStyle = { numFmt: 'yyyy-mm-dd hh:mm:ss' };

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    
    const timeColumns = ['B', 'C']; // Adjust these column letters as needed
    timeColumns.forEach((col) => {
      console.log(col)
      for (const cell in worksheet) {
        if (cell[0] === col) {
          
          if (worksheet[cell].t === 'n' && !isNaN(worksheet[cell].v)) {
            worksheet[cell].z = dateStyle.numFmt;
          }
        }
      }
    });
  });

    const xlsxFilePath = csvFilePath.replace('.csv', '.xlsx');
    XLSX.writeFile(workbook, xlsxFilePath);
    res.sendFile(xlsxFilePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to send XLSX file');
      } else {
        console.log(`XLSX file sent: ${xlsxFilePath}`);
      }
      // Delete the generated CSV and XLSX files
      fs.unlink(csvFilePath, (err) => {
        if (err) console.error(err);
        console.log(`CSV file deleted: ${csvFilePath}`);
      });
      fs.unlink(xlsxFilePath, (err) => {
        if (err) console.error(err);
        console.log(`XLSX file deleted: ${xlsxFilePath}`);
      });
    });
  };

  convertToCSV(data,res);
});

module.exports = router;
