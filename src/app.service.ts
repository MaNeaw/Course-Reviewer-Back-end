import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { insertCourse, insertScore, insertUser } from './app.interface';
import { Course } from './entities/course.entity';
import { Score } from './entities/score.entity';
import { User } from './entities/user.entity';
import { Comment } from './entities/comment.entity';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { Favorite } from './entities/favorite.entity';
import { Like } from "typeorm";
import { Like as Like_entity } from './entities/like.entity';
import { Approve } from './entities/approve.entity';
import { Logger } from '@nestjs/common';

const logger = new Logger('Service')

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
    @InjectRepository(Course)
    private CourseRepo: Repository<Course>,
    @InjectRepository(Score)
    private ScoreRepo: Repository<Score>,
    @InjectRepository(Comment)
    private CommentRepo: Repository<Comment>,
    @InjectRepository(Favorite)
    private FavoriteRepo: Repository<Favorite>,
    @InjectRepository(Like_entity)
    private LikeRepo: Repository<Like_entity>,
    @InjectRepository(Approve)
    private ApproveRepo: Repository<Approve>
  ) { }

  async isMember(uid: string): Promise<boolean> {
    const isMember = await this.UserRepo.find({
      select: {
        user_id: true
      },
      where: [{ user_id: uid }]
    })
    if (isMember.length !== 0) return true
    else return false
  }

  async userRegister(param: insertUser) {
    await this.UserRepo.insert({
      user_id: param.uid,
      email: param.email,
      username: param.username,
      firstname: param.firstname,
      lastname: param.lastname,
      birth_date: param.birth_date,
      user_sex: param.sex,
      role: param.role
    })
  }

  async queryCourseList() {
    const query = await this.CourseRepo.find({
      select: {
        course_id: true,
        name_th: true,
        name_en: true
      },
      relations: {
        score: true,
        comment: true
      },
      order: {
        course_id: 'ASC'
      }

    })
    return query
  }

  async queryCourseListAndFavorite() {
    return await this.CourseRepo.find({
      select: {
        course_id: true,
        name_th: true,
        name_en: true,
        favorite: {
          favorite_id: true,
          user_id: {
            user_id: true
          }
        }
      },
      relations: {
        score: true,
        comment: true,
        favorite: {
          user_id: true
        }
      },
      order: {
        course_id: 'ASC'
      }

    })
  }

  async insertScore(param: insertScore) {
    return await this.ScoreRepo.insert({
      knowledge: param.knowledge,
      benefit: param.benefit,
      teaching: param.teaching,
      teacher: param.teacher,
      satisfaction: param.satisfaction,
      score: param.score,
      user_id: {
        user_id: param.user_id
      },
      course_id: {
        course_id: param.course_id
      }
    })
  }

  async insertComment(uid: string, course: string, message: string, identify: boolean) {
    return await this.CommentRepo.insert({
      message: message,
      identify: identify,
      user_id: {
        user_id: uid
      },
      course_id: {
        course_id: course
      }
    })
  }

  async updateComment(uid: string, course: string, p_message: string, p_comment_id: number) {
    return await this.CommentRepo.update(
      {
        comment_id: p_comment_id,
        user_id: {
          user_id: uid
        },
        course_id: {
          course_id: course
        }
      },
      { message: p_message })
  }
  
  async daleteLikeBeforeComment(comment: number) {
    await this.LikeRepo.delete({
      comment_id: {
        comment_id: comment
      }
    })
  }


  async deleteComment(uid: string, course: string, p_comment_id: number) {
    return await this.CommentRepo.delete({
      comment_id: p_comment_id,
      user_id: {
        user_id: uid
      },
      course_id: {
        course_id: course
      }
    })
  }

  async selectComment(params_course_id: string) {
    return await this.CommentRepo.find({
      select: {
        comment_id: true,
        message: true,
        create_time: true,
        update_time: true,
        identify: true,
        course_id: {
          course_id: true,
          name_th: false,
        },
        user_id: {
          username: true,
          user_id: true,
          role: true
        },
        like: {
          like_id: true,
          user_id: {
            user_id: true
          }
        },
      },
      relations: {
        like: {
          user_id: true
        },
        course_id: true,
        user_id: true,
        approve: {
          user_id: true
        }
      },
      where: {
        course_id: Like(params_course_id)
      },
      order: {
        create_time: "ASC"
      }
    })
  }

  async insertFavorite(uid: string, course: string) {
    const query = await this.FavoriteRepo.find({
      select: {
        favorite_id: true,
        course_id: {
          course_id: false
        },
        user_id: {
          user_id: false
        }
      },
      relations: {
        course_id: true,
        user_id: true, 
      },
      where: {
        course_id: Like(course),
        user_id: Like(uid)
      }
    })
    if ( query.length === 0 ) {
      await this.FavoriteRepo.insert({
      user_id: {
        user_id: uid
      },
      course_id: {
        course_id: course
      }
    })
    }

  }

  async queryFavorite(user: string) {
    const query = await this.FavoriteRepo.find({
      select: {
        favorite_id: true,
        user_id: {
          user_id: true
        },
      },
      relations: {
        user_id: true,
        course_id: {
          score: true,
          comment: true
        }
      },
      where: {
        user_id: Like(user)
      },
      order: {
        favorite_id: 'ASC'
      }
    })
    return query
  }

  async deleteFavorite(uid: string, course_code: string) {
    await this.FavoriteRepo.delete({
      user_id: {
        user_id: uid
      },
      course_id: {
        course_id: course_code
      }
    })
  }

  async insertLike(uid: string, comment: number) {
    await this.LikeRepo.insert({
      user_id: {
        user_id: uid
      },
      comment_id: {
        comment_id: comment
      }
    })
  }
  

  async daleteLike(uid: string, comment: number) {
    await this.LikeRepo.delete({
      user_id: {
        user_id: uid
      },
      comment_id: {
        comment_id: comment
      }
    })
  }

  async queryProfile(uid: string) {
    return await this.UserRepo.findOne({
      where: {
        user_id: uid
      }
    })
  }

  async updateProfile(uid: string, param_username: string) {
    await this.UserRepo.update(uid, {
      username: param_username
    })
  }

  async insertCourse(param: insertCourse) {
    await this.CourseRepo.insert({
      course_id: param.id,
      name_th: param.name_th,
      name_en: param.name_en,
      description: param.discription
    })
  }

  async queryUserTotal(): Promise<number> {
    return await this.UserRepo.count()
  }

  async queryCommentTotal(): Promise<number> {
    return await this.CommentRepo.count()
  }

  async queryCommentToStatistics() {
    const data = await this.CommentRepo.find({
      select: {
        comment_id : true,
        create_time : true
      },
      order: {
        comment_id: 'ASC',
      },
      skip: 0,
      take: 100
    })
    return  data
  }
 
  async queryCourseTotal(): Promise<number> { 
    return await this.CourseRepo.count()
  }

  async queryCourseToStatistics() {
    return await this.CourseRepo.find({
      select: {
        course_id: true,
        name_th: true,
        name_en: true,
        comment : {
          comment_id: true
        }
      },
      relations: {
        comment: true
      }
    })
  }

  async queryCourseToListAdmin() { 
    return await this.CourseRepo.find({
      select: {
        course_id: true,
        name_th: true,
        name_en: true,
        description: true
      }, 
      skip: 0,
      take: 1000  
      // Take 1000 เพราะขี้เกียจทำหน้าต่อไป เดี่๋ยวไม่ทัน
    })
  }

  async queryUserTolistAdmin() {
    return await this.UserRepo.find({
      select: {
        email: true, 
        username: true,
        firstname: true,
        lastname: true,
        user_sex: true,
        role: true,
      },
      skip: 0, 
      order: {
        role: 'ASC'
      }
    })
  }

  async insertApprove(uid: string, comment: number) {
    await this.ApproveRepo.insert({
      user_id: {
        user_id: uid
      },
      comment_id: {
        comment_id: comment
      }
    })
  }

  async daleteApprove(uid: string, comment: number) {
    await this.ApproveRepo.delete({
      user_id: {
        user_id: uid
      },
      comment_id: {
        comment_id: comment
      }
    })
  }

  async daleteApproveBeforeComment(comment: number) {
    await this.ApproveRepo.delete({
      comment_id: {
        comment_id: comment
      }
    })
  }

  async queryHistory( uid: string ){
    return await this.CommentRepo.find({
      select: {
        message : true,
        create_time: true,
        update_time: false,
        identify: true,
        user_id: {
          user_id: false,
        },
        course_id: {
          course_id: true,
          name_en: true, 
          name_th: true
        }
      },
      relations: {
        course_id: true,
        user_id: true,
      },
      where: {
        user_id: Like(uid)
      },
      order: {
        create_time: "ASC"
      }
    })
  }

  async queryRating (course_code : string , uid : string) { 
    return await this.ScoreRepo.find({
      select: {
        score: true,
        knowledge: true,
        benefit: true,
        teaching: true,
        teacher: true,
        satisfaction: true,
        user_id: {
          user_id : false,
          username: true
        },
        course_id: {
          course_id: true,
        }
      },
      relations: {
        user_id: true,
        course_id: true, 
      },
      where: {
        user_id: Like( uid ),
        course_id: Like( course_code )
      }

    })
  }

  async updateCourseDisciption( code: string, message: string) {
    return await this.CourseRepo.update(code, {
      description: message
    })
  }
  
  async deleteCourseSystem( code: string , email: string){
    logger.warn(`Strat Delete Course : '${code}' By: ${email}`  )
      await this.ScoreRepo.delete({
        course_id: {
          course_id : code 
        }
      })
      logger.log('Step1:  Delete Score Success.')

      let dataFromComent = await this.CommentRepo.find({
        select : {
          comment_id: true,
          course_id: {
            course_id: false
          }
        },
        relations : {
          course_id : true
        }, 
        where: {
          course_id: Like(code)
        }
      })
      for( let i = 0 ; i < dataFromComent.length ; i++){
        await this.LikeRepo.delete({
          comment_id: {
            comment_id: dataFromComent[i].comment_id
          }
        })
        await this.ApproveRepo.delete({
          comment_id: {
            comment_id: dataFromComent[i].comment_id
          }
        })
      }
      logger.log('Step2:  Delete Approve&Like Success.')

      await this.CommentRepo.delete({
        course_id: {
          course_id: code
        }
      })
      logger.log('Step3:  Delete Comment Success.')

      await this.FavoriteRepo.delete({
        course_id: {
          course_id: code
        }
      })
      logger.log('Step4:  Delete Favorite Success.')

      await this.CourseRepo.delete({ course_id: code })
      logger.log('Step5:  Delete Course Successfully.')
      logger.log(`Completed, delete course : '${code}' by: ${email}`)
  } 

  async queryScoreChart(){
    return await this.ScoreRepo.find({
      select: {
        score_id: false,
        score: true,
        knowledge: true,
        benefit: true,
        teacher: true,
        teaching: true,
        satisfaction: true,
      }
    })
  }

  async queryFavouriteChart(){
    return await this.CourseRepo.find({
      select: {
        course_id: true,
        favorite: {
          favorite_id : true
        },
        score: {
          score: false
        }
      },
      relations: {
        favorite: true,
        score: false
      }
    })
  }

}

@Injectable()
export class ApiService {
  constructor(private http: HttpService) { }

  async getCouseDetailOnAxios(courseCode: string): Promise<Object> {
    let object_resoult
    const response = await axios({
      method: 'GET',
      url: 'https://digitech.sut.ac.th/Digitech-Plan-API/getcourseopen.php',
      headers: {},
      data: {
        "Coursecode": courseCode,
        "acadyear": 2565,
        "semester": 2,
        "revisioncode": 1
      }
    }).catch(() => {
      throw new ForbiddenException('API not available');
    });
    let xml = response.data
    const xml2js = require('xml2js')
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        throw err
      }
      object_resoult = result.DataSet['diffgr:diffgram'][0]['NewDataSet'][0].Result[0]
    })
    return await this.optimize(object_resoult)
  }
  async optimize(param: object): Promise<object> {
    const data = {
      CODE: param['COURSECODE'][0],
      NAME_TH: param['COURSENAME'][0],
      NAME_EN: param['COURSENAMEENG'][0],
      CREDIT: param['CREDITTOTAL'][0],
      UNIT: param['COURSEUNIT'][0],
      SECTION: param['SECTION'][0],
      LANGUAGE: param['LANGUAGESTATUS'][0],
      CLASSNOTE: param['CLASSNOTE'][0],
      TIMEFROM: param['TIMEFROM'][0],
      TIMETO: param['TIMETO'][0],
      PREFIXNAME: param['PREFIXNAME'][0],
      OFFICERNAME: param['OFFICERNAME'][0],
      OFFICERSURNAME: param['OFFICERSURNAME'][0],
    }
    return data
  }
}
