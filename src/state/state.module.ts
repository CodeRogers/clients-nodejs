import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from './state.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StateRepository])],
  exports: [TypeOrmModule],
  controllers: [StateController],
  providers: [StateService]
})
export class StateModule {}
