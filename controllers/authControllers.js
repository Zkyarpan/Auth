const User = require("../models/user");
const jwt = require("jsonwebtoken");

// handel errors
const handelErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };


// incorrect email
if(err.message === 'Incorrect Email'){
  errors.email = "that email is not registered" ;
    return errors;
}
// incorrect password
if(err.message === 'Incorrect Password'){
  errors.password = "that Password is not registered" ;
    return errors;
}


  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already register";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'Its Me Arpan Secret', {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handelErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({user: user._id})
  } catch (error) {
    const errors = handelErrors(error);
    res.status(400).json({errors});
  }

};

module.exports.logout_get = (req,res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
}
