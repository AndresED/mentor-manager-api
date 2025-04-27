import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { RecipientsModule } from './modules/recipients/recipients.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProjectsModule,
    TrackingModule,
    RecipientsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
