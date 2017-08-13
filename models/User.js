const mongoose = require('mongoose');
const Schema = mongoose.Schema; // another way to do it - const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String
});

mongoose.model('users', userSchema);
