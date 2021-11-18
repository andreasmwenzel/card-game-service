import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Hearts, HeartsGameInfo, HeartsPlayer } from 'ts-card-games';

@Injectable()
export class GamesService {
  private logger: Logger = new Logger("Games Service")
  private games: Map<string, Hearts> = new Map(); //maps uuids to Hearts game objects
  private players: Map<string, HeartsPlayer> = new Map(); //maps user_ids to Player Objects
  
  constructor(
    private dbService: DbService,
  ) { }

  joinGame(userId:string, gameId:string, position):boolean {
    return false;
  }

  disconnect(userId:string): HeartsGameInfo | null {
    const player = this.players.get(userId);
    if (!player) {
      return null;
    }
    const gameId = player?.gameId;
    if (gameId) {
      player.leaveGame();
      this.logger.log(`${player.name} has left game ${gameId}`)
      return this.games.get(gameId).gameInfo;
    }
    return null;
  }


  async createGame(userId, name): Promise<HeartsGameInfo|null> {
    if (this.players.get(userId)) {
      return null;
    }
    const game = new Hearts({name});
    this.games.set(game.id, game);
    await this.dbService.createGame(game.id, name, userId);
    
    const player = game.addPlayer({name:userId, id:userId});
    this.players.set(userId, player);

    return game.gameInfo;
  }
}
