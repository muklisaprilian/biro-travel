const mysql = require("mysql2/promise");
const { Client } = require('pg');
const format = require("date-format");
const config = require("../config");
const { escape } = require("mysql2/promise");
const { KeiLog } = require("../lib/Logger");

const createConnection = async () => {
  return await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
  });

  // const client = new Client({
  //   host: config.host,
  //   port: config.port,
  //   user: config.user,
  //   password: config.password,
  //   database: config.database
  // });

  // try {
  //   await client.connect();
  //   console.log('Connected to PostgreSQL');
  //   return client;
  // } catch (error) {
  //   console.error('Connection to PostgreSQL failed:', error);
  //   throw error;
  // }
};

const executeQuery = async (query) => {
  const conn = await createConnection();
  const [rows] = await conn.query(query);
  await conn.end();
  return rows;
};

const getFormattedDate = (date) => {
  return format("yyyy-MM-dd", date);
};
const getFormattedDatetime = (date) => {
  return format("yyyy-MM-dd hh:mm:ss", date);
};
const getFormattedMonth = (date) => {
  return format("yyMM", date);
};


// DDL
const createTableUsers = async () => {
  const query = `CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL auto_increment,
  first_name varchar(55) DEFAULT NULL,
  last_name varchar(55) DEFAULT NULL,
  email varchar(55) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  isActive tinyint(1) DEFAULT 0,
  role enum('user','staff','admin') NOT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTableCategories = async () => {
  const query = `CREATE TABLE IF NOT EXISTS categories (
  id int(11) NOT NULL auto_increment,
  nama varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTableCities = async () => {
  const query = `CREATE TABLE IF NOT EXISTS cities (
  id int(11) NOT NULL auto_increment,
  nama varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTableDestinations = async () => {
  const query = `CREATE TABLE IF NOT EXISTS destinations (
  id int(11) NOT NULL auto_increment,
  category_id int(11) DEFAULT NULL,
  nama varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTableOrder = async () => {
  const query = `CREATE TABLE IF NOT EXISTS orders (
  id int(11) NOT NULL auto_increment,
  packages_id int(11) DEFAULT NULL,
  user_id int(11) DEFAULT NULL,
  telp varchar(55) DEFAULT NULL,
  status varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTablePackages = async () => {
  const query = `CREATE TABLE IF NOT EXISTS packages (
  id int(11) NOT NULL auto_increment,
  city_id int(11) DEFAULT NULL,
  nama varchar(55) DEFAULT NULL,
  peserta varchar(55) DEFAULT NULL,
  durasi varchar(55) DEFAULT NULL,
  harga varchar(55) DEFAULT NULL,
  gambar varchar(55) DEFAULT NULL,
  jumlah varchar(55) DEFAULT NULL,
  start_date varchar(55) DEFAULT NULL,
  end_date varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}
const createTablePackagesdetail = async () => {
  const query = `CREATE TABLE IF NOT EXISTS packages_detail (
  id int(11) NOT NULL auto_increment,
  packages_id int(11) DEFAULT NULL,
  destination_id int(11) DEFAULT NULL,
  fasilitas varchar(55) DEFAULT NULL,
  status varchar(55) DEFAULT NULL,
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
  return await executeQuery(query);
}

//
const getOrderById = async (id) => {
  const query = `SELECT * FROM orders WHERE user_id='${id}'`;
  return await executeQuery(query);
};
//
const getOrder = async () => {
  const query = `SELECT * FROM orders`;
  return await executeQuery(query);
};
//
const getPackagesdetailById = async (id) => {
  const query = `SELECT * FROM packages_detail WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getPackagesdetail = async () => {
  const query = `SELECT * FROM packages_detail`;
  return await executeQuery(query);
};
//
const getPackagesById = async (id) => {
  const query = `SELECT * FROM packages WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getPackages = async () => {
  const query = `SELECT * FROM packages`;
  return await executeQuery(query);
};
//
const getDestinationsById = async (id) => {
  const query = `SELECT * FROM destinations WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getDestinations = async () => {
  const query = `SELECT * FROM destinations`;
  return await executeQuery(query);
};
//
const getCitiesById = async (id) => {
  const query = `SELECT * FROM cities WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getCities = async () => {
  const query = `SELECT * FROM cities`;
  return await executeQuery(query);
};
//
const getCategoriesById = async (id) => {
  const query = `SELECT * FROM categories WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getCategories = async () => {
  const query = `SELECT * FROM categories`;
  return await executeQuery(query);
};
//
const getTourists = async () => {
  const query = `SELECT * FROM users WHERE role='user'`;
  return await executeQuery(query);
};
//
const getUsers = async () => {
  const query = `SELECT * FROM users WHERE role='staff'`;
  return await executeQuery(query);
};
//
const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id='${id}'`;
  return await executeQuery(query);
};
//
const getUserByAdmin = async (email) => {
  const query = `SELECT * FROM users WHERE email='${email}' AND role='admin'`;
  return await executeQuery(query);
};
//
const getUserBy = async (email) => {
  const query = `SELECT * FROM users WHERE email='${email}' AND (role='admin' OR role='staff')`;
  return await executeQuery(query);
};
//
const getUser = async (email) => {
  const query = `SELECT * FROM users WHERE email='${email}'`;
  return await executeQuery(query);
};
//
const insertUser = async (email, first_name, last_name, password) => {
  const query = `INSERT INTO users (email, first_name, last_name, password) VALUES ('${email}', '${first_name}', '${last_name}', '${password}');`;
  KeiLog("INFO" , "Insert kedalam tb users");
  return await executeQuery(query);
};
//
const insertStaff = async (email, first_name, last_name, password, role) => {
  const query = `INSERT INTO users (email, first_name, last_name, password, role) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', '${role}');`;
  KeiLog("INFO" , "Insert kedalam tb users");
  return await executeQuery(query);
};
//
const insertCategories = async (nama) => {
  const query = `INSERT INTO categories (nama) VALUES ('${nama}');`;
  KeiLog("INFO" , "Insert kedalam tb categories");
  return await executeQuery(query);
};
//
const insertCities = async (nama) => {
  const query = `INSERT INTO cities (nama) VALUES ('${nama}');`;
  KeiLog("INFO" , "Insert kedalam tb cities");
  return await executeQuery(query);
};
//
const insertDestinations = async (nama, category_id) => {
  const query = `INSERT INTO destinations (nama, category_id) VALUES ('${nama}', '${category_id}');`;
  KeiLog("INFO" , "Insert kedalam tb destinations");
  return await executeQuery(query);
};
//
const insertPackages = async (nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date) => {
  const query = `INSERT INTO packages (nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date) VALUES ('${nama}', '${city_id}', '${peserta}', '${durasi}', '${harga}', '${gambar}', '${jumlah}', '${start_date}', '${end_date}');`;
  KeiLog("INFO" , "Insert kedalam tb packages");
  return await executeQuery(query);
};
//
const insertPackagesdetail = async (packages_id, destination_id, fasilitas, status) => {
  const query = `INSERT INTO packages_detail (packages_id, destination_id, fasilitas, status) VALUES ('${packages_id}', '${destination_id}', '${fasilitas}', '${status}');`;
  KeiLog("INFO" , "Insert kedalam tb packages_detail");
  return await executeQuery(query);
};
//
const insertOrder = async (packages_id, user_id, telp, status) => {
  const query = `INSERT INTO orders (packages_id, user_id, telp, status) VALUES ('${packages_id}', '${user_id}', '${telp}', '${status}');`;
  KeiLog("INFO" , "Insert kedalam tb orders");
  return await executeQuery(query);
};
//
const updateVerificationUser = async (email) => {
  const query = `UPDATE users SET isActive=true WHERE email='${email}'`;
  KeiLog("INFO" , "Update kedalam tb users");
  return await executeQuery(query);
};
//
const updateStaff = async (id, first_name, last_name) => {
  const query = `UPDATE users SET first_name='${first_name}', last_name='${last_name}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb users");
  return await executeQuery(query);
}
//
const updateTourists = async (id, first_name, last_name) => {
  const query = `UPDATE users SET first_name='${first_name}', last_name='${last_name}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb users");
  return await executeQuery(query);
}
//
const updateCategories = async (id, nama) => {
  const query = `UPDATE categories SET nama='${nama}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb categories");
  return await executeQuery(query);
}
//
const updateCities = async (id, nama) => {
  const query = `UPDATE cities SET nama='${nama}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb cities");
  return await executeQuery(query);
}
//
const updateDestinations = async (id, nama, category_id) => {
  const query = `UPDATE destinations SET nama='${nama}', category_id=${category_id} WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb destinations");
  return await executeQuery(query);
}
//
const updatePackages = async (id, nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date) => {
  const query = `UPDATE packages SET nama='${nama}', city_id=${city_id}, peserta='${peserta}', durasi='${durasi}', harga='${harga}', gambar='${gambar}', jumlah='${jumlah}', start_date='${start_date}', end_date='${end_date}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb packages");
  return await executeQuery(query);
}
//
const updatePackagesdetail = async (id, packages_id, destination_id, fasilitas, status) => {
  const query = `UPDATE packages_detail SET packages_id=${packages_id}, destination_id=${destination_id}, fasilitas='${fasilitas}', status='${status}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb packages_detail");
  return await executeQuery(query);
}
//
const updateOrder = async (id, packages_id, user_id, telp, status) => {
  const query = `UPDATE orders SET packages_id=${packages_id}, user_id=${user_id}, telp='${telp}', status='${status}' WHERE id=${id}`;
  KeiLog("INFO" , "Update kedalam tb orders");
  return await executeQuery(query);
}
//
const deleteStaff = async (id) => {
  const query = `DELETE FROM users WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb users");
  return await executeQuery(query);
}
//
const deleteTourists = async (id) => {
  const query = `DELETE FROM users WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb users");
  return await executeQuery(query);
}
//
const deleteCategories = async (id) => {
  const query = `DELETE FROM categories WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb categories");
  return await executeQuery(query);
}
//
const deleteCities = async (id) => {
  const query = `DELETE FROM cities WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb cities");
  return await executeQuery(query);
}
//
const deleteDestinations = async (id) => {
  const query = `DELETE FROM destinations WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb destinations");
  return await executeQuery(query);
}
//
const deletePackages = async (id) => {
  const query = `DELETE FROM packages WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb packages");
  return await executeQuery(query);
}
//
const deletePackagesdetail = async (id) => {
  const query = `DELETE FROM packages_detail WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb packages_detail");
  return await executeQuery(query);
}
//
const deleteOrder = async (id) => {
  const query = `DELETE FROM orders WHERE id=${id}`;
  KeiLog("INFO" , "Delete kedalam tb orders");
  return await executeQuery(query);
}

module.exports = {
  createTableUsers,
  createTableCategories,
  createTableCities,
  createTableDestinations,
  createTableOrder,
  createTablePackages,
  createTablePackagesdetail,
  getPackagesdetailById,
  getPackagesdetail,
  getPackages,
  getPackagesById,
  getOrder,
  getOrderById,
  getDestinations,
  getDestinationsById,
  getCities,
  getCitiesById,
  getCategories,
  getCategoriesById,
  getTourists,
  getUsers,
  getUserBy,
  getUserById,
  getUserByAdmin,
  getUser,
  insertUser,
  insertStaff,
  insertCategories,
  insertCities,
  insertDestinations,
  insertPackages,
  insertPackagesdetail,
  insertOrder,
  updateVerificationUser,
  updateStaff,
  updateTourists,
  updateCategories,
  updateCities,
  updateDestinations,
  updatePackages,
  updatePackagesdetail,
  updateOrder,
  deleteStaff,
  deleteTourists,
  deleteCategories,
  deleteCities,
  deleteDestinations,
  deletePackages,
  deletePackagesdetail,
  deleteOrder
};
