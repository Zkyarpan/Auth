// Import the 'jsonwebtoken' package
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Define a middleware function called 'requireAuth'
const requireAuth = (req, res, next) => {
  // Retrieve the JWT from the 'jwt' cookie in the incoming request
  const token = req.cookies.jwt;

  // Check if the JWT exists
  if (token) {
    // Verify the JWT using the provided secret key
    jwt.verify(token, "Its Me Arpan Secret", (err, decodedToken) => {
      // If there's an error during verification
      if (err) {
        console.log(err.message);
        // Redirect the user to the login page
        res.redirect("/login");
      } else {
        // If the JWT is successfully verified, log the decoded token
        console.log(decodedToken);
        // Call the 'next' function to proceed to the next middleware/route handler
        next();
      }
    });
  } else {
    // If no JWT is found, redirect the user to the login page
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "Its Me Arpan Secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Export the 'requireAuth' middleware function for use in other parts of the application
module.exports = { requireAuth , checkUser };
