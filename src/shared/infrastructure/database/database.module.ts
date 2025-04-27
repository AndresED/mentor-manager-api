import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './database.config';

@Module({
  imports: [MongooseModule.forRoot(databaseConfig.mongoUrl)],
  exports: [MongooseModule],
})
export class DatabaseModule {}
