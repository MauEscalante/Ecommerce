const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport=require("passport")
import {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} from '../config.js'



//configuracion autenticacion google///////////
passport.use(
"auth-google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:`http://localhost:3000/auth/auth/google`,
      passReqToCallback:true,
      scope:[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    },
    function (accessToken, refreshToken, profile, callback) {
			User.findOrCreate({googleId:profile.id},function(err,user){
                return done(err,user);
            })
		}
))

passport.serializeUser((user,done)=>{
    done(null,user)
  })
  
  passport.deserializeUser((user,done)=>{
    done(null,user)
  })