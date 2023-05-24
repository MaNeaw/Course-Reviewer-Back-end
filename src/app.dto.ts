import { IsBoolean, IsIn, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, Length, Max, Min } from 'class-validator';

export class UserRegister {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    @IsISO8601()
    birthdate: string;

    @IsNotEmpty()
    @IsIn(['male', 'female'])
    sex: string;
}

export class AddScore {
    @IsNotEmpty()
    @Length(6,6)
    course_id: string;
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    knowledge: number;
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    benefit: number;
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    teaching: number;
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    teacher: number;
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    satisfaction: number;
}

export class AddComment {
    @IsNotEmpty()
    message: string;
    @IsNotEmpty()
    @Length(6,6)
    course_id: string;
    @IsBoolean()
    identify: boolean;
}

export class UpdateComment {
    @IsNotEmpty()
    message: string;
    @IsNotEmpty()
    @Length(6,6)
    course_id: string;
    @IsNumber()
    comment_id: number;
}

export class DeleteComment {
    @Length(6,6)
    course_id: string;
    @IsNumber()
    comment_id: number;
}

export class AddFavorite {
    @IsNotEmpty()
    @Length(6,6)
    course_id: string;
}

export class ParamCourseID {
    @IsNotEmpty()
    @IsNumberString()
    @Length(6,6)
    course_id : string;
}

export class Addlike {
    @IsNotEmpty()
    comment_id: number; 
}

export class UpdateUsername {
    @IsNotEmpty()
    @Length(6,20)
    username: string;
}

export class AddCourse {
    @IsNotEmpty()
    @IsNumberString()
    @Length(6,6)
    id: string;
    @IsNotEmpty()
    name_th: string;
    @IsNotEmpty()
    name_en: string; 
    discription: string; 
}

export class AddDiscription {
    @IsNotEmpty()
    @IsNumberString()
    @Length(6,6)
    course_id : string;
    @IsNotEmpty()
    discription: string; 
}