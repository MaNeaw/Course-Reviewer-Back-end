import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Approve } from './approve.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn( {name : 'id'})
    comment_id: number;

    @Column({ name : "message" , length : 150})
    message: string;

    @Column({ name : "identify" , type: "boolean" , nullable : false})
    identify: boolean;

    @CreateDateColumn({name: "create_at", nullable : false})
    create_time: Date;

    @UpdateDateColumn({name: "update_at"})
    update_time: Date;

    @ManyToOne( () => User , (user) => user.user_id) 
    @JoinColumn({name : 'user_id'})
    user_id : User

    @ManyToOne( () => Course , (course) => course.course_id) 
    @JoinColumn({name : 'course_id'})
    course_id : Course

    @OneToMany( () =>  Like, (like) => like.comment_id)
    like: Like[]

    @OneToMany( () =>  Approve, (approve) => approve.comment_id)
    approve: Like[]
}