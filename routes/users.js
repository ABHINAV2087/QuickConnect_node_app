const mongoose = require('mongoose');
const { strategies } = require('passport');
const plm = require('passport-local-mongoose');
require('dotenv').config(); // Ensure you have dotenv installed

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Define the schema
const userSchema = new mongoose.Schema(
  {
    username: String,
    name: String,
    email: String,
    password: String,
    pic: String,
    details: String,
  }
);

// Plugin passport-local-mongoose for authentication
userSchema.plugin(plm);

// Export the model
module.exports = mongoose.model('user', userSchema);
