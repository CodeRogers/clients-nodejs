import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './client.entity';
import { CityRepository } from '../city/city.repository';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository) private clientRepository: ClientRepository,
    @InjectRepository(CityRepository) private cityRepository: CityRepository,
  ) {}

  // Create a new Client in the database
  async create(client: CreateClientDto): Promise<Client> {
    const city = await this.cityRepository.findOne(client.city_id);

    if (!city)
      throw new BadRequestException(
        `Couldn't find any City with id: '${client.city_id}'`,
      );

    return await this.clientRepository.save(client);
  }

  // Find all the Clients from the database
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  // Find one Client from the database by id
  async findOne(id: number): Promise<Client> {
    const clientById = await this.clientRepository.findOne(id);

    if (!clientById)
      throw new NotFoundException(`Couldn't find any Client with id: '${id}'`);

    return clientById;
  }

  // Find one Client from tha database by name
  findClientByName(name: string): Promise<Client> {
    return this.clientRepository.findClientByName(name);
  }

  // Update one Client from the database by id
  async update(id: number, client: UpdateClientDto): Promise<void> {
    await this.findOne(id);
    const city = await this.cityRepository.findOne(client.city_id);

    if (!city)
      throw new BadRequestException(
        `Couldn't find any City with id: '${client.city_id}'`,
      );

    await this.clientRepository.update(id, client);
  }

  // Delete one Client from the database by id
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.clientRepository.delete(id);
  }
}
