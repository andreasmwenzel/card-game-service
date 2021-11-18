import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class WsGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ) {
  }

  async canActivate(
    context: any,
  ): Promise<any>{
    const bearerToken = context.args[0].handshake.headers.jwt;
    try {
      context.switchToHttp().getRequest().user = await this.authService.validate(bearerToken, true);
      return true;
    } catch(e) {
      throw new WsException(e)
      return false;
    }
    // try {
    //   
    //   return new Promise((resolve, reject) => {
    //     if (decoded.user) {
          
    //       resolve(dec);
    //     }
    //     return this.userService.findByUsername(decoded.username).then(user => {
    //       if (user) {
    //         resolve(user);
    //       } else {
    //         reject(false);
    //       }
    //     });

    //   });
    // } catch (ex) {
    //   console.log(ex);
    //   return false;
    // }
  }
}