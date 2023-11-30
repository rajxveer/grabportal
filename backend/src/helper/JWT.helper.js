const jwt = require("jsonwebtoken");
const userDB = require("../config/userDB");

class JWTHelper{
    async authenticate(token) {
        const claims = jwt.verify(token, "secret");
        console.log("claims");
        if (!claims) {
            return {
            status: 400,
            message: "unauthenticated",
            };
        } else {
            const result = await userDB.query(
                "SELECT * FROM grab_report_acc WHERE username = '" + claims.id + "'",
                {
                    type: userDB.QueryTypes.SELECT,
                }
            );
            if (!result || result.length === 0) {
                return {
                    status: 400,
                    message: "user not found",
                };
            } else {
            return {
                status: 200,
                user: claims.id,
                message: "success",
            };
            }
        }
    }

    async login(username, password) {
        const result = await userDB.query(
          "SELECT * FROM grab_report_acc WHERE username = ?",
          {
            replacements: [username],
            type: userDB.QueryTypes.SELECT,
          }
        );
    
        if (result.length === 0) {
          throw new Error("User not found");
        } else if (result.length > 0 && result[0].password === password) {
          const token = jwt.sign({ id: result[0].username }, "secret", {
            expiresIn: "2h",
          });
          return token;
        } else {
          throw new Error("Incorrect password");
        }
    }
}

module.exports = JWTHelper;