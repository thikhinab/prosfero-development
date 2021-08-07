const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/user");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

//JWT STRATEGY
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        return done(null, jwtPayload.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

//LOCAL STRATEGY
passport.use(
  "login",
  new localStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        return done(null, false, { message: "Wrong Password" });
      }

      return done(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return done(error);
    }
  })
);
