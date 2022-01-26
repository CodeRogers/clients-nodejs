import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
    @InjectRepository(CityRepository) private cityRepository: CityRepository,
  ) {}

  // Create a new Client in the database
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const city = await this.cityRepository.findOne(createClientDto.city_id);

    if (!city)
      throw new BadRequestException(
        `Couldn't find any City with id: '${createClientDto.city_id}'`,
      );

    // var dob = new Date('06/24/2008');
    const dob = new Date(createClientDto.birth_date);
    //calculate month difference from current date in time
    const month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    const age_dt = new Date(month_diff);

    //extract year from date
    const year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    const age = Math.abs(year - 1970);

    //display the calculated age
    createClientDto.age = age;

    const client = this.clientRepository.create(createClientDto);
    const clientSaved = await this.clientRepository.save(client);
    if (!clientSaved)
      throw new InternalServerErrorException(`Couldn't create a client`);

    return clientSaved;
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
  async findOneByName(name: string): Promise<Client> {
    const clientByName = await this.clientRepository.findOneByName(name);

    if (!clientByName)
      throw new NotFoundException(
        `Couldn't find any Client with id: '${name}'`,
      );

    return clientByName;
  }

  // Update one Client from the database by id
  async update(id: number, updateClientDto: UpdateClientDto): Promise<void> {
    await this.findOne(id);
    const city = await this.cityRepository.findOne(updateClientDto.city_id);

    if (!city)
      throw new BadRequestException(
        `Couldn't find any City with id: '${updateClientDto.city_id}'`,
      );

    await this.clientRepository.update(id, updateClientDto);
  }

  // Delete one Client from the database by id
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.clientRepository.delete(id);
  }
}
