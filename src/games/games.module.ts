import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';

// Modules
// Components
import { GamesGateway } from './games.gateway';
import { GamesService } from './games.service';


@Module({
  imports: [AuthModule, DbModule],
  providers: [GamesGateway, GamesService],
})
export class GamesModule {}