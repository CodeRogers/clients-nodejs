import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StateRepository } from './state.repository';
import { StateService } from './state.service';

const mockStateRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('StateService', () => {
  let stateService: StateService;
  let stateRepository: StateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        { provide: StateRepository, useFactory: mockStateRepository },
      ],
    }).compile();

    stateService = module.get<StateService>(StateService);
    stateRepository = module.get<StateRepository>(StateRepository);
  });

  it('should be defined', () => {
    expect(stateService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of States', async () => {
      const mockStates = [
        {
          id: 1,
          name: 'Ceará',
          cities: [],
        },
        {
          id: 2,
          name: 'Piauí',
          cities: [],
        },
      ];
      jest.spyOn(stateRepository, 'find').mockResolvedValue(mockStates);
      const result = await stateService.findAll();
      expect(result).toEqual(mockStates);
    });
  });

  describe('findOne', () => {
    it('should return a State', async () => {
      const mockState = {
        id: 1,
        name: 'Ceará',
        cities: [],
      };

      jest.spyOn(stateRepository, 'findOne').mockResolvedValue(mockState);
      const result = await stateService.findOne(1);
      expect(result).toEqual(mockState);
    });

    it('should return error 404 State with "id"', async () => {
      jest.spyOn(stateRepository, 'findOne').mockResolvedValue(null);
      expect(stateService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('', () => {
    it('should return a created State', async () => {
      const mockState = {
        name: 'Ceará',
      };
    });
  });
});
