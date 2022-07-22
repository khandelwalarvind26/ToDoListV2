const express = require('express');
const BS = require('body-parser');
const https = require('https');
const app = express();
app.use(BS.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

let today = new Date();
let tasks = ["Cook Food", "Eat Food", "Wash Utensils"];
app.get('/',function(req,res) {
    let options = {weekday:"long", month:"long",day:"numeric"};
    let day = today.toLocaleDateString("en-US",options);
    res.render('list',{day:day,task:tasks});
});

app.post("/",function(req,res){
    let task = req.body.newtask;
    console.log(task);
    tasks.push(task);
    res.redirect("/");
});

app.listen(3000,function() {
    console.log("Server started on port 3000");
});