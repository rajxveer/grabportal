# Grab-Reload-Reporting-Portal

This is a portal meant to report on Grab Reloads. 

Customer Service (CS) team are able to log-in to the portal with ready-made accounts. These accounts will come in 2 main forms, admin and user, The user account is the basic account and would be allowed to perform basic operations such as to view daily transaction details on Grab Reloads and export the reports in excel or csv formats, The admin account is the special account and would be allowed to perform special operations such as resending transaction related SMS and emails to customers as well as repushing transactions. 

After user/admin logs-in, they are greeted with a dashboard. The dashboard will display the information of the Grab Reloads in the form of data visualization with charts/graphs/tables. User/admin would be allowed to filter the dashboard by certain factors such as by dates, deno (RM30, RM50, RM100) and status (SUCCESS, FAILED, PENDING). User/admin may also search for transactions via the date, user phone number, user email, amount, status and transaction ID. 

The frontend of this portal is made with Vue.js (Vue 3 + Vite). 

The backend of this portal is made with Node.js which fetches data from a MySQL database. 
