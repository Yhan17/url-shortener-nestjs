import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Request, Response } from 'express';
import { validateUrl } from 'src/utils/utils';
import { v4 as uuidv4 } from 'uuid';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlService: UrlsService) {}

  @Get()
  async getAllUrls(@Res() res: Response) {
    try {
      const urls = await this.urlService.findAll();
      res.status(200).send({
        message: 'URLs fetched',
        data: urls,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || 'Internal server error occurred',
      });
    }
  }

  @Get('/:urlId')
  async redirectToOriginalUrl(@Param('urlId') urlId: string, @Res() res: Response) {
    try {
      const url = await this.urlService.findOneById(urlId);

      if (!url) {
        throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
      }

      await this.urlService.incrementClicks(urlId);

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/shorten-url')
  async shortenUrl(@Req() request: Request, @Res() res: Response) {
    const { url } = request.body;
    const urlId = uuidv4();
    if (validateUrl(url)) {
      try {
        const urlInDb = await this.urlService.findOne(url);
        if (urlInDb) {
          res.status(200).send({
            message: 'URL already exists',
            data: urlInDb,
          });
          return;
        }

        const host = request.headers.host;
        const shortUrl = `http://${host}/urls/${urlId}`;
        const newUrl = await this.urlService.create({
          originalUrl: url,
          shortUrl,
          urlId,
        });
        res.status(201).send({
          message: 'URL shortened',
          data: newUrl,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message || 'Internal server error occurred',
        });
        return;
      }
    } else {
      res.status(400).send({
        message: 'Invalid URL',
      });
    }
  }
}
