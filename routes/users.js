const mongoose = require('mongoose')
const { strategies } = require('passport')
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/minifacebookprj")

const userSchema = mongoose.Schema(
  {
    username: String,
    name: String,
    email: String,
    password: String,
    pic: String,
    details:String,
  }
)

userSchema.plugin(plm)

module.exports= mongoose.model("user",userSchema)


