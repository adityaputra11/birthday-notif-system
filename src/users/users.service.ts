import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {}

    async createUser(user: Users): Promise<Users> {
        const savedUser = await this.usersRepository.save(user);
        return savedUser;
    }

    async getUsers(): Promise<Users[]> {
        return await this.usersRepository.find();
    }

    async getUserById(id: number): Promise<Users> {
        return await this.usersRepository.findOne({where: {id}});
    }

    async updateUser(user: Users): Promise<Users> {
        const updatedUser = await this.usersRepository.save(user);
        return updatedUser;
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
    
    }
