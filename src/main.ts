import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './shared/infrastructure/logger/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/infrastructure/filters/all-exceptions.filter';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    // Habilitar CORS
    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());
    // Configurar validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    // Global Error Handler
    app.useGlobalFilters(new AllExceptionsFilter());
    // Global Response Handler
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.enableCors({
      origin: '*', // Allows all origins
      allowedHeaders: '*', // ✅ Allows all headers
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
      .setTitle('Clean Architecture API')
      .setDescription('API documentation using clean architecture with NestJS')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: `Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        'Authorization',
      )
      .build();
    const PORT = process.env.PORT ?? 3000;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    SwaggerModule.setup('/', app, document);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await app.listen(PORT, async () => {
      Logger.log('Mapped {/, GET} Swagger api route', 'RouterExplorer');
      Logger.log('Mapped {/docs, GET} Swagger api route', 'RouterExplorer');
      Logger.log(`Enviroment running at ${process.env.NODE_ENV}`);
      Logger.log(`🚀  Server is running at ${await app.getUrl()}`);
    });
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit(1);
  }
}
// Single bootstrap call with error handling
bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false);
  process.exit(1);
});
