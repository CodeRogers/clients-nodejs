import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StateRepository } from '../state/state.repository';
import { CityRepository } from './city.repository';
import { CityService } from './city.service';

const mockCityRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneByName: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createCity: jest.fn(),
};

const mockStateRepository = {
  findOne: jest.fn(),
};

const mockCity = {
  id: 1,
  name: 'City',
  state_id: 1,
};

const mockState = {
  id: 1,
  name: 'State',
};

const mockCityToCreate = {
  name: 'City',
  state_id: 1,
};

const mockCityWithClients = {
  id: 1,
  name: 'City',
  state_id: 1,
  clients: [],
};

const mockCitys = [
  mockCityWithClients,
  mockCityWithClients,
  mockCityWithClients,
];

describe(`CityService`, () => {
  let cityService: CityService;
  let cityRepository: CityRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CityService,
        { provide: StateRepository, useValue: mockStateRepository },
        { provide: CityRepository, useValue: mockCityRepository },
      ],
    }).compile();

    cityService = moduleRef.get<CityService>(CityService);
    cityRepository = moduleRef.get<CityRepository>(CityRepository);
  });

  beforeEach(() => {
    mockCityRepository.find.mockReset();
    mockCityRepository.findOne.mockReset();
    mockCityRepository.findOneByName.mockReset();
    mockCityRepository.save.mockReset();
    mockCityRepository.create.mockReset();
    mockCityRepository.update.mockReset();
    mockCityRepository.delete.mockReset();
    mockCityRepository.createCity.mockReset();
    mockStateRepository.findOne.mockReset();
  });

  it(`shoud be defined`, async () => {
    expect(cityService).toBeDefined();
  });

  describe(`findAll`, () => {
    it(`should return an array of City`, async () => {
      const spy = mockCityRepository.find.mockResolvedValue(mockCitys);
      const result = await cityService.findAll();
      expect(result).toEqual(mockCitys);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOne`, () => {
    it(`should return a City by id`, async () => {
      const spy = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const result = await cityService.findOne(1);
      expect(result).toEqual(mockCity);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundExeception when not found City with id: 'id'`, async () => {
      const spy = mockCityRepository.findOne.mockResolvedValue(null);
      expect(cityService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOneByName`, () => {
    it(`should return a City by name`, async () => {
      const spy =
        mockCityRepository.findOneByName.mockResolvedValue(mockCityWithClients);
      const result = await cityService.findOneByName('City');
      expect(result).toEqual(mockCityWithClients);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when not found City with name: 'name'`, async () => {
      const spy = mockCityRepository.findOneByName.mockResolvedValue(null);
      expect(cityService.findOneByName('City')).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`create`, () => {
    it(`should return a City created`, async () => {
      const spy1 = mockStateRepository.findOne.mockResolvedValue(mockState);
      const spy2 = mockCityRepository.create;
      const spy3 = mockCityRepository.createCity.mockResolvedValue(mockCity);
      const result = await cityService.create(mockCityToCreate);
      expect(result).toEqual(mockCity);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to create a City`, () => {
      const spy1 = mockStateRepository.findOne.mockResolvedValue(mockState);
      const spy2 = mockCityRepository.createCity.mockResolvedValue(null);
      const result = cityService.create(mockCityToCreate);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
    it(`shoud return ConflicExecption when City is already created`, () => {
      const spy1 = mockStateRepository.findOne.mockResolvedValue(mockState);
      const spy2 = mockCityRepository.createCity.mockRejectedValue(
        new ConflictException(),
      );
      const result = cityService.create(mockCityToCreate);
      expect(result).rejects.toThrow(ConflictException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
    it(`should return BadRequestException when couldn't find any city with id:'id'`, () => {
      const spy1 = mockStateRepository.findOne.mockResolvedValue(null);
      const spy2 = mockCityRepository.create;
      const spy3 = mockCityRepository.save.mockResolvedValue(mockCity);
      const result = cityService.create(mockCityToCreate);
      expect(result).rejects.toThrow(BadRequestException);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(0);
    })
  });

  describe(`update`, () => {
    it(`should update a City with id: 'id'`, async () => {
      const spy1 = mockCityRepository.update;
      const spy2 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const spy3 = mockStateRepository.findOne.mockResolvedValue(mockState);
      await cityService.update(1, mockCity);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when couldn't find any City with id:'id'`, () => {
      const spy1 = mockCityRepository.update;
      const spy2 = mockCityRepository.findOne.mockResolvedValue(null);
      const result = cityService.update(1, mockCity);
      expect(result).rejects.toThrow(NotFoundException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return BadRequest when coouldn't find any State with state_id:'id'`, () => {
      const spy1 = mockCityRepository.update;
      const spy2 = mockStateRepository.findOne.mockResolvedValue(null);
      const spy3 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const result = cityService.update(1, mockCity);
      expect(result).rejects.toThrow(BadRequestException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to update a City`, () => {
      const spy1 = mockCityRepository.update.mockRejectedValue(
        new InternalServerErrorException(),
      );
      const spy2 = mockStateRepository.findOne.mockResolvedValue(mockState);
      const spy3 = mockCityRepository.findOne.mockResolvedValue(mockCity);
      const result = cityService.update(1, mockCity);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(1);
    });

    describe(`delete`, () => {
      it(`should delete a City with id: 'id'`, async () => {
        const spy1 = mockCityRepository.delete;
        const spy2 = mockCityRepository.findOne.mockResolvedValue(mockCity);
        await cityService.remove(1);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
      it(`should return NotFoundException when couldn't find any City with id: 'id'`, () => {
        const spy1 = mockCityRepository.delete;
        const spy2 = mockCityRepository.findOne.mockResolvedValue(null);
        const result = cityService.remove(1);
        expect(result).rejects.toThrow(NotFoundException);
        expect(spy1).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
      it(`should return InternalServerErrorException when fail to delete a City`, () => {
        const spy1 = mockCityRepository.delete.mockRejectedValue(
          new InternalServerErrorException(),
        );
        const spy2 = mockCityRepository.findOne.mockResolvedValue(mockCity);
        const result = cityService.remove(1);
        expect(result).rejects.toThrow(InternalServerErrorException);
        expect(spy1).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
    });
  });
});
