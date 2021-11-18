import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { HeartsGameInfo, HeartsPlayer } from 'ts-card-games';

@Injectable()
export class DbService {
  
  private supabase;

  private logger = new Logger("Supabase");
  constructor() {
    this.supabase = createClient("https://mkoepnxhpbnboruovpsj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM1MjgxNDE1LCJleHAiOjE5NTA4NTc0MTV9.WuH5CLE3AF96QU0l5IdvCEeiEo9ghhXm7YGbGHrMwIg")
    this.logger.log("supabase connected");
  }

  async createGame(id, name, createdBy) {
    const { data, error } = await this.supabase
      .from("games")
      .insert([
        {id, type:1, state:"open", created_by:createdBy, name}
      ])
    this.logger.log(data, error);
  }

  async updateTable(gameInfo: HeartsGameInfo) {
    const { data, error } = await this.supabase
      .from('games')
      .upsert(
        {id: gameInfo.id, type:1, state: "open", name: gameInfo.id}
    )
  }

  async updatePlayerPosition(game_id: string, player_id: string, position: void) {
    const { data, error } = await this.supabase
      .from('player_game')
      .upsert(
        {game_id, profile_id:player_id, position}
    )
  }
  

}
