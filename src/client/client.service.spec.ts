import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CityRepository } from '../City/City.repository';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';

const mockClientRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneByName: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCityRepository = {
  findOne: jest.fn(),
};

const mockClient = {
  id: 1,
  name: 'Client',
  gender: 'Gender',
  birth_date: '1990-02-16',
  age: 18,
  city_id: 1,
};

const mockCity = {
  id: 1,
  name: 'City',
};

const mockClientToCreate = {
  name: 'Client',
  gender: 'Gender',
  birth_date: '1990-02-16',
  age: 18,
  city_id: 1,
};

const mockClients = [mockClient, mockClient, mockClient];

describe(`ClientService`, () => {
  let clientService: ClientService;
  let clientRepository: ClientRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: CityRepository, useValue: mockCityRepository },
        { provide: ClientRepository, useValue: mockClientRepository },
      ],
    }).compile();

    clientService = moduleRef.get<ClientService>(ClientService);
    clientRepository = moduleRef.get<ClientRepository>(ClientRepository);
  });

  beforeEach(() => {
    mockClientRepository.find.mockReset();
    mockClientRepository.findOne.mockReset();
    mockClientRepository.findOneByName.mockReset();
    mockClientRepository.save.mockReset();
    mockClientRepository.create.mockReset();
    mockClientRepository.update.mockReset();
    mockClientRepository.delete.mockReset();
    mockCityRepository.findOne.mockReset();
  });

  it(`shoud be defined`, async () => {
    expect(clientService).toBeDefined();
  });

  describe(`findAll`, () => {
    it(`should return an array of Client`, async () => {
      const spy = mockClientRepository.find.mockResolvedValue(mockClients);
      const result = await clientService.findAll();
      expect(result).toEqual(mockClients);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOne`, () => {
    it(`should return a Client by id`, async () => {
      const spy = mockClientRepository.findOne.mockResolvedValue(mockClient);
      const result = await clientService.findOne(1);
      expect(result).toEqual(mockClient);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundExeception when not found Client with id: 'id'`, async () => {
      const spy = mockClientRepository.findOne.mockResolvedValue(null);
      expect(clientService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOneByName`, () => {
    it(`should return a Client by name`, async () => {
      const spy =
        mockClientRepository.findOneByName.mockResolvedValue(mockClients);
      const result = await clientService.findOneByName('Client');
      expect(result).toEqual(mockClients);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when not found Client with name: 'name'`, async () => {
      const spy = mockClientRepository.findOneByName.mockResolvedValue(null);
      expect(clientService.findOneByName('Client')).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`create`, () => {
    it(`should return a Client created`, async () => {
      const spy1 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const spy2 = mockClientRepository.create;
      const spy3 = mockClientRepository.save.mockResolvedValue(mockClient);
      const result = await clientService.create(mockClientToCreate);
      expect(result).toEqual(mockClient);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to create a Client`, () => {
      const spy1 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const spy2 = mockClientRepository.save.mockResolvedValue(null);
      const result = clientService.create(mockClientToCreate);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
    it(`shoud return ConflicException when Client is already created`, () => {
      const spy1 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const spy2 = mockClientRepository.save.mockRejectedValue(
        new ConflictException(),
      );
      const result = clientService.create(mockClientToCreate);
      expect(result).rejects.toThrow(ConflictException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
    it(`should return BadRequestException when couldn't find any city with id:'id'`, () => {
      const spy1 = mockCityRepository.findOne.mockResolvedValue(null);
      const spy2 = mockClientRepository.create;
      const spy3 = mockClientRepository.save.mockResolvedValue(mockClient);
      const result = clientService.create(mockClientToCreate);
      expect(result).rejects.toThrow(BadRequestException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(0);
    })
  });

  describe(`update`, () => {
    it(`should update a Client with id: 'id'`, async () => {
      const spy1 = mockClientRepository.update;
      const spy2 = mockClientRepository.findOne.mockResolvedValue(mockClient);
      const spy3 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      await clientService.update(1, mockClient);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when couldn't find any Client with id:'id'`, () => {
      const spy1 = mockClientRepository.update;
      const spy2 = mockClientRepository.findOne.mockResolvedValue(null);
      const result = clientService.update(1, mockClient);
      expect(result).rejects.toThrow(NotFoundException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return BadRequest when coouldn't find any City with City_id:'id'`, () => {
      const spy1 = mockClientRepository.update;
      const spy2 = mockCityRepository.findOne.mockResolvedValue(null);
      const spy3 = mockClientRepository.findOne.mockResolvedValue(mockClient);
      const result = clientService.update(1, mockClient);
      expect(result).rejects.toThrow(BadRequestException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to update a Client`, () => {
      const spy1 = mockClientRepository.update.mockRejectedValue(
        new InternalServerErrorException(),
      );
      const spy2 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const spy3 = mockClientRepository.findOne.mockResolvedValue(mockClient);
      const result = clientService.update(1, mockClient);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
  });

  describe(`delete`, () => {
    it(`should delete a Client with id: 'id'`, async () => {
      const spy1 = mockClientRepository.delete;
      const spy2 = mockClientRepository.findOne.mockResolvedValue(mockClient);
      await clientService.remove(1);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when couldn't find any Client with id: 'id'`, () => {
      const spy1 = mockClientRepository.delete;
      const spy2 = mockClientRepository.findOne.mockResolvedValue(null);
      const result = clientService.remove(1);
      expect(result).rejects.toThrow(NotFoundException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to delete a Client`, () => {
      const spy1 = mockClientRepository.delete.mockRejectedValue(
        new InternalServerErrorException(),
      );
      const spy2 = mockClientRepository.findOne.mockResolvedValue(mockClient);
      const result = clientService.remove(1);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
  });
});
