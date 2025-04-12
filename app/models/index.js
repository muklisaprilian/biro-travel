const db = require("../../db/db.js");

async function synchronizeModels() {
  try {
    await db.createTableUsers();
    await db.createTableCategories();
    await db.createTableCities();
    await db.createTableDestinations();
    await db.createTableOrder();
    await db.createTablePackages();
    await db.createTablePackagesdetail();
    console.log('Database & tables created!');
  } catch (err) {
    console.error('Error creating database & tables: ', err);
  }
}

module.exports = {
    synchronizeModels
}