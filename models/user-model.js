const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: true, minlength: 6, maxlength: 50 },
  email: { type: String, required: true, minlength: 8, maxlength: 50 },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

//compare is password match
userSchema.methods.comparePassword = async function (password, isMatch) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return isMatch(null, result);
  } catch (error) {
    return isMatch(error, result);
  }
};

//new user or when user try to modified password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 12);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
