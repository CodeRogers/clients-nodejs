import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './city.entity';
import { CityRepository } from './city.repository';
import { StateRepository } from '../state/state.repository';

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

    const city = this.cityRepository.create(createCityDto);
    const citySaved = await this.cityRepository.createCity(city);

    if (!citySaved)
      throw new InternalServerErrorException(`Couldn't create a State`);

    return citySaved;
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
  async findOneByName(name: string): Promise<City> {
    const cityByName = await this.cityRepository.findOneByName(name);

    if (!cityByName)
      throw new NotFoundException(
        `Couldn't find any City with name: '${name}'`,
      );

    return cityByName;
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
