import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Url {
    @Prop({ required: true })
    urlId: string;

    @Prop({ required: true })
    originalUrl: string;

    @Prop({ required: true })
    shortUrl: string;

    @Prop({type: Number ,default: 0})
    clicks: number;
}

export type UrlDocument = HydratedDocument<Url>;

export const UrlSchema = SchemaFactory.createForClass(Url);
