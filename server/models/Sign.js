const mongoose = require("mongoose")

const signSchema = new mongoose.Schema({

word:{
type:String,
required:true,
unique:true
},

videoUrl:{
type:String,
required:true
},

type:{
type:String,
default:"word"
}

})

module.exports = mongoose.model("Sign",signSchema)