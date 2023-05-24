import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ApiService, AppService } from './app.service';
import { Course } from './entities/course.entity';
import { Score } from './entities/score.entity';
import { User } from './entities/user.entity';
import { Comment } from './entities/comment.entity';
import { FrontendMiddleware } from './frontend.middleware';
import { TypeOrmConfigService } from './orm.config';
import { HttpModule } from '@nestjs/axios';
import { Favorite } from './entities/favorite.entity';
import { Like } from './entities/like.entity';
import { Approve } from './entities/approve.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    TypeOrmModule.forFeature([
      User,
      Course,
      Score,
      Comment,
      Favorite,
      Like,
      Approve
    ]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FrontendMiddleware).exclude(
    
      // By Pass Admin 
      // {path: 'dashboard-info', method: RequestMethod.GET },
      // {path: 'admin-list-course', method: RequestMethod.GET },
      // {path: 'admin-list-member', method: RequestMethod.GET },
      
    ).forRoutes({
      path: '/**',
      method: RequestMethod.ALL
    })
  }
}
