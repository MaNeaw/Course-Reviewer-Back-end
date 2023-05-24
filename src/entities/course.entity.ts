import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Score } from './score.entity';
import { Favorite } from './favorite.entity';
import { Comment } from './comment.entity';

@Entity()
export class Course {
    @PrimaryColumn({ name: 'id' , nullable : false })
    course_id: string;

    @Column({ name : "name_th" , length : 50 , nullable : false })
    name_th: string;

    @Column({ name : "name_en" , length : 50, nullable : false})
    name_en: string;
    
    @Column({ name : "description" , length : 150})
    description: string;

    @OneToMany( () =>  Score, (score) => score.course_id)
    score: Score[]

    @OneToMany( () =>  Comment, (comment) => comment.course_id)
    comment: Comment[]

    @OneToMany( () =>  Favorite, (favorite) => favorite.course_id)
    favorite: Favorite[]
    
}
