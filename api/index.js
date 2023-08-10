const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MoviesModels = require("../models/MoviesModels");
const TvShowModel = require("../models/TvShowModel");
const cors = require("cors");
// const multer = require("multer");
// const upload = multer({ dest: "../public/" });
const  {v2} =require('cloudinary');
       
app.use(express.json());     
v2.config({ 
  cloud_name: 'dxyayoqgq', 
  api_key: '436438823682386', 
  api_secret: 'VIVrthzaiQJ2QFpYQZcjgKRQhFU' 
});

















app.get("/api", async (request, response) => {

  v2.uploader.upload("http://localhost:3001//public/01d523516aa4134653c80127506b7d4b.jpeg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });

    return response.json({
        status: true,
        movies: "hello",
      });
  });








mongoose.connect("mongodb+srv://mehboob05:XA78CAnYR35WsgSc@jobsite.2znsayl.mongodb.net/jobDb").then(() => {
   console.log("DB connect")

   app.listen(3004, () => {
    console.log(`BACKEND WORKING GOOD`);
  });

  });

  module.exports = app;