import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

}
