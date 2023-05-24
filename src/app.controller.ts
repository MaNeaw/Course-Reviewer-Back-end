import { Body, Controller, Get, Post, Req, Res, HttpException, HttpStatus, Logger, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiService, AppService } from './app.service';
import { UserRequest } from './app.interface';
import { AddComment, AddCourse, AddDiscription, AddFavorite, Addlike, AddScore, DeleteComment, ParamCourseID, UpdateComment, UpdateUsername, UserRegister } from './app.dto';
import { Delete, Patch } from '@nestjs/common/decorators';

const logger = new Logger('Controller')

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly APIService: ApiService
  ) { }

  @Get()
  getHello(): string {
    return 'Hello Word!!'
  }

  @Post('login')
  async login(@Req() req: UserRequest, @Res() res: Response) {
    const uid = req['user'].uid
    const email = req['user'].email
    const role = req['user'].role
    const expire = req['user'].expire_th

    const isMember = await this.appService.isMember(uid)
    res.status(HttpStatus.OK).json({
      "message": "Welcome, login success!",
      "email": email,
      "isMember": isMember,
      "permission": role,
      "expire_th" : expire 
    })
  }

  @Post('register')
  async register(@Req() req: UserRequest, @Res() res: Response, @Body() body: UserRegister) {
    const uid = req['user'].uid
    const email = req['user'].email
    const role = req['user'].role
    try {
      await this.appService.userRegister({
        uid: uid,
        email: email,
        username: body.username,
        firstname: body.firstname.substring(0, 1).toUpperCase() + body.firstname.substring(1),
        lastname: body.lastname.substring(0, 1).toUpperCase() + body.lastname.substring(1),
        birth_date: body.birthdate,
        sex: body.sex,
        role: role
      })
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-course')
  async course_list(@Req() req: UserRequest, @Res() res: Response) {
    const query = await this.appService.queryCourseList()
    function count_score(data) {
      let count: number = data.length
      let sum: number = 0
      for (let i = 0; i < count; i++) {
        sum += data[i].score
      }
      return sum / count
    }
    let data = []
    for (let i = 0; i < query.length; i++) {
      data.push({
        "course_id": query[i].course_id,
        "course_name_th": query[i].name_th,
        "course_name_en": query[i].name_en,
        "score": count_score(query[i].score) || 0,
        "score_total": query[i].score.length || 0,
        "comment": query[i].comment.length
      })
    }
    res.status(HttpStatus.OK).json(data)
  }

  @Get('list-course-favorite')
  async course_list_favorite(@Req() req: UserRequest, @Res() res: Response) {
    const uid = req['user'].uid
    const query = await this.appService.queryCourseListAndFavorite()
    function count_score(data) {
      let count: number = data.length
      let sum: number = 0
      for (let i = 0; i < count; i++) {
        sum += data[i].score
      }
      return sum / count
    }
    function findMyFavorite(data) {
      let length: number = data.length
      for (let i = 0; i < length; i++) {
        if ((data[i].user_id.user_id) == uid) return true
      }
      return false
    }
    let data = []
    for (let i = 0; i < query.length; i++) {
      data.push({
        "course_id": query[i].course_id,
        "course_name_th": query[i].name_th,
        "course_name_en": query[i].name_en,
        "score": count_score(query[i].score) || 0,
        "score_total": query[i].score.length || 0,
        "comment": query[i].comment.length, 
        "favorite": findMyFavorite(query[i].favorite)
      })
    }
    res.status(HttpStatus.OK).json(data)
  }

  @Get('course-detail/:course_id')
  async course_detail(@Param() param: ParamCourseID, @Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.APIService.getCouseDetailOnAxios(param.course_id)
      res.status(HttpStatus.OK).send(data)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('add-course')
  async add_course(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddCourse) {
    const uid = req['user'].uid
    const role = req['user'].role
    try {
      if (role === 'officer' || role === 'admin') {
        await this.appService.insertCourse({
          id: body.id,
          name_th: body.name_th,
          name_en: body.name_en,
          discription: body.discription
        })
        res.status(HttpStatus.OK).json({
          "status_code": 200,
          "message": "Successfully!"
        })
      }
      throw new Error("Error, You aren't officer.");
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }


  }

  @Post('add-score')
  async add_score(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddScore) {
    const uid = req['user'].uid
    const star: number = 5
    let sum_value: number = 0
    try {
      for (const [key, value] of Object.entries(body)) {
        switch (key) {
          case "knowledge": if (value) sum_value += value
            break
          case "benefit": if (value) sum_value += value
            break
          case "teaching": if (value) sum_value += value
            break
          case "teacher": if (value) sum_value += value
            break
          case "satisfaction": if (value) sum_value += value
            break
        }
      }
      this.appService.insertScore({
        knowledge: body.knowledge,
        benefit: body.benefit,
        teaching: body.teaching,
        teacher: body.teacher,
        satisfaction: body.satisfaction,
        score: (sum_value / star),
        user_id: uid,
        course_id: body.course_id
      })
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('rating/:course_id')
  async select_rating(@Param() param: ParamCourseID, @Res() res: Response, @Req() req: Request) {
    try {
      const uid = req['user'].uid
      const course = param.course_id
      const data = await this.appService.queryRating( course , uid )
      if (data.length == 0) throw new Error("Error, no data.");
      res.status(HttpStatus.OK).send(data)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('add-comment')
  async add_comment(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddComment) {
    const uid = req['user'].uid
    const course = body.course_id
    const message = body.message
    const identify = body.identify
    try {
      await this.appService.insertComment(uid, course, message, identify)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Comment Insert Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch('update-comment')
  async update_comment(@Req() req: UserRequest, @Res() res: Response, @Body() body: UpdateComment) {
    const uid = req['user'].uid
    const course = body.course_id
    const message = body.message
    const message_id: number = body.comment_id
    try {
      const query = await this.appService.updateComment(uid, course, message, message_id)
      if (query.affected == 0) throw new Error("Error, plase check you parameter");
      else res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Comment Update Successfully!"
      });

    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('delete-comment')
  async delete_comment(@Req() req: UserRequest, @Res() res: Response, @Body() body: DeleteComment) {
    const uid = req['user'].uid
    const course = body.course_id
    const comment_id: number = body.comment_id
    try {
      await this.appService.daleteLikeBeforeComment(comment_id)
      await this.appService.daleteApproveBeforeComment(comment_id)
      await this.appService.deleteComment(uid, course, comment_id)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Comment has been deleted."
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-comment/:course_id')
  async list_comment(@Param() param: ParamCourseID, @Res() res: Response, @Req() req: Request) {
    try {
      const query = await this.appService.selectComment(param.course_id)
      const uid = req['user'].uid
      const role = req['user'].role
      function username_functional(name: string, identify) {
        if (identify) return name
        else {
          const fake_name = ["Rabbit", "Turtle", "Doggy", "Catty", "Mouse", "Hamster", "Puppy", "Kitten", "Sheep", "Piggy",]
          const random_fakename = Math.floor(Math.random() * fake_name.length);
          return fake_name[random_fakename] + Math.floor(Math.random() * 99)
        }
      }
      function update_time(create, update) {
        const str_create = String(create)
        const str_update = String(update)
        if (str_create === str_update) return null
        return update
      }
      function available(params_array_like) {
        const like = params_array_like
        if (like) {
          for (const [key, value] of Object.entries(like)) {
            let user_id = value['user_id'].user_id
            if (user_id == uid) {
              return false
            }
          }
          return true
        }
      }
      function find_owner_comment(user_id) {
        if (uid === user_id) return true
        return false
      }
      function permission_approve(role){
        if ( role == "officer"  ) return true
        return false
      }
      let data = []
      for (let i = 0; i < query.length; i++) {
        data.push({
          "create_time": query[i].create_time,
          "update_time": update_time(query[i].create_time, query[i].update_time),
          "course_code": query[i].course_id.course_id,
          "comment_id": query[i].comment_id,
          "message": query[i].message,
          "username": query[i].identify ? query[i].user_id.username : "Anonymous",
          "like": query[i].like.length,
          "can_like": query[i].like ? available(query[i].like) : true,
          "approve": query[i].approve.length,
          "permission_approve" :  permission_approve(role),
          "can_approve": query[i].approve ? available(query[i].approve) : true,
          "owner_comment": find_owner_comment(query[i].user_id.user_id),
          "officer_comment" : (query[i].user_id.role === "officer") ? true : false 
        })
      }
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }


  @Post('add-like')
  async add_like(@Req() req: UserRequest, @Res() res: Response, @Body() body: Addlike) {
    const uid = req['user'].uid
    const comment = body.comment_id
    try {
      await this.appService.insertLike(uid, comment)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Like Insert Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('delete-like')
  async delete_like(@Req() req: UserRequest, @Res() res: Response, @Body() body: Addlike) {
    const uid = req['user'].uid
    const comment = body.comment_id
    try {
      await this.appService.daleteLike(uid, comment)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Like Delete Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('add-favorite')
  async add_favorite(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddFavorite) {
    const uid = req['user'].uid
    const course_id = body.course_id
    try {
      await this.appService.insertFavorite(uid, course_id)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Add Course Favorite Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }

  }

  @Delete('delete-favorite')
  async delete_favorite(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddFavorite) {
    const uid = req['user'].uid
    const course_id = body.course_id
    try {
      await this.appService.deleteFavorite(uid, course_id)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Delete Course Favorite Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-favorite')
  async list_favorite(@Req() req: UserRequest, @Res() res: Response) {
    const uid = req['user'].uid
    async function count_score(data) {
      let count: number = data.length
      let sum: number = 0
      for (let i = 0; i < count; i++) {
        sum += data[i].score
      }
      return sum / count
    }
    try {
      const query = await this.appService.queryFavorite(uid)
      let data = []
      for (let i = 0; i < query.length; i++) {
        data.push({
          "course_id": query[i].course_id.course_id,
          "course_name_th": query[i].course_id.name_th,
          "course_name_en": query[i].course_id.name_en,
          "score": await count_score(query[i].course_id.score) || 0,
          "comment": query[i].course_id.comment.length
        })
      }
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('my-history')
  async select_history(@Req() req: UserRequest, @Res() res: Response) {
    const uid = req['user'].uid  
    try {
      const query = await this.appService.queryHistory(uid)
      let data = []
      function convert_time( param ) { 
        var moment = require('moment-timezone');
          const hour_format = 'MMMM Do YYYY, h:mm:ss'
          let convert = moment( param ).tz("Asia/Jakarta").format(hour_format);
          return convert
      }
      for (let i = 0 ; i < query.length ; i++ ) { 
        data.push({
          message: query[i].message,
          create_at: convert_time(query[i].create_time),
          identify: query[i].identify,
          course_id: query[i].course_id.course_id,
          course_name_th: query[i].course_id.name_th,
          course_name_en: query[i].course_id.name_en
        })
      }
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('my-profile')
  async select_profile(@Req() req: UserRequest, @Res() res: Response) {
    const uid = req['user'].uid
    try {
      const query = await this.appService.queryProfile(uid)
      res.status(HttpStatus.OK).json(query)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch('my-profile')
  async update_profile(@Req() req: UserRequest, @Res() res: Response, @Body() body: UpdateUsername) {
    const uid = req['user'].uid
    const username = body.username
    try {
      await this.appService.updateProfile(uid, username)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Update Username Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  // ##Admin Section
  @Get('dashboard-info')
  async dashboard(@Req() req: UserRequest, @Res() res: Response) {
    const role = req['user'].role
    try {
      if (role !== 'admin') throw new Error("Error, You hasn't permission.");
      const member_total: number = await this.appService.queryUserTotal()
      const comment_total: number = await this.appService.queryCommentTotal()
      const course_total: number = await this.appService.queryCourseTotal()
      const comment_100 = await this.appService.queryCommentToStatistics()
      const course_detail = await this.appService.queryCourseToStatistics()
      async function optimize_course(param) {
        let data = []
        for (let i = 0; i < param.length; i++) {
          data.push({
            "course_id": param[i].course_id,
            "info": {
              "name_th": param[i].name_th,
              "name_en": param[i].name_en,
            },
            "comment": param[i].comment.length
          })
        }
        return data
      }

      async function data_to_chart(params) {
        let data = {
          '01:00': 0, '02:00': 0, '03:00': 0, '04:00': 0, '05:00': 0, '06:00': 0, '07:00': 0, '08:00': 0,
          '09:00': 0, '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0,
          '17:00': 0, '18:00': 0, '19:00': 0, '20:00': 0, '21:00': 0, '22:00': 0, '23:00': 0, '24:00': 0,
        }
        for (let i = 0; i < params.length; i++) {
          var moment = require('moment-timezone');
          const hour_format = 'HH'
          let date_hour = moment(params[i].create_time).tz("Asia/Jakarta").format(hour_format);
          data[`${date_hour}:00`]++
        }
        return data
      }

      res.status(HttpStatus.OK).json({
        "member_total": member_total,
        "comment_total": comment_total,
        "course_total": course_total,
        "comment_to_statistic": await data_to_chart(comment_100),
        "course_to_statistic": await optimize_course(course_detail)
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }

  }

  @Get('admin-list-course')
  async select_list_course_admin(@Req() req: UserRequest, @Res() res: Response) {
    // const uid = req['user'].uid
    const role = req['user'].role
    try {
      if (role !== 'admin' && role !== 'officer') throw new Error("Error, You hasn't permission.");
      const query = await this.appService.queryCourseToListAdmin()
      res.status(HttpStatus.OK).json(query)
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('admin-list-member')
  async select_list_member_admin(@Req() req: UserRequest, @Res() res: Response) {
    // const uid = req['user'].uid
    const role = req['user'].role
    try {
      if (role !== 'admin') throw new Error("Error, You hasn't permission.");
      const query = await this.appService.queryUserTolistAdmin()
      const optimize = ( data ) => {
        let result = []
        for( let i = 0 ; i<data.length ; i++ ) {
          result.push({
            email : data[i].email,
            username : data[i].username,
            name : data[i].firstname + " " + data[i].lastname,
            gender : data[i].user_sex,
            role : data[i].role
          })
        }
        return result
      }
      res.status(HttpStatus.OK).json( optimize(query) )
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('add-approve')
  async add_approve(@Req() req: UserRequest, @Res() res: Response, @Body() body: Addlike) {
    const uid = req['user'].uid
    const comment = body.comment_id
    const role = req['user'].role
    try {
      if (role !== 'officer') throw new Error("Error, You aren't officer.");
      await this.appService.insertApprove(uid, comment)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Approve Insert Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('delete-approve')
  async delete_approve(@Req() req: UserRequest, @Res() res: Response, @Body() body: Addlike) {
    const uid = req['user'].uid
    const comment = body.comment_id
    const role = req['user'].role
    try {
      if (role !== 'officer') throw new Error("Error, You aren't officer.");
      await this.appService.daleteApprove(uid, comment)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Approve Delete Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('add-course-discription')
  async add_course_discription(@Req() req: UserRequest, @Res() res: Response, @Body() body: AddDiscription) {
    const course_code = body.course_id
    const course_discript = body.discription
    const role = req['user'].role
    try {
      if ( role !== ('officer') ) throw new Error("Error, You aren't officer.");
      const query = await this.appService.updateCourseDisciption(course_code, course_discript)
      if ( query.affected == 0 ) throw new Error("Error, Query is not worked.");
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Discription Update Successfully!"
      })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete('delete-course')
  async delete_course (@Req() req: UserRequest, @Res() res: Response, @Body() body: ParamCourseID) {
    const course_code = body.course_id
    const role = req['user'].role
    const email = req['user'].email
    try {
      if ( role !== ('admin') ) throw new Error("Error, You aren't officer.");
      await this.appService.deleteCourseSystem(course_code, email)
      res.status(HttpStatus.OK).json({
        "status_code": 200,
        "message": "Course Delete Succeeded!"
      })
    } catch (error) {
      logger.error(`Delete Course ${course_code} Error! : ${error.message}`)
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('chart-public')
  async chart_public (@Req() req: UserRequest, @Res() res: Response) {
    try {
      const queryScore = await this.appService.queryScoreChart()
    const queryComment = await this.appService.queryCommentToStatistics()
    const queryCourseFavorite = await this.appService.queryFavouriteChart()

    async function barchart_comment(params) {
      let data = {
        '01:00': 0, '02:00': 0, '03:00': 0, '04:00': 0, '05:00': 0, '06:00': 0, '07:00': 0, '08:00': 0,
        '09:00': 0, '10:00': 0, '11:00': 0, '12:00': 0, '13:00': 0, '14:00': 0, '15:00': 0, '16:00': 0,
        '17:00': 0, '18:00': 0, '19:00': 0, '20:00': 0, '21:00': 0, '22:00': 0, '23:00': 0, '24:00': 0,
      }
      for (let i = 0; i < params.length; i++) {
        var moment = require('moment-timezone');
        const hour_format = 'HH'
        let date_hour = moment(params[i].create_time).tz("Asia/Jakarta").format(hour_format);
        data[`${date_hour}:00`]++
      }
      return data
    }
    let score_detals = {
      knowledge: 0,
      benefit: 0, 
      teacher: 0,
      teaching: 0, 
      satisfaction: 0 
    }
    let score_count = {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0
    }
    for(let i=0; i<queryScore.length; i++){
      for (const [key, value] of Object.entries(queryScore[i])) {
        switch (key) {
          case "knowledge": score_detals.knowledge += value
            break
          case "benefit": score_detals.benefit += value
            break
          case "teaching": score_detals.teaching += value
            break
          case "teacher": score_detals.teacher += value
            break
          case "satisfaction": score_detals.satisfaction += value
            break
          case "score": {
            if( value <= 1 ) score_count.one++
            else if( value <= 2 ) score_count.two++
            else if( value <= 3 ) score_count.three++
            else if( value <= 4 ) score_count.four++
            else if( value <= 5 ) score_count.five++
          }
          break
        }
      }
    }
    async function favouriteChart(params) {
      let data = []
      for(let i=0; i<params.length; i++ ){
        if (params[i].favorite.length > 0 ) data.push({
          course_id : params[i].course_id,
          favourite: params[i].favorite.length
        })
      }
      return data 
    }
    res.status(HttpStatus.OK).json({
      course_comment: await barchart_comment(queryComment),
      course_favorite: await favouriteChart(queryCourseFavorite),
      score_detal: score_detals,
      score_count: score_count,
    })
    } catch (error) {
      throw new HttpException({ status_code: 400, message: error.message }, HttpStatus.BAD_REQUEST)
    }
    
  }
}