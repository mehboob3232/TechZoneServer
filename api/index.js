const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// const multer = require("multer");
// const upload = multer({ dest: "../public/" });



app.get("/api", async (request, response) => {

    return response.json({
        status: true,
        movies: "hello",
      });
  });








mongoose.connect("mongodb+srv://mehboob05:XA78CAnYR35WsgSc@jobsite.2znsayl.mongodb.net/jobDb").then(() => {
   console.log("DB connect")

  });

  module.exports = app;