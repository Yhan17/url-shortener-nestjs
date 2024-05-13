import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlSchema } from 'src/schemas/url.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }])],
  providers: [UrlsService],
  controllers: [UrlsController]
})
export class UrlsModule {}
