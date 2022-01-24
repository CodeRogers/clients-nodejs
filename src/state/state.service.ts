import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './state.entity';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(StateRepository)
    private stateRepository: StateRepository,
  ) {}

  // Insert a new State into database
  async create(createStateDto: CreateStateDto): Promise<State> {
    return await this.stateRepository.createState(createStateDto);
  }

  // Find all States from the database
  async findAll(): Promise<State[]> {
    const states = await this.stateRepository.find({ relations: ['cities'] });

    return states;
  }

  // Find one State from the database by id
  async findOne(id: number): Promise<State> {
    const stateById = await this.stateRepository.findOne(id);

    if (!stateById)
      throw new NotFoundException(`Couldn't find any State with id: '${id}'`);

    return stateById;
  }

  // Find one State from the database by name, and also an array of cities related with it's
  async findOneByName(name: string): Promise<State> {
    return this.stateRepository.findOneByName(name);
  }

  // Update a State from the database by id
  async update(id: number, updateStateDto: UpdateStateDto): Promise<void> {
    const stateById = await this.findOne(id);
    await this.stateRepository.update(stateById, updateStateDto);
  }

  // Delete one State from the database by id
  async remove(id: number): Promise<void> {
    const stateById = await this.findOne(id);
    await this.stateRepository.delete(stateById);
  }
}
