import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
@Entity()
export class Approve { 
    @PrimaryGeneratedColumn( {name : 'id'})
    approve_id: string;

    @ManyToOne( () => User , (user) => user.user_id) 
    @JoinColumn({name : 'user_id'})
    user_id : User

    @ManyToOne( () => Comment , (comment) => comment.comment_id) 
    @JoinColumn({name : 'comment_id'})
    comment_id : Comment
}