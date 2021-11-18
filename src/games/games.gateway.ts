import { Logger, Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from '@nestjs/websockets';
import { userInfo } from 'os';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.decorator';
import { WsGuard } from 'src/auth/ws-auth.guard';
import { HeartsGameInfo } from 'ts-card-games';
import { GamesService } from './games.service';

@WebSocketGateway(1080, {cors:true, serveClient:false})
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private gamesService: GamesService
  ) { }
  
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("GamesGateway");
  private socketUser: Map<string, string> = new Map(); //maps socket_id to user_id
  

  afterInit(server: Server) {
    this.logger.log("GamesGateway Alive");
  }

  async handleConnection(client: Socket, ...args: any[]) {
    let user;
    try {
      user = await this.authService.validate(
        client.handshake.headers.jwt as string,
        true
      );
    } catch (e) {
      client.send(e);
      client.disconnect();
      return;
    }
    this.socketUser.set(client.id, user.sub);
    this.logger.log(`user ${user.sub} connected`)
    
  }

  handleDisconnect(client: Socket) {
    const user = this.socketUser.get(client.id);
    
    if (user) {
      let gameInfo = this.gamesService.disconnect(user);
      if (gameInfo) {
        this.server.to(gameInfo.id).emit("gameInfo", gameInfo);
      }
    }
    this.logger.log(`client disconnected ${client.id}`);
    this.socketUser.delete(client.id);
    this.logger.log(`socketUsers now has ${this.socketUser.size} entries`)
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinGame')
  joinGame(
    @MessageBody('id') gameId: string,
    @MessageBody('position') position: number,
    @Request() req
  ): WsResponse<HeartsGameInfo | null>{
    return {event: "gameInfo", data:null}
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('createGame')
  async createGame(
    @MessageBody('name') name: string,
    @User() user,
  ) {
    this.logger.log(`Received new game request from ${user.sub} with name ${name}`)
    this.gamesService.createGame(user.sub, name);

  }
}
