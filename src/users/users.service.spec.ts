// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { mockRepository } from '../../test/utils/mock-repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = new Users();
      repository.save.mockResolvedValue(user);

      const result = await service.createUser(user);
      expect(result).toEqual(user);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [new Users(), new Users()];
      repository.find.mockResolvedValue(users);

      const result = await service.getUsers();
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = new Users();
      repository.findOne.mockResolvedValue(user);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const user = new Users();
      repository.save.mockResolvedValue(user);

      const result = await service.updateUser(user);
      expect(result).toEqual(user);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user by ID', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteUser(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});