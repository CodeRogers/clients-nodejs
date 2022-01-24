import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from '../state/state.repository';
import { CityRepository } from './city.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CityRepository, StateRepository])],
  exports: [TypeOrmModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
