import { Request, Response } from "express"
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import {resolve} from 'path';
import AppError from "../errors/AppError";

export default class SendMailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const userExists = await usersRepository.findOne({email});

        if(!userExists){
            throw new AppError("User does not exists");    
        }

        const surveyExists = await surveyRepository.findOne({id: survey_id})

        if(!surveyExists){
            throw new AppError("Survey does not exists");                
        }

        

        const path = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");

        const surveyUserExists = await surveyUserRepository.findOne({
            where: {user_id: userExists.id, value: null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: userExists.name,
            title: surveyExists.title,
            description: surveyExists.description,
            id: "",
            link: process.env.URL_MAIL
        }


        if(surveyUserExists){   
            variables.id = surveyUserExists.id;                 
            await SendMailService.execute(email, surveyExists.title, variables, path);

            return response.json(surveyUserExists);
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userExists.id,
            survey_id: surveyExists.id,            
        });
    
        await surveyUserRepository.save(surveyUser);   
        
        variables.id = surveyUser.id;
        await SendMailService.execute(email, surveyExists.title, variables, path);

        return response.json(surveyUser);
    }
}