import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StateRepository } from './state.repository';
import { StateService } from './state.service';

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneByName: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockStateToCreate = {
  name: 'State',
};

const mockState = {
  id: 1,
  name: 'State',
};

const mockStateWithCity = {
  id: 1,
  name: 'State',
  cities: [],
};

const mockStates = [mockStateWithCity, mockStateWithCity, mockStateWithCity];

describe(`StateService`, () => {
  let stateService: StateService;
  let stateRepository: StateRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StateService,
        { provide: StateRepository, useValue: mockRepository },
      ],
    }).compile();

    stateService = moduleRef.get<StateService>(StateService);
    stateRepository = moduleRef.get<StateRepository>(StateRepository);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.findOneByName.mockReset();
    mockRepository.save.mockReset();
    mockRepository.create.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it(`shoud be defined`, async () => {
    expect(stateService).toBeDefined();
  });

  describe(`findAll`, () => {
    it(`should return an array of State`, async () => {
      const spy = mockRepository.find.mockResolvedValue(mockStates);
      const result = await stateService.findAll();
      expect(result).toEqual(mockStates);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOne`, () => {
    it(`should return a State by id`, async () => {
      const spy = mockRepository.findOne.mockResolvedValue(mockState);
      const result = await stateService.findOne(1);
      expect(result).toEqual(mockState);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundExeception when not found State with id: 'id'`, async () => {
      const spy = mockRepository.findOne.mockResolvedValue(null);
      expect(stateService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`findOneByName`, () => {
    it(`should return a State by name`, async () => {
      const spy =
        mockRepository.findOneByName.mockResolvedValue(mockStateWithCity);
      const result = await stateService.findOneByName('State');
      expect(result).toEqual(mockStateWithCity);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when not found State with name: 'name'`, async () => {
      const spy = mockRepository.findOneByName.mockResolvedValue(null);
      expect(stateService.findOneByName('State')).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`create`, () => {
    it(`should return a State created`, async () => {
      const spy1 = mockRepository.create;
      const spy2 = mockRepository.save.mockResolvedValue(mockState);
      const result = await stateService.create(mockStateToCreate);
      expect(result).toEqual(mockState);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to create a State`, () => {
      const spy1 = mockRepository.create;
      const spy2 = mockRepository.save.mockResolvedValue(null);
      const spy3 = mockRepository.findOneByName.mockResolvedValue(null);
      const result = stateService.create(mockStateToCreate);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
    it(`shoud return ConflicExecption when State is already created`, () => {
      const spy = mockRepository.findOneByName.mockResolvedValue(mockState);
      const result = stateService.create(mockStateToCreate);
      expect(result).rejects.toThrow(ConflictException);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`update`, () => {
    it(`should update a State with id: 'id'`, async () => {
      const spy1 = mockRepository.update;
      const spy2 = mockRepository.findOne.mockResolvedValue(mockState);
      await stateService.update(1, mockState);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return NotFoundException when couldn't find any State with id:'id'`, () => {
      const spy1 = mockRepository.update;
      const spy2 = mockRepository.findOne.mockResolvedValue(null);
      const result = stateService.update(1, mockState);
      expect(result).rejects.toThrow(NotFoundException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it(`should return InternalServerErrorException when fail to update a State`, () => {
      const spy1 = mockRepository.update.mockRejectedValue(
        new InternalServerErrorException(),
      );
      const spy2 = mockRepository.findOne.mockResolvedValue(mockState);
      const result = stateService.update(1, mockState);
      expect(result).rejects.toThrow(InternalServerErrorException);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    describe(`delete`, () => {
      it(`should delete a State with id: 'id'`, async () => {
        const spy1 = mockRepository.delete;
        const spy2 = mockRepository.findOne.mockResolvedValue(mockState);
        await stateService.remove(1);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
      it(`should return NotFoundException when couldn't find any State with id: 'id'`, () => {
        const spy1 = mockRepository.delete;
        const spy2 = mockRepository.findOne.mockResolvedValue(null);
        const result = stateService.remove(1);
        expect(result).rejects.toThrow(NotFoundException);
        expect(spy1).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
      it(`should return InternalServerErrorException when fail to delete a State`, () => {
        const spy1 = mockRepository.delete.mockRejectedValue(
          new InternalServerErrorException(),
        );
        const spy2 = mockRepository.findOne.mockResolvedValue(mockState);
        const result = stateService.remove(1);
        expect(result).rejects.toThrow(InternalServerErrorException);
        expect(spy1).toHaveBeenCalledTimes(0);
        expect(spy2).toHaveBeenCalledTimes(1);
      });
    });
  });
});
