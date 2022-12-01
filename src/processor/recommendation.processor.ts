import { Process, Processor } from '@nestjs/bull';
import { IRecommendation } from 'src/interface/recommendation.interface';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';

@Processor('recommendation-queue')
export class RecommendationProcessor {
    constructor(
        @InjectModel("Recommendation")
        private recommendationModel: Model<IRecommendation>) { }

    @Process('recommendation')
    async handleRecommendationJob(job: Job) {
        await this.recommendationModel.create({
            restaurant_id: job.data.restaurantId
        });
    }
}