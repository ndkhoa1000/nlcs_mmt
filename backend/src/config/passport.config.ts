import { Request } from "express";
import { config } from "./app.config";
import { ProviderEnum } from "../enums/account-provider.enums";
import { NotFoundException } from "../utils/appError";

import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as LocalStrategy} from "passport-local";

import { loginOrCreateAccountService, verifyUserService } from "../services/auth.service";
import { verify } from "crypto";

passport.use( new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL:config.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback:true,
    }, async (req: Request, accessToken, refreshToken, profile, done) => {
        try {
            const { email, sub: googleId, picture } = (profile as any)._json;
            console.log('profile', profile);
            console.log('googleId', googleId);
            if(!googleId){
                throw new NotFoundException("Google ID (sub) is missing");
            };
            const { user } = await loginOrCreateAccountService({
                provider: ProviderEnum.GOOGLE,
                displayName: profile.displayName,
                providerId: googleId,
                picture: picture,
                email: email,
            });
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
    )
);

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session:true  
},async (email, password, done) =>{
    try {
        const user = await verifyUserService({email, password});
        return done(null, user as any);
} catch (error: any) {
        return done(error, false, {message: error.message})
    }
}));
passport.serializeUser((user:any, done) => done(null, user));
passport.deserializeUser((user:any, done) => done(null, user));