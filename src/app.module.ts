import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { RecipientsModule } from './modules/recipients/recipients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost/project-tracking',
      }),
      inject: [ConfigService],
    }),
    ProjectsModule,
    TrackingModule,
    RecipientsModule,
  ],
})
export class AppModule {}
