const router = require("express").Router();
const userDB = require("../config/userDB");
const grabDB = require("../config/grabDB");
const XLSX = require("xlsx");
const path = require("path");
const jwt = require("jsonwebtoken");
const paginate = require("jw-paginate");
const fastcsv = require("fast-csv");
const fs = require("fs");

// http://localhost:8080/api/login
router.post("/login", async (req, res, next) => {
  // Capture the input fields
  let username = req.body.username;
  let password = req.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Retrive user data
    return await userDB
      .query("SELECT * FROM accounts WHERE username = '" + username + "'", {
        type: userDB.QueryTypes.SELECT,
      })
      .then((result) => {
        // No result is found
        if (result.length === 0) {
          return res.status(404).send({ message: "User Not Found" });
        } else if (result.length > 0 && result[0].password === password) {
          // Signed using secret key
          const token = jwt.sign({ id: result[0].username }, "secret", {
            expiresIn: "2h", // expires in 2 hours
          });
          res.send({ message: "success", token: token });
        } else {
          res.status(401).send({ message: "Incorrect password" });
        }
      });
  } else {
    res.status(401).send({
      message: "Please enter Username and Password!",
    });
  }
});

// http://localhost:8080/api/auth
router.get("/auth", async (req, res) => {
  const token = req.headers["authorization"];
  try {
    const claims = jwt.verify(token, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    } else {
      return await userDB
        .query("SELECT * FROM accounts WHERE username = '" + claims.id + "'", {
          type: userDB.QueryTypes.SELECT,
        })
        .then((result) => {
          return res.send({
            user: claims.id,
            message: "authenticated",
          });
        });
    }
  } catch (e) {
    return res.status(401).send({
      message: e,
    });
  }
});

// http://localhost:1000/api/logout
router.post("/logout", (req, res) => {
  res.send({
    message: "Logout Success",
  });
});

// http://localhost:1000/api/dashboard/getTotalCard
router.post("/dashboard/getTotalCard", async (req, res) => {
  let queryResult = [];
  // let dateNow = new Date();
  // let todayDate = dateNow.toISOString().slice(0, 10);
  // let defaultStartDate = new Date(
  //   dateNow.getFullYear(),
  //   dateNow.getMonth(),
  //   dateNow.getDate() - 29
  // )
  //   .toISOString()
  //   .slice(0, 10);
  let defaultEndDate = "2021-05-12";
  let defaultStartDate = "2021-04-12";
  let isDefault = req.body.isDefault;
  let filterStartDate = req.body.startDate;
  let filterEndDate = req.body.endDate;
  let condition = "";
  if (isDefault) {
    queryResult[0] = { startDate: defaultStartDate, endDate: defaultEndDate };
    condition +=
      "WHERE created_at BETWEEN '" +
      defaultStartDate +
      "%' AND '" +
      defaultEndDate +
      "%'";
  } else {
    queryResult[0] = { startDate: filterStartDate, endDate: filterEndDate };
    condition =
      "WHERE created_at BETWEEN '" +
      filterStartDate +
      "%' AND '" +
      filterEndDate +
      "%'";
  }
  let totalPayoutQuery =
    "SELECT SUM(amount_total) AS totalPayout FROM transactions " + condition;
  let totalCustomerQuery =
    "SELECT COUNT(DISTINCT user_email) AS totalCustomer FROM transactions " +
    condition;
  let totalTransactionQuery =
    "SELECT COUNT(*) AS totalTransaction FROM transactions " + condition;

  await grabDB
    .query(totalTransactionQuery, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      queryResult[1] = result[0];
    });
  await grabDB
    .query(totalPayoutQuery, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      queryResult[2] = result[0];
    });
  await grabDB
    .query(totalCustomerQuery, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      queryResult[3] = result[0];

      res.send(queryResult);
    });
});

// http://localhost:1000/api/dashboard/getStatusChart
router.post("/dashboard/getStatusChart", async (req, res) => {
  let queryResult = [];
  // let dateNow = new Date();
  // let todayDate = dateNow.toISOString().slice(0, 10);
  // let defaultStartDate = new Date(
  //   dateNow.getFullYear(),
  //   dateNow.getMonth(),
  //   dateNow.getDate() - 29
  // )
  //   .toISOString()
  //   .slice(0, 10);
  let defaultEndDate = "2021-05-12";
  let defaultStartDate = "2021-04-12";
  let isDefault = req.body.isDefault;
  let filterStartDate = req.body.startDate;
  let filterEndDate = req.body.endDate;
  let subQuery = "";
  if (isDefault) {
    queryResult[0] = { startDate: defaultStartDate, endDate: defaultEndDate };
    subQuery =
      "SELECT status FROM transactions WHERE created_at BETWEEN '" +
      defaultStartDate +
      "%' AND '" +
      defaultEndDate +
      "%'";
  } else {
    queryResult[0] = { startDate: filterStartDate, endDate: filterEndDate };
    subQuery =
      "SELECT status FROM transactions WHERE created_at BETWEEN '" +
      filterStartDate +
      "%' AND '" +
      filterEndDate +
      "%'";
  }
  let query =
    "SELECT COUNT(*) AS count, status FROM (" +
    subQuery +
    ") as T GROUP BY status";

  await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      let success = Object.values(result).find((obj) => {
        return obj.status == "SUCCESS";
      });
      let failed = Object.values(result).find((obj) => {
        return obj.status == "FAILED";
      });
      let pending = Object.values(result).find((obj) => {
        return obj.status == "PENDING";
      });
      queryResult[1] = { success: success, failed: failed, pending: pending };
      res.send(queryResult);
    });
});

// http://localhost:1000/api/dashboard/getAmountChart
router.post("/dashboard/getAmountChart", async (req, res) => {
  let queryResult = [];
  // let dateNow = new Date();
  // let todayDate = dateNow.toISOString().slice(0, 10);
  // let defaultStartDate = new Date(
  //   dateNow.getFullYear(),
  //   dateNow.getMonth(),
  //   dateNow.getDate() - 29
  // )
  //   .toISOString()
  //   .slice(0, 10);
  let defaultEndDate = "2021-05-12";
  let defaultStartDate = "2021-04-12";
  let isDefault = req.body.isDefault;
  let filterStartDate = req.body.startDate;
  let filterEndDate = req.body.endDate;
  let subQuery = "";
  if (isDefault) {
    queryResult[0] = { startDate: defaultStartDate, endDate: defaultEndDate };
    subQuery =
      "SELECT amount_value FROM transactions WHERE created_at BETWEEN '" +
      defaultStartDate +
      "%' AND '" +
      defaultEndDate +
      "%'";
  } else {
    queryResult[0] = { startDate: filterStartDate, endDate: filterEndDate };
    subQuery =
      "SELECT amount_value FROM transactions WHERE created_at BETWEEN '" +
      filterStartDate +
      "%' AND '" +
      filterEndDate +
      "%'";
  }
  let query =
    "SELECT COUNT(*) AS count, amount_value FROM (" +
    subQuery +
    ") as T GROUP BY amount_value";

  await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      let success = Object.values(result).find((obj) => {
        return obj.amount_value == 30;
      });
      let failed = Object.values(result).find((obj) => {
        return obj.amount_value == 50;
      });
      let pending = Object.values(result).find((obj) => {
        return obj.amount_value == 100;
      });
      queryResult[1] = { 30: success, 50: failed, 100: pending };
      res.send(queryResult);
    });
});

// http://localhost:1000/api/dashboard/getMIStatusChart
router.post("/dashboard/getMIStatusChart", async (req, res) => {
  let queryResult = [];
  // let dateNow = new Date();
  // let todayDate = dateNow.toISOString().slice(0, 10);
  // let thisWeekDate = new Date(
  //   dateNow.getFullYear(),
  //   dateNow.getMonth(),
  //   dateNow.getDate() - 6
  // )
  //   .toISOString()
  //   .slice(0, 10);
  let defaultEndDate = "2021-05-12";
  let defaultStartDate = "2021-04-12";
  let isDefault = req.body.isDefault;
  let filterStartDate = req.body.startDate;
  let filterEndDate = req.body.endDate;
  let subQuery = "";
  if (isDefault) {
    queryResult[0] = { startDate: defaultStartDate, endDate: defaultEndDate };
    subQuery =
      "SELECT novati_status FROM transactions WHERE created_at BETWEEN '" +
      defaultStartDate +
      "%' AND '" +
      defaultEndDate +
      "%'";
  } else {
    queryResult[0] = { startDate: filterStartDate, endDate: filterEndDate };
    subQuery =
      "SELECT novati_status FROM transactions WHERE created_at BETWEEN '" +
      filterStartDate +
      "%' AND '" +
      filterEndDate +
      "%'";
  }
  let query =
    "SELECT COUNT(*) AS count, novati_status FROM (" +
    subQuery +
    ") as T GROUP BY novati_status";

  await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      let success = Object.values(result).find((obj) => {
        return obj.novati_status == "SUCCESS";
      });
      let failed = Object.values(result).find((obj) => {
        return obj.novati_status == "FAILED";
      });
      let pending = Object.values(result).find((obj) => {
        return obj.novati_status == "PENDING";
      });
      queryResult[1] = { sucess: success, failed: failed, pending: pending };
      res.send(queryResult);
    });
});

// http://localhost:1000/api/dashboard/getMOPChart
router.post("/dashboard/getMOPChart", async (req, res) => {
  let queryResult = [];
  // let dateNow = new Date();
  // let todayDate = dateNow.toISOString().slice(0, 10);
  // let thisWeekDate = new Date(
  //   dateNow.getFullYear(),
  //   dateNow.getMonth(),
  //   dateNow.getDate() - 6
  // )
  //   .toISOString()
  //   .slice(0, 10);
  let defaultEndDate = "2021-05-12";
  let defaultStartDate = "2021-04-12";
  let isDefault = req.body.isDefault;
  let filterStartDate = req.body.startDate;
  let filterEndDate = req.body.endDate;
  let subQuery = "";
  if (isDefault) {
    queryResult[0] = { startDate: defaultStartDate, endDate: defaultEndDate };
    subQuery =
      "SELECT provider FROM transactions WHERE created_at BETWEEN '" +
      defaultStartDate +
      "%' AND '" +
      defaultEndDate +
      "%'";
  } else {
    queryResult[0] = { startDate: filterStartDate, endDate: filterEndDate };
    subQuery =
      "SELECT provider FROM transactions WHERE created_at BETWEEN '" +
      filterStartDate +
      "%' AND '" +
      filterEndDate +
      "%'";
  }
  let query =
    "SELECT COUNT(*) AS count, provider FROM (" +
    subQuery +
    ") as T GROUP BY provider";

  await grabDB
    .query(query, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      let paynet = Object.values(result).find((obj) => {
        return obj.provider == "paynet";
      });
      let KiplePay = Object.values(result).find((obj) => {
        return obj.provider == "KiplePay";
      });
      let cc = Object.values(result).find((obj) => {
        return obj.provider == "CC";
      });
      queryResult[1] = { paynet: paynet, KiplePay: KiplePay, CC: cc };
      res.send(queryResult);
      // res.send(result)
    });
});

// http://localhost:1000/api/history/getFilteredData/:page/
router.post("/history/getFilteredData/:page/", async (req, res, next) => {
  // example array of 150 items to be paged
  let items = [];
  let startDateFilter = req.body.transactionStartDate;
  let endDateFilter = req.body.transactionEndDate;
  let transactionIDFilter = req.body.transactionID;
  let userEmailFilter = req.body.userEmail;
  let userPhoneFilter = req.body.userPhone;
  let denoFilter = req.body.deno;
  let statusFilter = req.body.status;
  let dataQuery =
    "SELECT id,created_at,user_name,user_email,user_phone,amount_value,status,agent_transaction_id, novati_status, provider FROM transactions WHERE";
  // date filter is required for every query
  if (startDateFilter && endDateFilter) {
    dataQuery +=
      " created_at BETWEEN '" +
      startDateFilter +
      "%' AND '" +
      endDateFilter +
      "%'";
  } else if (startDateFilter) {
    dataQuery += " created_at LIKE '" + startDateFilter + "%'";
  }
  if (transactionIDFilter) {
    dataQuery += " AND id LIKE '%" + transactionIDFilter + "%'";
  }
  if (userEmailFilter) {
    dataQuery += " AND user_email LIKE '%" + userEmailFilter + "%'";
  }
  if (userPhoneFilter) {
    dataQuery += " AND user_phone LIKE '%" + userPhoneFilter + "%'";
  }
  if (denoFilter) {
    dataQuery += " AND amount_value = " + denoFilter;
  }
  if (statusFilter) {
    dataQuery += " AND status LIKE '" + statusFilter + "'";
  }

  await grabDB
    .query(dataQuery, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      items = Object.entries(result);
    });
  // get page from query params or default to first page
  const page = parseInt(req.params.page) || 1;

  // get pager object for specified page
  const pageSize = 50;
  const pager = paginate(items.length, page, pageSize);

  // get page of items from items array
  const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

  // return pager object and current page of items
  return res.send({ pager, pageOfItems });
});

// http://localhost:1000/api/export
router.post("/export", async (req, res) => {
  // example array of 150 items to be paged
  let items = [];
  let startDateFilter = req.body.transactionStartDate;
  let endDateFilter = req.body.transactionEndDate;
  let transactionIDFilter = req.body.transactionID;
  let userEmailFilter = req.body.userEmail;
  let userPhoneFilter = req.body.userPhone;
  let denoFilter = req.body.deno;
  let statusFilter = req.body.status;
  let isCSV = req.body.isCSV;
  let dataQuery =
    "SELECT id,created_at,user_name,user_email,user_phone,amount_value,status,agent_transaction_id, novati_status, provider FROM transactions WHERE";
  // date filter is required for every query
  if (startDateFilter && endDateFilter) {
    dataQuery +=
      " created_at BETWEEN '" +
      startDateFilter +
      "%' AND '" +
      endDateFilter +
      "%'";
  } else if (startDateFilter) {
    dataQuery += " created_at LIKE '" + startDateFilter + "%'";
  }
  if (transactionIDFilter) {
    dataQuery += " AND id LIKE '%" + transactionIDFilter + "%'";
  }
  if (userEmailFilter) {
    dataQuery += " AND user_email LIKE '%" + userEmailFilter + "%'";
  }
  if (userPhoneFilter) {
    dataQuery += " AND user_phone LIKE '%" + userPhoneFilter + "%'";
  }
  if (denoFilter) {
    dataQuery += " AND amount_value = " + denoFilter;
  }
  if (statusFilter) {
    dataQuery += " AND status LIKE '" + statusFilter + "'";
  }
  const convertToCSV = () => {
    const ws = fs.createWriteStream("transactionHistory.csv");
    fastcsv
      .write(dataExport, { headers: true })
      .on("finish", function () {
        const csvFilePath = path.join(__dirname, "../transactionHistory.csv");
        res.sendFile(csvFilePath, (err) => {
          if (err) console.log(err);
        });
      })
      .pipe(ws);
  };

  const convertToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(dataExport);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "dataExport");
    // Generate buffer
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    XLSX.writeFile(workBook, "transactionHistory.xlsx");
    const excelFilePath = path.join(__dirname, "../transactionHistory.xlsx");
    // console.log(excelFilePath);
    res.sendFile(excelFilePath, (err) => {
      if (err) console.log(err);
    });
  };
  await grabDB
    .query(dataQuery, {
      type: userDB.QueryTypes.SELECT,
    })
    .then((result) => {
      dataExport = result;
    });
  if (isCSV) {
    convertToCSV();
  } else {
    convertToExcel();
  }
});

module.exports = router;
