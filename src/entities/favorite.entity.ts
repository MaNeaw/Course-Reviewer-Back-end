import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn( {name : 'id'})
    favorite_id: string;

    @ManyToOne( () => User , (user) => user.user_id) 
    @JoinColumn({name : 'user_id'})
    user_id : User

    @ManyToOne( () => Course , (course) => course.course_id) 
    @JoinColumn({name : 'course_id'})
    course_id : Course

}