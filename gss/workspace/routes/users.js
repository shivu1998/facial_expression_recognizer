// require("dotenv").config();
// var express = require("express");
// var router = express.Router();
// var group =require("../models/group");
// var NodeGeocoder = require('node-geocoder');
// var nodemailer = require("nodemailer");
// var multer = require('multer');
// var compression = require('compression');
// router.use(compression());
// var options = {
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: process.env.geocoderapi,
//   formatter: null
// };

// var storage = multer.diskStorage({
    
//   filename: function(req, file, callback) {
  
//      console.log("storage");
      
//     callback(null, Date.now() + file.originalname);
     
//   }
   
// });
// var imageFilter = function (req, file, cb) {
//     console.log("filter");
 
//   // upload file to S3

//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// var upload = multer({ storage: storage, imageFilter:imageFilter});

// var cloudinary = require('cloudinary');
// cloudinary.config({ 
//   cloud_name: 'shivucloud', 
//   api_key: process.env.api_key, 
//   api_secret: process.env.api_secret
// });
 
// var geocoder = NodeGeocoder(options);

// //home page
// router.get("/",function(req, res) {
//     res.render("home.ejs")
// })

// //sendemails
// router.get("/sendemails/:strength/:threshold",function(req,res)
// {
//   res.render("send_email.ejs",{threshold:req.params.threshold,strength:req.params.strength});
    
// });


// //it came from home page
// router.post("/groupdetails",function(req, res) {
//     res.redirect("/sendemails/"+req.body.group_strength+"/"+req.body.threshold);
// })


// //came from se
// router.post("/send_emails/:strength/:threshold",function(req,res)
// {
    
      
//      // var emails={req.body.email.f1,req.body.email.f2,req.body.email.f3,req.body.email.f4};
     
//       group.create({},function(err,group)
//       {
//           if(err)
//           {
//               res.send(err);
//           }else
//          {
//              for(var i=0;i<parseInt(req.params.strength);i++)
//              {
                 
//                  group.email_ids.push(req.body.email[i]);
//              }
//               group.threshold = parseInt(req.params.threshold);
//               group.save();
//               console.log("group="+group);
//               group.email_ids.forEach(function(email)
//               {
//                     var smtpTransport = nodemailer.createTransport({
//                     service: 'Gmail', 
//                     auth: {
//                       user: 'geosynchronoussjce@gmail.com',
//                       pass:  "geo@sjce"
//                     }
//       });
//       var mailOptions = {
//         to: email,
//         from: 'geosynchronoussjce@gmail.com',
//         subject: 'You are being requested to join the live tracking' ,
//         text: "You are receiving this because your friend has requested you to join the live tracking so that you don't get lost from the group.\n\n" +
//           'Please click on the following link,to join\n\n'+
//           "https://gss-shivu1998.c9users.io/recieved/"+email+"/"+group._id
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//           if(err)
//           {
//               return res.redirect("/");
//           }
      
       
//       });
                 
//               });
              
              
           
//           }

          
//       });
//      res.send("Request email has been sent to your group members to connect with you, please check your inbox for our email");
// });

// router.post("/data",function(req, res) {
   
//  group.findOne({"_id":req.body.gid,"email_ids":{$in:[req.body.eid]}},function(err, group) {
//     if(group){
         
//         group.actual_location.forEach(function(user)
//      {
//          if(user.email == req.body.eid)
//          {
//              user.lat=req.body.lat;
//              user.lng=req.body.lng;
          
          
            
//          }
         
//      });
//       group.save();
//         console.log("******************updated group************"+group);
       
//     }
     
//  })
// })
// router.get("/recieved/:eid/:gid",function(req,res)
// {
//     group.findOne({"_id":req.params.gid,"email_ids":{$in:[req.params.eid]}},function(err,group)
//     {
//         if(err)
//         {
//             res.send(err.message);
//         }else
//         {
//             if(group)   
//             res.render("getlocation.ejs",{email:req.params.eid,gid:req.params.gid});
//             else
//             res.render("error.ejs",{email:req.params.eid});
//         }
        
//     });
    
    
// });


// router.post("/store/:gid/:eid",upload.single("image"),function(req, res) {
//   var present=0;
 
//   var color=["orange","green","red","yellow","blue"];
  
//     group.findOne({"_id":req.params.gid,"email_ids":{$in:[req.params.eid]}}, function(err,group) 
//     {
//          var c=Math.floor((Math.random()*4)+1);
        
//         if(err)
//         {
//             res.send(err.message);
//         }else
//         {
//             if(group)   
//           {
//             for(var i=0;i<group.actual_location.length;i++)
//             {
//                 if(group.actual_location[i].email==req.params.eid)
//                 {
//                     present=1;
//                     break;
//                 }
//             }
//             if(present==0){
                
//                 console.log(" not present");
                	         
// 	  cloudinary.v2.uploader.upload(req.file.path,{crop: "thumb", width:150, height: 100,quality:"auto",fetch_format:"auto",flags:"lossy" },async (err,result) =>{
       
//         if(err)
//         {
//             req.flash("error","Sorry!!!something went wrong");
//             return res.redirect("back");
//         }
        
//         var data = {"lat":req.body.latitude,"lng":req.body.longitude,"ip":0,"email":req.params.eid,"image":result.secure_url,"imageId":result.public_id,"icon":"http://maps.google.com/mapfiles/ms/icons/"+color[c]+"-dot.png"}
//               group.actual_location.push(data);
//               group.save();
//               console.log("group="+group);

    
//     });
    
 
               
//             }else
//             {
//                 cloudinary.v2.uploader.upload(req.file.path,{crop: "thumb", width:150, height: 100,quality:"auto",fetch_format:"auto",flags:"lossy" },async (err,result) =>{
       
//         if(err)
//         {
//             req.flash("error","Sorry!!!something went wrong");
//             return res.redirect("back");
//         }
        
//                 group.actual_location[i].imageId=result.public_id;
//                 group.actual_location[i].image  = result.secure_url;
//                 group.actual_location[i].lat=req.body.latitude;
//                 group.actual_location[i].lng=req.body.longitude;
//                 group.save();
//               console.log("group="+group);

    
//     });
    
                
                
//             }
//               res.redirect("/show/"+req.params.gid+"/"+req.params.eid);
//           }
//             else
//             res.render("error.ejs",{email:req.params.eid});
//         }
        
        
//     });
// })


// router.get("/showrefresh/:gid/:eid",function(req, res) {
//     console.log("inside showrefresh");
//     group.findOne({"_id":req.params.gid,"email_ids":{$in:[req.params.eid]}},function(err, group) {
//         if(group)
//         {
//             // console.log("----------------group in need="+group);
//              res.json(group);
//         //       console.log("----------------");
//         // }
//         }
//           else
//           res.render("error.ejs",{email:req.params.eid})
//     })
  
// })


// router.get("/show/:gid/:eid",function(req, res) {
 
//     group.findOne({"_id":req.params.gid,"email_ids":{$in:[req.params.eid]}},function(err, group) {
//         if(group)
//           res.render("show3.ejs",{group:null,gid:group._id,userEmail:req.params.eid});
//           else
//           res.render("error.ejs",{email:req.params.eid})
//     })
  
// })
// //CREATE - add new campground to DB
// router.get("/getlocation", function(req, res){
//   // get data from form and add to campgrounds array
  
//   geocoder.reverse({lat:45.767,lon:4.833}, function (err, data) {
//     if (err || !data.length) {
//       req.flash('error', 'Invalid address');
//       return res.redirect('back');
//     }res.send(data);
//     // var lat = data[0].latitude;
//     // var lng = data[0].longitude;
//     // var location = data[0].formattedAddress;
    
  
//   });
// });

// module.exports = router;