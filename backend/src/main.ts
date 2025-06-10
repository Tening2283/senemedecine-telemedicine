import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuration de sécurité
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`],
          manifestSrc: [`'self'`],
          frameSrc: [`'self'`],
        },
      },
    })
  );

  // Compression des réponses
  app.use(compression());

  // Configuration CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      configService.get('FRONTEND_URL', 'http://localhost:3000'),
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Hospital-Id'],
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Préfixe global pour l'API
  app.setGlobalPrefix('api/v1');

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('SeneMedecine API')
    .setDescription("API pour l'application de télémédecine SeneMedecine")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Auth', 'Authentification et autorisation')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Hospitals', 'Gestion des hôpitaux')
    .addTag('Patients', 'Gestion des patients')
    .addTag('Consultations', 'Gestion des consultations')
    .addTag('DICOM', 'Gestion des images DICOM')
    .addTag('Appointments', 'Gestion des rendez-vous')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Point de santé
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'SeneMedecine Backend',
      version: '1.0.0',
    });
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port);

  console.log(`🏥 SeneMedecine Backend démarré sur le port ${port}`);
  console.log(`📚 Documentation API disponible sur http://localhost:${port}/api`);
  console.log(`🔍 Point de santé disponible sur http://localhost:${port}/health`);
}

bootstrap();
