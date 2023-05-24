import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Score } from './score.entity';
import { Favorite } from './favorite.entity';

@Entity()
export class User {
    @PrimaryColumn({ name: 'id' })
    user_id: string;

    @Column({ name : "email" , length : 50})
    email: string;

    @Column({ name : "user_name" , length : 50})
    username: string;

    @Column({ name : "first_name" , length : 50})
    firstname: string;

    @Column({ name : "last_name" , length : 50})
    lastname: string;

    @Column({ name : "birth_date" , length : 50})
    birth_date: string;

    @Column({ name : "sex", length : 6})
    user_sex: string;

    @Column({ name : "role", length : 50 , nullable : true })
    role: string;
    
    @OneToMany( () =>  Score, (score) => score.user_id)
    score: Score[]

    @OneToMany( () =>  Favorite, (favorite) => favorite.user_id)
    fevorite: Favorite[]
}
