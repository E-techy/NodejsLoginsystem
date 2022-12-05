const express= require('express')
const upload =require('express-fileupload')
const fs=require("fs")
const app=express()
app.use(upload())
app.use(express.static('public'))

app.set("views",'./viewsmen')

app.set("view engine","ejs")
app.use(signUp);
app.use(logger);

app.post("/login",(req,res)=>{
  if (req.files){
  var file=req.files.file;
  var file2=req.files.file2;
  var filename2=file2.name;
  var filename=file.name
  file.mv('./uploads/photos/'+Date.now()+filename,(err)=>{
    if (err) {
      res.send(err)
    }else{
      res.send("File Uploaded Successfully")
    }
  })

  file2.mv('./uploads/videos/'+Date.now()+filename2,(err)=>{
   if(err)console.log(err);
  })
}
})

app.get("/",(req,res)=>{
 if (req.query.new_username==undefined) {
  res.render("signup")
  console.log("Someone has connected to the user id creation page");
 } 

})

app.get("/login",(req,res)=>{
 res.render("login",{text:"aman"})
 console.log("Someone wants to log into his account.");

})


function logger(req,res,next) {
 if (req.originalUrl=="/login?username="+req.query.username+"&password="+req.query.password && req.query.username!= undefined && 
      req.query.password!= undefined) {

  var checkUserPassword=false;
  var checkUser="There is no user id with this name: "+req.query.username;
  //validating username with password
  var path="./"+req.query.username+".json" 
  try {
    const file=fs.readFileSync(path,"utf-8")
    const json=JSON.parse(file)
    if (json.password==req.query.password) {
      checkUserPassword=true;
    }
  } catch (error) {
    checkUser="Not found"
  }
   if (checkUserPassword==true) {
  res.render("loggedUp",{username:req.query.username})
  console.log(req.query.username+" has connected to our platform");
  return;
 }
 else if(checkUserPassword==false){
   if (checkUser=="Not found") {
    res.send(checkUser+" any user with this name.")
    return;
   }
  res.render("error",{pass: req.query.password,user: req.query.username})
  console.log("someone has tried to access "+req.query.username +" acccount.");
  return;
 }
 }
 next();
}

function signUp(req,res,next) {
  if (req.originalUrl!="/?new_username=&new_password=" && req.query.new_username!= undefined && req.query.new_password != undefined) {
   
    const userData={
      username: req.query.new_username,
      password : req.query.new_password
    }
    const json=JSON.stringify(userData);
    const path=req.query.new_username+".json"
    fs.writeFileSync(path,json)
    res.render("newUserCongrats",{username:req.query.new_username});
    console.log("A new user "+req.query.new_username+" has signed up to our platform.");
  }
  next();
}

app.listen(3000,()=>{
  console.log("listening at port 3000");
 
});