import { Test, TestingModule } from '@nestjs/testing';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateController } from './state.controller';
import { StateService } from './state.service';

describe(`StateController`, () => {
  let stateController: StateController;

  const mockStateService = {
    create: jest.fn((dto: CreateStateDto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [
        { id: 1, name: 'State' },
        { id: 1, name: 'State' },
      ];
    }),
    findOne: jest.fn((id) => {
      return { id, name: 'State' };
    }),
    findOneByName: jest.fn((name) => {
      return { id: 1, name };
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateStateDto) => {
      return;
    }),
    remove: jest.fn().mockImplementation((id: string) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compile();

    stateController = module.get<StateController>(StateController);
  });

  it(`should be defined`, () => {
    expect(stateController).toBeDefined();
  });

  it(`should create a State`, () => {
    const dto = { name: 'State' };
    expect(stateController.create(dto)).toEqual({
      id: expect.any(Number),
      name: 'State',
    });
    expect(mockStateService.create).toHaveBeenCalledWith(dto);
  });

  it(`shoud findAll States`, () => {
    expect(stateController.findAll()).toEqual([
      { id: expect.any(Number), name: 'State' },
      { id: expect.any(Number), name: 'State' },
    ]);
    expect(mockStateService.findAll).toHaveBeenCalled();
  });

  it(`should find a State by id: 'id'`, () => {
    expect(stateController.findOne('1')).toEqual({
      id: expect.any(Number),
      name: 'State',
    });
    expect(mockStateService.findOne).toHaveBeenCalledWith(1);
  });

  it(`should find a State by name: 'name'`, () => {
    expect(stateController.findOneByName('State')).toEqual({
      id: expect.any(Number),
      name: 'State',
    });
    expect(mockStateService.findAll).toHaveBeenCalled();
  });

  it(`should update a State by id: 'id'`, () => {
    const dto = { name: 'State' };
    stateController.update('1', dto);
    expect(mockStateService.update).toHaveBeenCalledWith(1, dto);
  });

  it(`should delete a State by id:'id'`, () => {
    stateController.remove('1');
    expect(mockStateService.remove).toHaveBeenCalledWith(1);
  });
});
