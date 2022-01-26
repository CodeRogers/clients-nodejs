import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { City } from './city.entity';
import { CreateCityDto } from './dto/create-city.dto';

@EntityRepository(City)
export class CityRepository extends Repository<City> {
  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const cityByName = await this.findOne({
      where: { name: createCityDto.name },
    });

    if (cityByName && cityByName.state_id === createCityDto.state_id)
      throw new ConflictException(
        `City '${createCityDto.name}' already exist`,
      );

    return await this.save(createCityDto);
  }

  async findOneByName(name: string): Promise<City> {
    const cityByName = await this.findOne({
      where: { name: name },
    });

    return cityByName;
  }
}
