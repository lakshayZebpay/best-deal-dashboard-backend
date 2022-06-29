const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user_model')


app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://GSM1023-zebpay:GSM1023-zebpay@cluster0.anp6t.mongodb.net/user-data?retryWrites=true&w=majority')
//mongoose.connect('mongodb://localhost:27017/Group_D_Tables')

app.post("/api/register",async (req,res) => {
    console.log(req.body);
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
        })
        res.json({ status: 'ok'})
    } catch (err) {
        res.json({ status: 'err',error: 'Duplicate Email'})
    }
   
});


app.post("/api/login",async (req,res) => {

        const user = await User.findOne({number: req.body.number, password: req.body.password})


        if(user){
            return res.json({status:'ok',user:true});
             
        }
        else{
            return res.json({status:'error',user:false});
             
        }
    
});

app.listen(1337,function(){
    console.log("request started on port 1337");
});

