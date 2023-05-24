import { NestMiddleware, Injectable, Logger } from '@nestjs/common'
import { Request, Response } from "express"
import firebaseAdmin from './firebaseAdmin'

const logger = new Logger('Authentication')

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const { url } = req
    const accessToken = req.headers.authorization
    const administator = [
      'koonyote@gmail.com',
    ]
    const list_officer = [
      'b6205102@g.sut.ac.th',
      'b6204730@g.sut.ac.th'
    ]
    function find_role(email) {
      let mail_split = email.split('@')
      if (mail_split[1] == 'g.sut.ac.th') {
        let b_match = mail_split[0].match("b(.*)")
        if (list_officer.includes(email)){  
          return 'officer'                      
        } else if (b_match && parseInt(b_match[1])) {
          return 'student'
        } else {
          return 'officer'
        }
      } else if (administator.includes(email)) {
        return 'admin'
      } else return 'student'
    }

    logger.log('New Request Path: ' + url)
    if (accessToken != null && accessToken != '') {
      firebaseAdmin.auth().verifyIdToken(accessToken.replace('Bearer ', ''))
        .then(async decodeToken => {
          let exp = new Date(decodeToken.exp * 1000);
          const user = {
            email: decodeToken.email,
            uid: decodeToken.uid,
            role: find_role(decodeToken.email),
            expire_th: exp.toLocaleTimeString()
          }
          req['user'] = user;
          next()
        }).catch(error => {
          logger.warn('Access Denied: ' + error.message)
          this.accessDenied(req.url, res, error.message)
        });
    } else {
      logger.error('Access Denied: Token is missing.')
      this.accessDenied(req.url, res, 'Access Token is not found.')
    }
  }

  private accessDenied(url: string, res: Response, descripttion: string) {
    res.status(401).json({
      statusCode: 401,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
      descripttion: descripttion
    });
  }


}
