import { Test, TestingModule } from '@nestjs/testing';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityController } from './city.controller';
import { CityService } from './city.service';

describe(`CityController`, () => {
  let cityController: CityController;

  const mockCityService = {
    create: jest.fn((dto: CreateCityDto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [
        {
          id: 1,
          name: 'City',
          state_id: 1,
        },
        {
          id: 2,
          name: 'City',
          state_id: 1,
        },
      ];
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        name: 'City',
        state_id: 1,
      };
    }),
    findOneByName: jest.fn((name: string) => {
      return {
        id: 1,
        name,
        state_id: 1,
      };
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateCityDto) => {
      return;
    }),
    remove: jest.fn().mockImplementation((id: string) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [{ provide: CityService, useValue: mockCityService }],
    }).compile();

    cityController = module.get<CityController>(CityController);
  });

  it(`should be defined`, () => {
    expect(cityController).toBeDefined();
  });

  it(`should create a City`, () => {
    const dto = {
      name: 'City',
      state_id: 1,
    };
    expect(cityController.create(dto)).toEqual({
      id: expect.any(Number),
      name: 'City',
      state_id: expect.any(Number),
    });
    expect(mockCityService.create).toHaveBeenCalledWith(dto);
  });

  it(`shoud findAll Citys`, () => {
    expect(cityController.findAll()).toEqual([
      {
        id: expect.any(Number),
        name: 'City',
        state_id: expect.any(Number),
      },
      {
        id: expect.any(Number),
        name: 'City',
        state_id: expect.any(Number),
      },
    ]);
    expect(mockCityService.findAll).toHaveBeenCalled();
  });

  it(`should find a City by id: 'id'`, () => {
    expect(cityController.findOne('1')).toEqual({
      id: expect.any(Number),
      name: 'City',
      state_id: expect.any(Number),
    });
    expect(mockCityService.findOne).toHaveBeenCalledWith(1);
  });

  it(`should find a City by name: 'name'`, () => {
    expect(cityController.findOneByName('City')).toEqual({
      id: expect.any(Number),
      name: 'City',
      state_id: expect.any(Number),
    });
    expect(mockCityService.findOneByName).toHaveBeenCalled();
  });

  it(`should update a City by id: 'id'`, () => {
    const dto = { name: 'City' };
    cityController.update('1', dto);
    expect(mockCityService.update).toHaveBeenCalledWith(1, dto);
  });

  it(`should delete a City by id:'id'`, () => {
    cityController.remove('1');
    expect(mockCityService.remove).toHaveBeenCalledWith(1);
  });
});
