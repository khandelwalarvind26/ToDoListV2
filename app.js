const express = require('express');
const BS = require('body-parser');
const date = require(__dirname + "/date.js");
const https = require('https');
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');
app.use(BS.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/"+"todolistDB");
const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});

const Task = mongoose.model('Task',taskSchema); 

const listSchema = new mongoose.Schema({
    name:String,
    list:[taskSchema]
});

const List = mongoose.model('List',listSchema);



const item1 = new Task({
    name:"Welcome To your ToDo List!"
});

const item2 = new Task({
    name:"Hit the + button to add new tasks."
});

const item3 = new Task({
    name:"<-- Hit this checkbox to delete a task."
});
const defaultItems = [item1,item2,item3];


app.get('/',function(req,res) {
    let day = date.getDate();
    Task.find({},function(err,task){
        if(err) console.log(err);
        else {
            if(task.length == 0) {
                task = defaultItems;
                Task.insertMany(task,function(err) {
                    if(err) console.log(err);
                    else console.log("Success");
                });
            }
        }
        res.render('list',{title:day,task:task,cond:0});
    });
    // console.log(tasks);
});



app.get("/:listId",function(req,res) {
    const name = _.capitalize(req.params.listId);
    List.findOne({name:name},function(err,li) {
        if(err) console.log(err);
        else {
            if(li === null) {
                const neIt = new List({
                    name:name,
                    list:defaultItems
                });
                li = neIt;
                neIt.save();
            }
            // console.log(li.list);
            res.render('list',{title:name,task:li.list,cond:1});
        }
    });
});



app.get("/about",function(req,res) {
    res.render("about");
});


app.post("/",function(req,res){
    const task = req.body.newtask;
    const curr = new Task({
        name:task
    });
    curr.save();
    res.redirect("/");
});

app.post("/deleteMain",function(req,res) {
    const id = req.body.checked;
    // console.log(req.url);
    Task.deleteOne({_id:id},function(err) {
        if(err) console.log(err);
        else console.log("Deleted");
    });
    // console.log(req.body.h1);
    res.redirect("/");
});

app.post("/:listId",function(req,res) {
    const name = _.capitalize(req.params.listId);
    const curr = new Task({
        name:req.body.newtask
    });
    // console.log(curr);
    List.findOne({name:name},function(err,obj) {
        if(err) console.log(err);
        else obj.list.push(curr);
        obj.save();
        // console.log(obj);
    });
    res.redirect("/"+name);
})



app.post("/:listId/delete",function(req,res){
    const name = _.capitalize(req.params.listId);
    const id = new mongoose.Types.ObjectId(req.body.checked);
    // console.log(id);
    List.findOne({name:name},function(err,task) {
        task.list.forEach(function(curr,ind,arr) {
            // console.log(curr._id);
            if(curr._id.equals(id)) {
                // console.log(curr.name);
                arr.splice(ind,1);
            }
        });
        // console.log(task);
        task.save();
    });
    res.redirect("/"+name);
});



app.listen(3000,function() {
    console.log("Server started on port 3000");
});