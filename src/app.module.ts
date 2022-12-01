import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
require('dotenv').config()
import { RecommendationController } from './controller/recommendation/recommendation.controller';
import { RecommendationSchema } from './schema/recommendation.schema';
import { RecommendationService } from './service/recommendation/recommendation.service';
import { RecommendationControllerV2 } from './controller/recommendation/recommendation.controllerV2';
import { BullModule } from '@nestjs/bull'
import { RecommendationProcessor } from './processor/recommendation.processor';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_DB_URI}`, { dbName: 'recommendations' }),
    MongooseModule.forFeature([{ name: 'Recommendation', schema: RecommendationSchema }]),
    LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    }),
    BullModule.registerQueue({
      name: 'recommendation-queue'
    })
  ],
  controllers: [AppController, RecommendationController],
  providers: [AppService, RecommendationService, RecommendationProcessor],
})
export class AppModule { }
