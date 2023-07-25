const mongoose =require("mongoose");
const {Schema} = mongoose;

const AdminSchema = new Schema({
  title:{
        type:String,
        required:[true,"Please Provide Job Title"]
  },
  company:{
    type:String,
    required:[true,"Please Provide Comapny Name"]
  },
  location:{
    type:String,
    required:[true,"Please Provide Job Location"]
  },
  description:{
    type:String,
    required:[true,"Please Provide Job Description"]
  },
  image:{
    type:String,
    required:[true,"Please Provide Job Image"],
    get:linkUrl

  },
  salary:{
    type:Number,
    required:[true,"Please Provide Salary"]
  },
  responsibility :{
    type:String,
    required:[true,"Please provide job Responsibility"]
  },
  positiontype:{
    type:String,
    required:[true,"Please Provide position type eg- full-time,part-time,remote"]
  },
  email:{
    type:String,
    required:[true,"Please Provide Company Email"]
  },
  mobilenumber:{
    type:String,
    required:[true,"Please Provide Company Contact Number"]
  },
  education:{
    type:String,
    required:[true,"Please Provide Education for job"]
  },
  category:{
    type:String,
    required:[true,"Please Provide Job Category"]
  },
},{toJSON:{getters:true}},{timestamps:true});

function linkUrl(image){
  return('http://localhost:3004/'+image);
}
const JobModelAdmin = mongoose.model('Job',AdminSchema);
module.exports = JobModelAdmin