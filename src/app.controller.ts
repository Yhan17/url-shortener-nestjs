import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    const serviceResult = this.appService.getHello()
    res.status(HttpStatus.OK).send({
       message: serviceResult
    });
  }
}
