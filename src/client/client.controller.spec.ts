import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

describe(`ClientController`, () => {
  let clientController: ClientController;

  const mockClientService = {
    create: jest.fn((dto: CreateClientDto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [
        {
          id: 1,
          name: 'Client',
          gender: 'gender',
          birth_date: '1990-02-16',
          age: 31,
          city_id: 1,
        },
        {
          id: 2,
          name: 'Client',
          gender: 'gender',
          birth_date: '1990-02-16',
          age: 31,
          city_id: 1,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        name: 'Client',
        gender: 'gender',
        birth_date: '1990-02-16',
        age: 31,
        city_id: 1,
      };
    }),
    findOneByName: jest.fn((name: string) => {
      return {
        id: 1,
        name,
        gender: 'gender',
        birth_date: '1990-02-16',
        age: 31,
        city_id: 1,
      };
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateClientDto) => {
      return;
    }),
    remove: jest.fn().mockImplementation((id: string) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
  });

  it(`should be defined`, () => {
    expect(clientController).toBeDefined();
  });

  it(`should create a Client`, () => {
    const dto = {
      name: 'Client',
      gender: 'gender',
      birth_date: '1990-02-16',
      age: 18,
      city_id: 1,
    };
    expect(clientController.create(dto)).toEqual({
      id: expect.any(Number),
      name: 'Client',
      gender: 'gender',
      birth_date: '1990-02-16',
      age: expect.any(Number),
      city_id: expect.any(Number),
    });
    expect(mockClientService.create).toHaveBeenCalledWith(dto);
  });

  it(`shoud findAll Clients`, () => {
    expect(clientController.findAll()).toEqual([
      {
        id: expect.any(Number),
        name: 'Client',
        gender: 'gender',
        birth_date: '1990-02-16',
        age: expect.any(Number),
        city_id: expect.any(Number),
      },
      {
        id: expect.any(Number),
        name: 'Client',
        gender: 'gender',
        birth_date: '1990-02-16',
        age: expect.any(Number),
        city_id: expect.any(Number),
      },
    ]);
    expect(mockClientService.findAll).toHaveBeenCalled();
  });

  it(`should find a Client by id: 'id'`, () => {
    expect(clientController.findOne('1')).toEqual({
      id: expect.any(Number),
      name: 'Client',
      gender: 'gender',
      birth_date: '1990-02-16',
      age: expect.any(Number),
      city_id: expect.any(Number),
    });
    expect(mockClientService.findOne).toHaveBeenCalledWith(1);
  });

  it(`should find a Client by name: 'name'`, () => {
    expect(clientController.findOneByName('Client')).toEqual({
      id: expect.any(Number),
      name: 'Client',
      gender: 'gender',
      birth_date: '1990-02-16',
      age: expect.any(Number),
      city_id: expect.any(Number),
    });
    expect(mockClientService.findOneByName).toHaveBeenCalled();
  });

  it(`should update a Client by id: 'id'`, () => {
    const dto = { name: 'Client' };
    clientController.update('1', dto);
    expect(mockClientService.update).toHaveBeenCalledWith(1, dto);
  });

  it(`should delete a Client by id:'id'`, () => {
    clientController.remove('1');
    expect(mockClientService.remove).toHaveBeenCalledWith(1);
  });
});
