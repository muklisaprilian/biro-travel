const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    APP_PORT: process.env.APP_PORT ?? 6000,
    DB_HOST: process.env.DB_HOST ?? "localhost",
    DB_NAME: process.env.DB_NAME ?? "db_travel",
    DB_USER: process.env.DB_USER ?? "root",
    DIALECT: process.env.DB_DIALECT ?? "mysql",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "P@55w0rd",
    //
    // host : "localhost",
    // port : 3306,
    // user : "root",
    // password: "P@55w0rd",
    // database: "db_travel", 
    // dialect: "mysql",
    // key: "P$55w0rd$123",

    host : process.env.HOST,
    port : process.env.PORT,
    user : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    dialect: "mysql",
    key: "P$55w0rd$123",
}