var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  
   name:String,
   email_id:{type:String,unique:true},
   watched:[{type:mongoose.Schema.Types.ObjectId,
                     ref:"Video"
                  }],
   recommendations:[{type:mongoose.Schema.Types.ObjectId,
                  ref:"Video"
   }]
    
});



module.exports = mongoose.model("User",userSchema);