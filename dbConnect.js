const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://taufiq:taufiq12345@pos.rp2ph.mongodb.net/?retryWrites=true&w=majority');

let connectionObj = mongoose.connection

connectionObj.on('connected' , ()=>{
    console.log('Mongo DB Connection Successfull')
})

connectionObj.on('error' , ()=>{
    console.log('Mongo DB Connection Failed')
})