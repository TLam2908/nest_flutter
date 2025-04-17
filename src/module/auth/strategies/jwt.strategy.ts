// Strategy that authenticates users using JWT tokens
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/module/users/users.service";

import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../token-payload.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Authentication
            ]),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), // This attribute use to verify the token
        })
    } 

    async validate(payload: TokenPayload) {
        const user = await this.usersService.getUser({ id: parseInt(payload.userId) })
        return user
    }
}