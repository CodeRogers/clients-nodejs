import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { City } from './city.entity';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(): Promise<City[]> {
    return this.cityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<City> {
    return this.cityService.findOne(+id);
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string): Promise<City> {
    return this.cityService.findOneByName(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto): Promise<void> {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.cityService.remove(+id);
  }
}
