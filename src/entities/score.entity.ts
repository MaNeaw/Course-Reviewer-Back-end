import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity()
export class Score {
    @PrimaryGeneratedColumn( {name : 'id'})
    score_id: string;

    @Column({ type: "smallint", name : "knowledge" , nullable : false})
    knowledge: number;

    @Column({ type: "smallint", name : "benefit", nullable : false})
    benefit: number;

    @Column({ type: "smallint", name : "teaching", nullable : false})
    teaching: number;

    @Column({ type: "smallint", name : "teacher", nullable : false})
    teacher: number;

    @Column({ type: "smallint", name : "satisfaction", nullable : false})
    satisfaction: number;

    @Column({ type: "real", name : "score", nullable : false})
    score: number;

    @ManyToOne( () => User , (user) => user.user_id) 
    @JoinColumn({name : 'user_id'})
    user_id : User

    @ManyToOne( () => Course , (course) => course.course_id) 
    @JoinColumn({name : 'course_id'})
    course_id : Course

}