import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { Users } from './users.entity';
import { plainToInstance } from 'class-transformer';
import { SchedulerService } from 'src/scheduler/scheduler.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService, 
        private readonly shedulerService: SchedulerService) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<Users> {
        const user = plainToInstance(Users, dto);
        const savedUser = await this.userService.createUser(user);
        await this.shedulerService.scheduleBirthdayMessage(savedUser)
        return savedUser
    }

    @Put(":id")
    async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: number): Promise<Users> {
        const user = plainToInstance(Users, dto);
        user.id = id;
        const updatedUser = await this.userService.updateUser(user);
        await this.shedulerService.scheduleBirthdayMessage(updatedUser)
        return updatedUser
    }

    @Get()
    async getUsers(): Promise<Users[]> {
        return await this.userService.getUsers();
    }

    @Get(":id")
    async getUserById(@Param('id') id: number): Promise<Users> {
        await this.shedulerService.cancelExistingJob(id)
        return await this.userService.getUserById(id);
    }
}
