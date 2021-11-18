import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async validate(token: string, isWs: boolean = false): Promise<any> {
    try {
       //this.jwtService.decode(token);
       const payload =this.jwtService.verify(token);
      //console.log(payload);
      
      if (!payload) {
        if (isWs) {
          throw new WsException("No user in jwt");
        }
        throw new HttpException("No user in jwt", HttpStatus.BAD_REQUEST);
      }
      return payload;
    } catch (err) {
      //console.log(err);
      if (isWs) {
        throw new WsException(err)
      }
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}