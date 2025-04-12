const multer = require('multer');
const path = require('path');
const fs = require('fs');
const format = require("date-format");
const { KeiLog } = require("../../lib/Logger");
const db = require("../../db/db.js");
const config = require("../../config.js");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.key;  // Replace with a secure key
const argon2 = require("argon2");
const nodemailer = require("nodemailer");

const getFormattedDate = (date) => {
  return format("yyyy-MM-dd", date);
};

const getFormattedDatetime = (date) => {
  return format("yyyy-MM-dd hh:mm:ss", date);
};

async function Register(req, res){
  const { email, first_name, last_name, password } = req.body;

  const [User] = await db.getUser(email);
  let results;

  if (User){
    results = {status: 'INFO', msg: `Email (${email}) sudah terdaftar`};
    res.status(400).json({
      status: 102,
      message: "Email sudah terdaftar",
      data: null
    });
  }else{
    const allowedDomains = ['gmail.com', 'yahoo.com', 'nutech-integrasi.com'];
    const domain = email.split('@')[1];
    if (!validator.isEmail(email) || !allowedDomains.includes(domain)) {
      results = {status: 'INFO', msg: `Parameter email (${email}) tidak sesuai format`};
      res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null
      });
    }else if (!password || password.length < 8) {
      results = {status: 'INFO', msg: `Password length minimal 8 karakter`};
      res.status(400).json({
        status: 102,
        message: "Password length minimal 8 karakter",
        data: null
      });
    }else{
      
      const src = `http://localhost:6000/verification/email?email=` + email;
                
      const emailFrom = `apriliancore@gmail.com`;
      const emailFromName = `apriliancore`;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        //host: "103.113.133.226",
        //port: 52556,
          // secure: true,
        auth: {
          user: "apriliancore@gmail.com",
          pass: "mfji pcwt gkqo xmrs",
        }, 
        tls: {
          //rejectUnauthorized: true,
          rejectUnauthorized: false,
        },
      });

      //bisa send html, text dan attachment
      const mailOptions = {
        from: `"${emailFromName}" <${emailFrom}>`,
        to: `${email}`,
        subject: `Email Verification`,
        //   text: `${process.argv[4]}`,
        html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Document</title>
              </head>
              <body>
                  <a href="${src}" class="sidebar-link">
                        <span>Click to verify</span>
                    </a>
              </body>
              </html>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent:" + info.response);
        }
      });

    const hashPassword = await argon2.hash(password);
    await db.insertUser(email, first_name, last_name, hashPassword);
    results = {status: 'SUCCESS', msg: `Registrasi berhasil silahkan login`};
    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });
   }
  }

  return results;
}

async function Verification(req, res){
  const { email } = req.query;
  const [userProfile] = await db.getUser(email);
  let results;

  if (userProfile){
    await db.updateVerificationUser(email);

    results = {status: 'SUCCESS', msg: `Verification Berhasil`};
    res.status(200).json({
      status: 0,
      message: 'Verification Berhasil',
      data: null
    });
  }

  return results;
}

async function Login(req, res){
  const { email, password } = req.body;
  const [Users] = await db.getUser(email);
  const match = await argon2.verify(Users.password, password);

  let results;

  if (Users){
    if (!password || password.length < 8 || !match) {
      results = {status: 'INFO', msg: `Username atau password salah`};
      res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }else{
      const user = { email };
      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '12h' });

      results = {status: 'SUCCESS', msg: `Login Sukses`};
      res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: { token: token }
      });
   }
  }else{
    const allowedDomains = ['gmail.com', 'yahoo.com', 'nutech-integrasi.com'];
    const domain = email.split('@')[1];
    if (!validator.isEmail(email) || !allowedDomains.includes(domain)) {
      results = {status: 'INFO', msg: `Parameter email (${email}) tidak sesuai format`};
      res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null
      });
    }else if (!password || password.length < 8) {
      results = {status: 'INFO', msg: `Username atau password salah`};
      res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }else{
      results = {status: 'INFO', msg: `Username atau password salah`};
      res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }
  }
  
  return results;
}

async function verifyToken(req, res, next){
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    KeiLog('INFO', 'Token tidak valid atau kadaluwarsa');
    res.status(401).json({
      status: 108,
      message: 'Token tidak valid atau kadaluwarsa',
      data: null,
    });
  }else{
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        KeiLog('INFO', 'Token tidak valid atau kadaluwarsa');
        res.status(401).json({
          status: 108,
          message: 'Token tidak valid atau kadaluwarsa',
          data: null,
        });
      }else{
        req.userEmail = decoded.email; 
        next();
      }
    });
  }
}

async function Profile(req, res){
  const email = req.userEmail;
  const { id } = req.query;
  const [userProfiles] = await db.getUser(email);
  const [userProfile] = await db.getUserById(id);
  let results;

  if (userProfiles){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: userProfile.email,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        role: userProfile.role,
      },
    });
  }

  return results;
}

async function Staff(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserByAdmin(email);
  const users = await db.getUsers();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        email: obj.email,
        first_name: obj.first_name,
        last_name: obj.last_name,
        role: obj.role,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createStaff(req, res){
  const emails = req.userEmail;
  const { email, first_name, last_name, password, role } = req.body;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUser(email);
  let results;

  if (access) {
    if (User){
      results = {status: 'INFO', msg: `Email (${email}) sudah terdaftar`};
      res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null
      });
    }else{
      const allowedDomains = ['gmail.com', 'yahoo.com', 'nutech-integrasi.com'];
      const domain = email.split('@')[1];
      if (!validator.isEmail(email) || !allowedDomains.includes(domain)) {
        results = {status: 'INFO', msg: `Parameter email (${email}) tidak sesuai format`};
        res.status(400).json({
          status: 102,
          message: "Parameter email tidak sesuai format",
          data: null
        });
      }else if (!password || password.length < 8) {
        results = {status: 'INFO', msg: `Password length minimal 8 karakter`};
        res.status(400).json({
          status: 102,
          message: "Password length minimal 8 karakter",
          data: null
        });
      }else{
        
        const src = `http://localhost:6000/verification/email?email=` + email;
                  
        const emailFrom = `apriliancore@gmail.com`;
        const emailFromName = `apriliancore`;

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          //host: "103.113.133.226",
          //port: 52556,
            // secure: true,
          auth: {
            user: "apriliancore@gmail.com",
            pass: "mfji pcwt gkqo xmrs",
          }, 
          tls: {
            //rejectUnauthorized: true,
            rejectUnauthorized: false,
          },
        });

        //bisa send html, text dan attachment
        const mailOptions = {
          from: `"${emailFromName}" <${emailFrom}>`,
          to: `${email}`,
          subject: `Email Verification`,
          //   text: `${process.argv[4]}`,
          html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <a href="${src}" class="sidebar-link">
                          <span>Click to verify</span>
                      </a>
                </body>
                </html>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent:" + info.response);
          }
        });

      const hashPassword = await argon2.hash(password);
      await db.insertStaff(email, first_name, last_name, hashPassword, role);
      results = {status: 'SUCCESS', msg: `Staff berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Staff berhasil di tambahkan",
        data: null
      });
    }
    }
  }

  return results;
}

async function updateStaff(req, res){
  const { id, first_name, last_name } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUserById(id);
  let results;

  if (access) {
    if (!first_name || !last_name) {
      results = {status: 'INFO', msg: `First name dan last name harus diisi`};
      res.status(400).json({
        status: 107,
        message: 'First name dan last name harus diisi',
        data: null,
      });
    }else{
      const updatedProfile = {
        id: User.id,
        first_name,
        last_name,
        role: User.role,
      };
    
      await db.updateStaff(User.id, first_name, last_name);
      results = {status: 'SUCCESS', msg: `Staff berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Staff berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteStaff(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUserById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: User.id,
        first_name: User.first_name,
        last_name: User.last_name,
        role: User.role,
      };
    
      await db.deleteStaff(id);
      results = {status: 'SUCCESS', msg: `Staff berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Staff berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Tourists(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserByAdmin(email);
  const users = await db.getTourists();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        email: obj.email,
        first_name: obj.first_name,
        last_name: obj.last_name,
        role: obj.role,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createTourists(req, res){
  const emails = req.userEmail;
  const { email, first_name, last_name, password } = req.body;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUser(email);
  let results;

  if (access) {
    if (User){
      results = {status: 'INFO', msg: `Email (${email}) sudah terdaftar`};
      res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null
      });
    }else{
      const allowedDomains = ['gmail.com', 'yahoo.com', 'nutech-integrasi.com'];
      const domain = email.split('@')[1];
      if (!validator.isEmail(email) || !allowedDomains.includes(domain)) {
        results = {status: 'INFO', msg: `Parameter email (${email}) tidak sesuai format`};
        res.status(400).json({
          status: 102,
          message: "Parameter email tidak sesuai format",
          data: null
        });
      }else if (!password || password.length < 8) {
        results = {status: 'INFO', msg: `Password length minimal 8 karakter`};
        res.status(400).json({
          status: 102,
          message: "Password length minimal 8 karakter",
          data: null
        });
      }else{
        
        const src = `http://localhost:6000/verification/email?email=` + email;
                  
        const emailFrom = `apriliancore@gmail.com`;
        const emailFromName = `apriliancore`;

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          //host: "103.113.133.226",
          //port: 52556,
            // secure: true,
          auth: {
            user: "apriliancore@gmail.com",
            pass: "mfji pcwt gkqo xmrs",
          }, 
          tls: {
            //rejectUnauthorized: true,
            rejectUnauthorized: false,
          },
        });

        //bisa send html, text dan attachment
        const mailOptions = {
          from: `"${emailFromName}" <${emailFrom}>`,
          to: `${email}`,
          subject: `Email Verification`,
          //   text: `${process.argv[4]}`,
          html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <a href="${src}" class="sidebar-link">
                          <span>Click to verify</span>
                      </a>
                </body>
                </html>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent:" + info.response);
          }
        });

      const hashPassword = await argon2.hash(password);
      await db.insertUser(email, first_name, last_name, hashPassword);
      results = {status: 'SUCCESS', msg: `Tourists berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Tourists berhasil di tambahkan",
        data: null
      });
    }
    }
  }

  return results;
}

async function updateTourists(req, res){
  const { id, first_name, last_name } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUserById(id);
  let results;

  if (access) {
    if (!first_name || !last_name) {
      results = {status: 'INFO', msg: `First name dan last name harus diisi`};
      res.status(400).json({
        status: 107,
        message: 'First name dan last name harus diisi',
        data: null,
      });
    }else{
      const updatedProfile = {
        id: User.id,
        first_name,
        last_name,
        role: User.role,
      };
    
      await db.updateTourists(User.id, first_name, last_name);
      results = {status: 'SUCCESS', msg: `Tourists berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Tourists berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteTourists(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserByAdmin(emails);
  const [User] = await db.getUserById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: User.id,
        first_name: User.first_name,
        last_name: User.last_name,
        role: User.role,
      };
    
      await db.deleteTourists(id);
      results = {status: 'SUCCESS', msg: `Tourists berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Tourists berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Categories(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserBy(email);
  const users = await db.getCategories();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        nama: obj.nama,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createCategories(req, res){
  const emails = req.userEmail;
  const { nama } = req.body;
  const [access] = await db.getUserBy(emails);
  let results;

  if (access) {
      if (!nama) {
        results = {status: 'INFO', msg: `Categories tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Categories tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertCategories(nama);
      results = {status: 'SUCCESS', msg: `Categories berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Categories berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updateCategories(req, res){
  const { id, nama } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getCategoriesById(id);
  let results;

  if (access) {
    if (!nama) {
      results = {status: 'INFO', msg: `Categories tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Categories tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        nama,
      };
    
      await db.updateCategories(Cate.id, nama);
      results = {status: 'SUCCESS', msg: `Categories berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Categories berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteCategories(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getCategoriesById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        nama: Cate.nama,
      };
    
      await db.deleteCategories(id);
      results = {status: 'SUCCESS', msg: `Categories berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Categories berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Cities(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserBy(email);
  const users = await db.getCities();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        nama: obj.nama,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createCities(req, res){
  const emails = req.userEmail;
  const { nama } = req.body;
  const [access] = await db.getUserBy(emails);
  let results;

  if (access) {
      if (!nama) {
        results = {status: 'INFO', msg: `Cities tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Cities tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertCities(nama);
      results = {status: 'SUCCESS', msg: `Cities berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Cities berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updateCities(req, res){
  const { id, nama } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getCitiesById(id);
  let results;

  if (access) {
    if (!nama) {
      results = {status: 'INFO', msg: `Cities tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Cities tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        nama,
      };
    
      await db.updateCities(Cate.id, nama);
      results = {status: 'SUCCESS', msg: `Cities berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Cities berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteCities(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getCitiesById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        nama: Cate.nama,
      };
    
      await db.deleteCities(id);
      results = {status: 'SUCCESS', msg: `Cities berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Cities berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Destinations(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserBy(email);
  const users = await db.getDestinations();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        category_id: obj.category_id,
        nama: obj.nama,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createDestinations(req, res){
  const emails = req.userEmail;
  const { nama, category_id } = req.body;
  const [access] = await db.getUserBy(emails);
  let results;

  if (access) {
      if (!nama || !category_id) {
        results = {status: 'INFO', msg: `Destinations tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Destinations tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertDestinations(nama, category_id);
      results = {status: 'SUCCESS', msg: `Destinations berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Destinations berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updateDestinations(req, res){
  const { id, nama, category_id } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getDestinationsById(id);
  let results;

  if (access) {
    if (!nama || !category_id) {
      results = {status: 'INFO', msg: `Destinations tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Destinations tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        category_id,
        nama,
      };
    
      await db.updateDestinations(Cate.id, nama, category_id);
      results = {status: 'SUCCESS', msg: `Destinations berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Destinations berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteDestinations(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getDestinationsById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        category_id: Cate.category_id,
        nama: Cate.nama,
      };
    
      await db.deleteDestinations(id);
      results = {status: 'SUCCESS', msg: `Destinations berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Destinations berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Packages(req, res){
  const email = req.userEmail;
  const [access] = await db.getUser(email);
  const users = await db.getPackages();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        city_id: obj.city_id,
        nama: obj.nama,
        peserta: obj.peserta,
        durasi: obj.durasi,
        harga: obj.harga,
        gambar: obj.gambar,
        jumlah: obj.jumlah,
        start_date: obj.start_date,
        end_date: obj.end_date,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createPackages(req, res){
  const emails = req.userEmail;
  const { nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date } = req.body;
  const [access] = await db.getUserBy(emails);
  let results;

  if (access) {
      if (!nama || !city_id || !peserta || !durasi || !harga || !gambar || !jumlah || !start_date || !end_date) {
        results = {status: 'INFO', msg: `Packages tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Packages tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertPackages(nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date);
      results = {status: 'SUCCESS', msg: `Packages berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Packages berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updatePackages(req, res){
  const { id, nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getPackagesById(id);
  let results;

  if (access) {
    if (!nama || !city_id || !peserta || !durasi || !harga || !gambar || !jumlah || !start_date || !end_date) {
      results = {status: 'INFO', msg: `Packages tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Packages tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        nama, 
        city_id, 
        peserta, 
        durasi, 
        harga, 
        gambar, 
        jumlah, 
        start_date, 
        end_date,
      };
    
      await db.updatePackages(Cate.id, nama, city_id, peserta, durasi, harga, gambar, jumlah, start_date, end_date);
      results = {status: 'SUCCESS', msg: `Packages berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Packages berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deletePackages(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getPackagesById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        nama: Cate.nama, 
        city_id: Cate.city_id, 
        peserta: Cate.peserta, 
        durasi: Cate.durasi, 
        harga: Cate.harga, 
        gambar: Cate.gambar, 
        jumlah: Cate.jumlah, 
        start_date: Cate.start_date, 
        end_date: Cate.end_date,
      };
    
      await db.deletePackages(id);
      results = {status: 'SUCCESS', msg: `Packages berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Packages berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function Packagesdetail(req, res){
  const email = req.userEmail;
  const [access] = await db.getUser(email);
  const users = await db.getPackagesdetail();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        packages_id: obj.packages_id,
        destination_id: obj.destination_id,
        fasilitas: obj.fasilitas,
        status: obj.status,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createPackagesdetail(req, res){
  const emails = req.userEmail;
  const { packages_id, destination_id, fasilitas, status } = req.body;
  const [access] = await db.getUserBy(emails);
  let results;

  if (access) {
      if (!packages_id || !destination_id || !fasilitas || !status) {
        results = {status: 'INFO', msg: `Packagesdetail tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Packagesdetail tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertPackagesdetail(packages_id, destination_id, fasilitas, status);
      results = {status: 'SUCCESS', msg: `Packagesdetail berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Packagesdetail berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updatePackagesdetail(req, res){
  const { id, packages_id, destination_id, fasilitas, status } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getPackagesdetailById(id);
  let results;

  if (access) {
    if (!packages_id || !destination_id || !fasilitas || !status) {
      results = {status: 'INFO', msg: `Packagesdetail tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Packagesdetail tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        packages_id, 
        destination_id, 
        fasilitas, 
        status,
      };
    
      await db.updatePackagesdetail(Cate.id, packages_id, destination_id, fasilitas, status);
      results = {status: 'SUCCESS', msg: `Packagesdetail berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Packagesdetail berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deletePackagesdetail(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getPackagesdetailById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        packages_id: Cate.packages_id, 
        destination_id: Cate.destination_id, 
        fasilitas: Cate.fasilitas, 
        status: Cate.status,
      };
    
      await db.deletePackagesdetail(id);
      results = {status: 'SUCCESS', msg: `Packagesdetail berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Packagesdetail berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}

async function OrderById(req, res){
  const email = req.userEmail;
  const { user_id } = req.query;
  const [access] = await db.getUser(email);
  const users = await db.getOrderById(user_id);
  let results;

  const datas = await Promise.all(users.map(async (obj) => {
    const [paketData] = await db.getPackagesById(obj.packages_id);
    const [paketdetailData] = await db.getPackagesdetailById(obj.packages_id);
    const [destinationData] = await db.getDestinationsById(paketdetailData.destination_id);
    const [categoriesData] = await db.getCategoriesById(destinationData.category_id);

    const [userData] = await db.getUserById(obj.user_id);
    const [cityData] = await db.getCitiesById(paketData.city_id);
  
    return {
      id: obj.id,
      categories: categoriesData.nama,
      destination: destinationData.nama,
      fasilitas: paketdetailData.fasilitas,
      city: cityData.nama, // Assuming you want the city name here
      paket: paketData.nama,
      peserta: paketData.peserta,
      durasi: paketData.durasi,
      harga: paketData.harga,
      gambar: paketData.gambar,
      jumlah: paketData.jumlah,
      start_date: paketData.start_date,
      end_date: paketData.end_date,
      nama: userData.first_name,
      telp: obj.telp,
      status: obj.status,
      created_at: obj.created_at,
      updated_at: obj.updated_at
    };
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function Order(req, res){
  const email = req.userEmail;
  const [access] = await db.getUserBy(email);
  const users = await db.getOrder();
  let results;

  const datas = users.map(obj => ({
        id: obj.id,
        packages_id: obj.packages_id,
        user_id: obj.user_id,
        telp: obj.telp,
        status: obj.status,
        created_at: obj.created_at,
        updated_at: obj.updated_at
  }));

  if (access){
    results = {status: 'SUCCESS', msg: `Sukses`};
    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: datas,
    });
  }

  return results;
}

async function createOrder(req, res){
  const emails = req.userEmail;
  const { packages_id, user_id, telp, status } = req.body;
  const [access] = await db.getUser(emails);
  let results;

  if (access) {
      if (!packages_id || !user_id || !telp || !status) {
        results = {status: 'INFO', msg: `Order tidak boleh kosong`};
        res.status(400).json({
          status: 102,
          message: "Order tidak boleh kosong",
          data: null
        });
      }else{
      await db.insertOrder(packages_id, user_id, telp, status);
      results = {status: 'SUCCESS', msg: `Order berhasil di tambahkan`};
      res.status(200).json({
        status: 0,
        message: "Order berhasil di tambahkan",
        data: null
      });
    }
  }

  return results;
}

async function updateOrder(req, res){
  const { id, packages_id, user_id, telp, status } = req.body;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getOrderById(id);
  let results;

  if (access) {
    if (!packages_id || !user_id || !telp || !status) {
      results = {status: 'INFO', msg: `Order tidak boleh kosong`};
      res.status(400).json({
        status: 107,
        message: "Order tidak boleh kosong",
        data: null
      });
    }else{
      const updatedProfile = {
        id: Cate.id,
        packages_id, 
        user_id, 
        telp, 
        status,
      };
    
      await db.updateOrder(Cate.id, packages_id, user_id, telp, status);
      results = {status: 'SUCCESS', msg: `Order berhasil di update`};
      res.status(200).json({
        status: 0,
        message: 'Order berhasil di update',
        data: updatedProfile,
      });
    }
  } 
  
  return results;
}

async function deleteOrder(req, res){
  const { id } = req.query;
  const emails = req.userEmail;
  const [access] = await db.getUserBy(emails);
  const [Cate] = await db.getOrderById(id);
  let results;

  if (access) {
      const deleteProfile = {
        id: Cate.id,
        packages_id: Cate.packages_id, 
        user_id: Cate.user_id, 
        telp: Cate.telp, 
        status: Cate.status,
      };
    
      await db.deleteOrder(id);
      results = {status: 'SUCCESS', msg: `Order berhasil di delete`};
      res.status(200).json({
        status: 0,
        message: 'Order berhasil di delete',
        data: deleteProfile,
      });
  } 
  
  return results;
}


module.exports = {
  Register,
  Verification,
  Login,
  verifyToken,
  Profile,
  Staff,
  createStaff,
  updateStaff,
  deleteStaff,
  Tourists,
  createTourists,
  updateTourists,
  deleteTourists,
  Categories,
  createCategories,
  updateCategories,
  deleteCategories,
  Cities,
  createCities,
  updateCities,
  deleteCities,
  Destinations,
  createDestinations,
  updateDestinations,
  deleteDestinations,
  Packages,
  createPackages,
  updatePackages,
  deletePackages,
  Packagesdetail,
  createPackagesdetail,
  updatePackagesdetail,
  deletePackagesdetail,
  OrderById,
  Order,
  createOrder,
  updateOrder,
  deleteOrder
}