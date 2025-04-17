import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

// Passport has a built-in local strategy that can be used to authenticate users using a username and password.
// The local strategy is a simple way to authenticate users using a username and password. It is often used in conjunction with sessions or JWTs (JSON Web Tokens) for authentication in web applications.

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: "email",
        });
    }

    async validate (email: string, password: string) {
        const user = await this.authService.verifyUser(email, password); // Validate the user using the AuthService
        // Whatever return from here will be available in the request object as req.user\
        return user
    }
}