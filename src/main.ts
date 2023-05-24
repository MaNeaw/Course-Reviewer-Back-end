import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common'

const logger = new Logger('Main')

if (!process.env.FAAS_FUNCTION_NAME) config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors : true});
  // app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors({
  //   origin: '*'
  // })
  app.enableCors({
    // origin: ['http://localhost:3000'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });
  await app.listen(process.env.PORT, '0.0.0.0');
  logger.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Project Started! PORT: ' + process.env.PORT)
  logger.log("██╗░░░██╗░█████╗░░██████╗██╗░░██╗██╗  ██████╗░███████╗██╗░░░██╗███████╗██╗░░░░░░█████╗░██████╗░███████╗██████╗░")
  logger.log("╚██╗░██╔╝██╔══██╗██╔════╝██║░░██║██║  ██╔══██╗██╔════╝██║░░░██║██╔════╝██║░░░░░██╔══██╗██╔══██╗██╔════╝██╔══██╗")
  logger.log("░╚████╔╝░██║░░██║╚█████╗░███████║██║  ██║░░██║█████╗░░╚██╗░██╔╝█████╗░░██║░░░░░██║░░██║██████╔╝█████╗░░██████╔╝")
  logger.log("░░╚██╔╝░░██║░░██║░╚═══██╗██╔══██║██║  ██║░░██║██╔══╝░░░╚████╔╝░██╔══╝░░██║░░░░░██║░░██║██╔═══╝░██╔══╝░░██╔══██╗")
  logger.log("░░░██║░░░╚█████╔╝██████╔╝██║░░██║██║  ██████╔╝███████╗░░╚██╔╝░░███████╗███████╗╚█████╔╝██║░░░░░███████╗██║░░██║")
  logger.log("░░░╚═╝░░░░╚════╝░╚═════╝░╚═╝░░╚═╝╚═╝  ╚═════╝░╚══════╝░░░╚═╝░░░╚══════╝╚══════╝░╚════╝░╚═╝░░░░░╚══════╝╚═╝░░╚═╝")
  logger.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Copyright © 2022, Course Reviwer ░░░')
}
bootstrap();
