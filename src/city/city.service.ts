import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './city.entity';
import { CityRepository } from './city.repository';
import { StateRepository } from 'src/state/state.repository';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityRepository) private cityRepository: CityRepository,
    @InjectRepository(StateRepository) private stateRepository: StateRepository,
  ) {}

  // Insert a new City into database
  async create(createCityDto: CreateCityDto): Promise<City> {
    const state = await this.stateRepository.findOne(createCityDto.state_id);

    if (!state)
      throw new BadRequestException(
        `Couldn't find a State with id: '${createCityDto.state_id}'`,
      );

    return this.cityRepository.createCity(createCityDto);
  }

  // Find all Cities from the database
  async findAll(): Promise<City[]> {
    return await this.cityRepository.find();
  }

  // Find one City from the database by id
  async findOne(id: number): Promise<City> {
    const cityById = await this.cityRepository.findOne(id);

    if (!cityById)
      throw new NotFoundException(`Couldn't find any City with id: '${id}'`);

    return cityById;
  }

  // Find one City from the database by name
  findOneByName(name: string): Promise<City> {
    return this.cityRepository.findOneByName(name);
  }

  // Update a City from the database by id
  async update(id: number, updateCityDto: UpdateCityDto) {
    await this.findOne(id);
    const state = await this.stateRepository.findOne(updateCityDto.state_id);

    if (updateCityDto.state_id && !state)
      throw new BadRequestException(
        `Couldn't find any State with id: '${updateCityDto.state_id}'`,
      );

    await this.cityRepository.update(id, updateCityDto);
  }

  // Delete one City from the database by id
  async remove(id: number) {
    await this.findOne(id);
    await this.cityRepository.delete(id);
  }
}
