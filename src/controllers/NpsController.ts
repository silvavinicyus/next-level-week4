import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";

export default class NpsController{
    async execute(request: Request, response: Response){
        const {survey_id} = request.params;

        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const surveysAnswers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveysAnswers.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;

        const passive = surveysAnswers.filter(survey => (survey.value >=7 && survey.value <= 8)).length;

        const promoters = surveysAnswers.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;
        
        const totalAnswers = surveysAnswers.length;

        const calculate = Number((((promoters - detractor) / totalAnswers)*100).toFixed(2));

        return response.json({
            detractor,
            passive,
            promoters,
            totalAnswers,
            nps: calculate
        })
    }
}