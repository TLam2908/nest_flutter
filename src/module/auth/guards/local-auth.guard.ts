import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
// This guard uses the local strategy to authenticate users using a username and password.
export class LocalAuthGuard extends AuthGuard('local') {}