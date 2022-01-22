import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ClientModule,
    CityModule,
    StateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
