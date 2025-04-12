const { Register, Verification, Login, verifyToken, Profile, OrderById, Staff, Tourists, Categories, Cities, Destinations, Packages, Packagesdetail, Order, createStaff, createTourists, createCategories, createCities, createDestinations, createPackages, createPackagesdetail, createOrder, updateStaff, updateTourists, updateCategories, updateCities, updateDestinations, updatePackages, updatePackagesdetail, updateOrder, deleteStaff, deleteTourists, deleteCategories, deleteCities, deleteDestinations, deletePackages, deletePackagesdetail, deleteOrder } = require("../lib/functions");
const { KeiLog } = require("../../lib/Logger");
const multer = require('multer');


module.exports = function (app) {

  app.post("/register", async (req, res) => {
    try {
      const exec = await Register(req, res)
      //console.log(exec);
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/verification/email', async (req, res) => {
    try {
      const exec = await Verification(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const exec = await Login(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/profile/id', verifyToken, async (req, res) => {
    try {
      const exec = await Profile(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/staff', verifyToken, async (req, res) => {
    try {
      const exec = await Staff(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/staff/create', verifyToken, async (req, res) => {
    try {
      const exec = await createStaff(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/staff/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateStaff(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/staff/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteStaff(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  //=============================================================//

  app.get('/tourists', verifyToken, async (req, res) => {
    try {
      const exec = await Tourists(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/tourists/create', verifyToken, async (req, res) => {
    try {
      const exec = await createTourists(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/tourists/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateTourists(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/tourists/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteTourists(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

  app.get('/categories', verifyToken, async (req, res) => {
    try {
      const exec = await Categories(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/categories/create', verifyToken, async (req, res) => {
    try {
      const exec = await createCategories(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/categories/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateCategories(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/categories/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteCategories(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//
  
  app.get('/cities', verifyToken, async (req, res) => {
    try {
      const exec = await Cities(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/cities/create', verifyToken, async (req, res) => {
    try {
      const exec = await createCities(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/cities/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateCities(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/cities/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteCities(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

  app.get('/destinations', verifyToken, async (req, res) => {
    try {
      const exec = await Destinations(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/destinations/create', verifyToken, async (req, res) => {
    try {
      const exec = await createDestinations(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/destinations/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateDestinations(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/destinations/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteDestinations(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

  app.get('/packages', verifyToken, async (req, res) => {
    try {
      const exec = await Packages(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/packages/create', verifyToken, async (req, res) => {
    try {
      const exec = await createPackages(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/packages/update', verifyToken, async (req, res) => {
    try {
      const exec = await updatePackages(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/packages/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deletePackages(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

  app.get('/packagesdetail', verifyToken, async (req, res) => {
    try {
      const exec = await Packagesdetail(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/packagesdetail/create', verifyToken, async (req, res) => {
    try {
      const exec = await createPackagesdetail(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/packagesdetail/update', verifyToken, async (req, res) => {
    try {
      const exec = await updatePackagesdetail(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/packagesdetail/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deletePackagesdetail(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

  app.get('/order/id', verifyToken, async (req, res) => {
    try {
      const exec = await OrderById(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/order', verifyToken, async (req, res) => {
    try {
      const exec = await Order(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post('/order/create', verifyToken, async (req, res) => {
    try {
      const exec = await createOrder(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.put('/order/update', verifyToken, async (req, res) => {
    try {
      const exec = await updateOrder(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/order/delete', verifyToken, async (req, res) => {
    try {
      const exec = await deleteOrder(req, res)
      KeiLog(exec.status, exec.msg);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  //=============================================================//

};
