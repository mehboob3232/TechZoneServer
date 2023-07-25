const express = require("express");
const app = express();
const mongoose = require('mongoose');
const JobModelAdmin = require("./models/JobModelAdmin");
const UserModel = require("./models/UsersModel");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cors = require("cors");
const path = require('path');
const fs = require("fs");
const bcrypt = require('bcrypt');
const ApplicationModel = require("./models/ApplicationModel");
const authCheck = require("./middleware/authCheck");
var jwt = require('jsonwebtoken');
const { response } = require("express");
const privateKey = "khkhj&^5234234((*23423";


//middleware used
app.use(express.json());
app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// queries for admin model
// create job using post method
app.post("/create-job", upload.single('image'), async (request, response) => {

  if (request.file.mimetype == "image/png" || request.file.mimetype == "image/jpg" || request.file.mimetype == "image/jpeg" || request.file.mimetype == "image/gif") {
    let ext = request.file.mimetype.split("/")[1];
    const NewImgName = request.file.path + "." + ext;
    request.body.image = NewImgName;
    fs.rename(request.file.path, NewImgName, () => { console.log("done") });

  } else {
    fs.unlink(request.file.path, () => { console.log("deleted") });
  }

  try {
    await JobModelAdmin.create(request.body);
    return response.json({
      status: true,
      msg: "Job Add successfully"
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return response.json({
        status: false,
        errors: errors
      })
    }
  }
})

// delete jobs
app.delete("/delete-job/:id", async (req, res) => {
  const delid = req.params.id;
  try {
    await JobModelAdmin.findByIdAndDelete(delid);
    res.json({
      status: true,
      msg: "Record delete Successfully"
    })
  } catch (error) {
    return response.json({
      status: false
    })
  }

})

// update jobs
app.put("/update-job/:id", upload.single('image'), async (req, res) => {
  const id = req.params.id;
  if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/gif") {
    let ext = req.file.mimetype.split("/")[1];
    const NewImgName = req.file.path + "." + ext;
    req.body.image = NewImgName;
    fs.rename(req.file.path, NewImgName, () => { console.log("done") });

  } else {
    fs.unlink(req.file.path, () => { console.log("deleted") });
  }

  try {
    await JobModelAdmin.findByIdAndUpdate(id, req.body);
    return res.json({
      status: true,
      msg: "job update successfully"
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.json({
        status: false,
        errors: errors
      })
    }
  }
})
// find all jobs
app.get("/jobs", async (req, res) => {

  const category = req.query.cat;

  let searchObj = {};
  if(category) {
     searchObj = {category: category};
  }

  try {

    const jobs = await JobModelAdmin.find(searchObj);
    return res.json({
      status: true,
      jobs: jobs
    })
  } catch {
    return res.json({
      status: false,
      msg: "Something went wrong"
    })
  }
})

// find job by id
app.get("/job/:id", async (req, res) => {
  const id = req.params.id;
  try {
     const readjob = await JobModelAdmin.findById(id);
    res.json({
      status: true,
      msg: "Read job Successfully",
      jobs: readjob
    })
  } catch (error) {
    return response.json({
      status: false,
      message: "Something went wrong"
    })
  }
})

// queries for user model

// Signup user 
app.post("/signup-user", async (request, response) => {
  try {
    // check already registerd or not
    const userExist = await UserModel.findOne({ email: request.body.email });
    if (userExist) {
      return response.json({
        status: false,
        message: "This email is already registered"
      })
    }
    else {
      // generate hashed password
      request.body.password = await bcrypt.hash(request.body.password, 10);
      await UserModel.create(request.body);
      return response.json({
        status: true,
        msg: "User Add successfully"
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return response.json({
        status: false,
        errors: errors
      })
    }
  }
})

//pofile api
app.post("/profile", authCheck, async (request, response) => {

  console.log(request.data.id);
  const userId = new mongoose.Types.ObjectId(request.data.id);

  try {
    const application = await ApplicationModel.find({ user: userId })
      .populate("job")
      .populate("user")
      .exec();

    return response.json({
      status: true,
      application: application
    })
  } catch (error) {
    console.log(error);
  }



})

//login api
app.post("/login", async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  //STEP 1  user is reqistered or not
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    return response.json({
      status: false,
      message: "This email is not registered"
    })
  }

  //STEP 2 now we got the user, now check password is correct

  try {
    console.log(user.password);
    const isPassOk = await bcrypt.compare(password, user.password);

    if (isPassOk == true) {

      const token = jwt.sign({ email: user.email, name: user.name, id: user._id, role: user.role }, privateKey);

      return response.json({
        status: true,
        token: token
      })
    } else {
      return response.json({
        status: false,
        message: "username or password is incorrect"
      })
    }


  } catch (error) {

  }

})


// applications by id
app.get("/applicationbyuser/:id", async (request, response) => {

  const userId = request.params.id;
  try {
    const applications = await ApplicationModel.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate("job")
      .populate("user")
      .exec();

    return response.json({
      status: true,
      applications: applications
    });

  } catch (error) {
    return response.json({
      status: false,
    })
  }

});

//create application
app.post("/application-create", upload.single('resume'), async (request, response) => {

  if (request.file.mimetype == "application/pdf" || request.file.mimetype == "application/docx") {
    let ext = request.file.mimetype.split("/")[1];
    const NewResumeName = request.file.path + "." + ext;
    request.body.resume = NewResumeName;
    fs.rename(request.file.path, NewResumeName, () => { console.log("done") });

  } else {
    fs.unlink(request.file.path, () => { console.log("deleted") });
  }

  try {
    await ApplicationModel.create(request.body);
    return response.json({
      status: true,
      msg: "Application Add successfully"
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return response.json({
        status: false,
        errors: errors
      })
    }
  }
})
// search jobs
app.get("/search", async (request, response) => {
  const title = request.query.q;
  const category = request.query.cat;
  const location = request.query.loc;

  try {
    const jobs = await JobModelAdmin.find({ title: { $regex: title, $options: 'i' },category: { $regex: category, $options: 'i' },location: { $regex: location, $options: 'i' } });
    return response.json({
      status: true,
      jobs: jobs
    });

  } catch (error) {
    return response.json({
      status: false,
    })
  }
});


// mongo password   XA78CAnYR35WsgSc
// mongo link code  mongodb+srv://mehboob05:<password>@jobsite.2znsayl.mongodb.net/


mongoose.connect('mongodb+srv://mehboob05:XA78CAnYR35WsgSc@jobsite.2znsayl.mongodb.net/jobDb').then(() => {
  app.listen(3004, () => {
    console.log("Database and server Running");
  })
})