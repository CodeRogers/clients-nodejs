import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRepository } from '../city/city.repository';
import { ClientRepository } from './client.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRepository, CityRepository])],
  exports: [TypeOrmModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
