const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApplicationSchema = new Schema({ 
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    job: {
        type: Schema.Types.ObjectId, 
        ref: 'Job'
    },
    userEmail: {
        type: String,
        required:[true,"Please provide Valid userEmail"]
    },
    userName: {
        type: String,
        required:[true,"Please provide userName"]
    },
    contactinformation: {
        type: String,
        required:[true,"Please provide Valid Contact information"] 
    },
    resume:{
        type:String,
        required:[true,"Please provide Cv or Resume"],
        get:linkUrl
        
    },
},{toJSON:{getters:true}}, { timestamps: true });
function linkUrl(resume){
    return('http://localhost:3004'+resume);
}
const ApplicationModel = mongoose.model('Application', ApplicationSchema);
module.exports = ApplicationModel