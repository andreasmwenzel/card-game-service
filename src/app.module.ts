import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [GamesModule, AuthModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
