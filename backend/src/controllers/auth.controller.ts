import {NextFunction, Request, Response} from 'express';
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from '../config/app.config';
import { LoginSchema, registerSchema } from '../validation/auth.validation';
import { register } from 'module';
import { HTTPSTATUS } from '../config/http.config';
import { registerService } from '../services/auth.service';
import passport from 'passport';

// OAuth
export const googleLoginCallback = asyncHandler(
    async(req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace){
        return res.redirect(
            `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure` 
        )
    }
    return res.redirect(
        `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    )
})

// register new local user
export const registerController = asyncHandler
(async(req: Request, res: Response) => {
    const body = registerSchema.parse({
        ...req.body,
    });
    await registerService(body);
    return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully.",
    })
})
//local login
export const loginController = asyncHandler(
(async(req: Request, res: Response, next: NextFunction) => {
   passport.authenticate("local", (
    err: Error | null, 
    user: Express.User | false,
    info: {message: string} | undefined,
    ) => {
        if (err) {
            return next(err);
        }
        if(!user){
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password."
            })
        }
        req.logIn(user, (err) => {
            if(err){
                return next(err);
            }
            
            return res.status(HTTPSTATUS.OK).json({
                message: "Logged in successfully.",
                user,
            });
        });
    })(req, res, next)
})
)
//logout
export const logoutController = asyncHandler(
    async(req: Request, res: Response) => {
    req.logOut((err) => {
        if (err){
            console.log("logout failed:" + err.message);
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
            .json({error:"Cannot logout, please try again later."})
        };

        req.session.destroy((err) => {
            console.log('Session destruction failed:', err);
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
            .json({error:"Cannot complete logout, please try again later."})
        });
        res.clearCookie('connect.sid'); //test clear cookies
        return res.status(HTTPSTATUS.OK).json("logout successfully.")
    })
})
// get current user profile