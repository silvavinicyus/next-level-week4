import {Router} from 'express';
import AnswerController from './controllers/AnswerController';
import SendMailController from './controllers/SendMailController';
import SurveysController from './controllers/SurveyController';
import { UserController } from './controllers/UserController';
import NpsController from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMailController.execute);
router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

export {router};