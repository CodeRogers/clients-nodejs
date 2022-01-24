import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateStateDto } from './dto/create-state.dto';
import { State } from './state.entity';

@EntityRepository(State)
export class StateRepository extends Repository<State> {
  async createState(createStateDto: CreateStateDto): Promise<State> {
    const stateByName = await this.findOne(createStateDto.name);

    if (stateByName)
      throw new ConflictException(
        `State '${createStateDto.name}' already exist`,
      );

    const state = this.create(createStateDto);
    const stateSaved = await this.save(state);
    if (!stateSaved)
      throw new InternalServerErrorException(`Couldn't create a State`);
      
    return stateSaved;
  }

  async findOneByName(name: string) {
    let stateByName = await this.find({ relations: ['cities'] });
    stateByName = stateByName.filter(
      (state) => state.name.toLowerCase() === name.toLowerCase(),
    );

    if (!stateByName[0])
      throw new NotFoundException(
        `Could not find any State with name: '${name}'`,
      );

    return stateByName[0];
  }
}
