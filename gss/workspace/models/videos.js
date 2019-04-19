var mongoose = require("mongoose");

var videoSchema = new mongoose.Schema({
   
  videoId:String,
  channelId:String,
  imageFiles:[{type:String}],
  reactions:[{type:Number}]
  

  
    
});

module.exports = mongoose.model("Video",videoSchema);