# Instructions to run

1. VSCode is recommended to run this project. Download here: https://code.visualstudio.com/

2. Make sure you have Node.js installed on your machine. Download here: https://nodejs.org/en/download/

3. Create a new database in your MySQL local instance with the following queries:

      a) CREATE DATABASE IF NOT EXISTS `grabportallogin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
      b) USE `grabportallogin`;
      c) CREATE TABLE IF NOT EXISTS `accounts` (
         `id` int(11) NOT NULL AUTO_INCREMENT,
         `username` varchar(50) NOT NULL,
         `password` varchar(255) NOT NULL,
         `email` varchar(100) NOT NULL,
         PRIMARY KEY (`id`)
         ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
      d) INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');

4. Using the command line or terminal, navigate to the directory of the project(grabportal-main). Then enter the command "code ." which will open the project in VSCode.

5. In VSCode, edit the "/grabportal-main/backend/config/userDB.js" file to match the credentials of your MySQL local instance credentials. 
![image](https://user-images.githubusercontent.com/93634846/175802377-3bbde579-3d70-49c5-9c07-b78e9137439d.png)

6. Open the built-in terminal in VSCode and navigate to the "/grabportal-main/backend/" directory. Then enter the command "node index". In order for this step to work, you must be connected to ATX's VPN to access the database. 

7. Open the built-in terminal in VSCode and navigate to the "/grabportal-main/frontend/" directory. Then enter the command "npm run dev". If there is an error, enter the command "npm install" and try the previous command again. 

8. Finally, click on the link that appears after running the "npm run dev" command and log-in with the credentials "test" and "test". 




# Grab-Reload-Reporting-Portal

This is a portal meant to report on Grab Reloads. 

Customer Service (CS) team are able to log-in to the portal with ready-made accounts. These accounts will come in 2 main forms, admin and user, The user account is the basic account and would be allowed to perform basic operations such as to view daily transaction details on Grab Reloads and export the reports in excel or csv formats, The admin account is the special account and would be allowed to perform special operations such as resending transaction related SMS and emails to customers as well as repushing transactions. 

After user/admin logs-in, they are greeted with a dashboard. The dashboard will display the information of the Grab Reloads in the form of data visualization with charts/graphs/tables. User/admin would be allowed to filter the dashboard by certain factors such as by dates, deno (RM30, RM50, RM100) and status (SUCCESS, FAILED, PENDING). User/admin may also search for transactions via the date, user phone number, user email, amount, status and transaction ID. 

The frontend of this portal is made with Vue.js (Vue 3 + Vite). 

The backend of this portal is made with Node.js which fetches data from a MySQL database. 
