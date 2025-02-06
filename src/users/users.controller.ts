import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
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
        this.shedulerService.scheduleBirthdayMessage(savedUser)
        return savedUser
    }

    @Put(":id")
    async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: number): Promise<Users> {
        const user = plainToInstance(Users, dto);
        const existingUser = await this.getUserById(id)
        if(existingUser ==null){
            throw new NotFoundException("User doesn't exist")
        }
        user.id = id;
        const updatedUser = await this.userService.updateUser(user);
        this.shedulerService.scheduleBirthdayMessage(updatedUser)
        return updatedUser
    }
    @Delete(":id")
    async deleteUser(@Param('id') id:number):Promise<any>{
        const existingUser = await this.getUserById(id)
        if(existingUser ==null){
            throw new NotFoundException("User doesn't exist")
        }
        const deleteResult = await this.userService.deleteUser(id)
        this.shedulerService.cancelBirthdayScheduler(id)
        return {message:"user deleted", success: deleteResult}
    }

    @Get()
    async getUsers(): Promise<Users[]> {
        return await this.userService.getUsers();
    }

    @Get(":id")
    async getUserById(@Param('id') id: number): Promise<Users> {
        return await this.userService.getUserById(id);
    }
}
