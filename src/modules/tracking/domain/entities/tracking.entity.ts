import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum TrackingStatus {
  IN_PROGRESS = 'En proceso',
  FINISHED = 'Finalizado',
}

@Schema({ timestamps: true })
export class Tracking {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: TrackingStatus,
    default: TrackingStatus.IN_PROGRESS,
  })
  status: TrackingStatus;

  @Prop({ required: true })
  developer: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
  })
  projectId: MongooseSchema.Types.ObjectId | string;

  @Prop()
  completedObjectives: string;

  @Prop()
  pendingObjectives: string;

  @Prop()
  incidents: string;

  @Prop()
  observations: string;

  @Prop()
  nextObjectives: string;

  @Prop({ default: false })
  coffeeBreaks: boolean;

  @Prop({ default: false })
  notesCoffeeBreaks: string;

  @Prop({ default: false })
  codeReviews: boolean;

  @Prop({ default: false })
  notesCodeReviews: string;

  @Prop({ default: false })
  pairProgramming: boolean;

  @Prop({ default: false })
  notesPairProgramming: string;

  @Prop({ default: false })
  reportSent: boolean;
}

export type TrackingDocument = Tracking & Document;
export const TrackingSchema = SchemaFactory.createForClass(Tracking);
