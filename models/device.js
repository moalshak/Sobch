import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    }
    
});


export default mongoose.model("Device", deviceSchema);