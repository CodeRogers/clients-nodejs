import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ClientModule,
    CityModule,
    StateModule,
  ],
})
export class AppModule {}
