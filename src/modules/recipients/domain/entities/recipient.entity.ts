import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Recipient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  role: string;
}

export type RecipientDocument = Recipient & Document;
export const RecipientSchema = SchemaFactory.createForClass(Recipient);
