import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from 'src/schemas/url.schema';

@Injectable()
export class UrlsService {
    constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

    async create(createUrlDto: any): Promise<Url> {
        const createdUrl = new this.urlModel(createUrlDto);
        return createdUrl.save();
    }

    async findAll(): Promise<Url[]> {
        return this.urlModel.find().exec();
    }

    async findOne(originalUrl: string): Promise<Url> {
        return this.urlModel.findOne({originalUrl}).exec();
    }

    async findOneById(urlId: string): Promise<Url> {
        return this.urlModel.findOne({urlId}).exec();
    }

    async incrementClicks(urlId: string): Promise<void> {
        await this.urlModel.updateOne(
          { urlId },
          { $inc: { clicks: 1 } }
        );
      }
}
