import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'firstname'})
    firstname: string;

    @Column({name:'lastname'})
    lastname: string;

    @Column({name:'email', nullable:false})
    email: string

    @Column({type: 'date',name:'birthday'})
    birthday: string;

    @Column({name:'timezone'})
    timezone: string;
}