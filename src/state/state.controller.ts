import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './state.entity';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  create(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this.stateService.create(createStateDto);
  }

  @Get()
  findAll(): Promise<State[]> {
    return this.stateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<State> {
    return this.stateService.findOne(+id);
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string): Promise<State> {
    return this.stateService.findOneByName(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto): Promise<void> {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.stateService.remove(+id);
  }
}
