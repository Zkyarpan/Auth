const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email."],
  },
  password: {
    type: String,
    required: [true, "Please enter an Password"],
    minlength: [6, "Minimum password length is 6 characters"],
    maxlength: 20,
  },
});
// fire a function after doc saved to db
// userSchema.post('save', function (doc, next) {
//   console.log("New user was created & saved.", doc);
//   next();
// });

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt)
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  // find the user by their email address and return it if found or null otherwise
    const user = await this.findOne({email});
    if (user) {
      const auth = await bcrypt.compare(password, user.password)
      if(auth){
        return user;
      }
      throw Error("Incorrect Password")

    }
    throw Error("Incorrect Email")
}

const User = mongoose.model("user", userSchema);
module.exports = User;
