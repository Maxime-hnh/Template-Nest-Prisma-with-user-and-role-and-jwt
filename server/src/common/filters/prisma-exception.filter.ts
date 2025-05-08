import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 🔹 Gérer les exceptions NestJS (404, 400, 401, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = {
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      this.logger.error(`HTTP Exception: ${status} - ${exception.message} - ${request.url}`);
      return response.status(status).json(errorResponse);
    }

    // 🔹 Gérer les erreurs Prisma spécifiques
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let statusCode = HttpStatus.BAD_REQUEST;
      let message = 'Erreur Prisma inconnue';
      const code = exception.code;

      switch (code) {
        case 'P2002': // Contrainte unique violée (ex: email déjà utilisé)
          statusCode = HttpStatus.CONFLICT;
          const field = (exception?.meta?.target as any)[0] || 'Un champ';
          message = `Le champ ${field} doit être unique. Une autre entrée existe déjà.`;
          break;
        case 'P2025': // Aucune correspondance trouvée pour l'update/delete
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Ressource non trouvée.';
          break;
        case 'P2003': // Violation de contrainte de clé étrangère
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Violation de contrainte de clé étrangère. Une référence n\'existe pas.';
          break;
        case 'P2014': // Violation de contrainte de relation
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Les relations entre les entités sont invalides.';
          break;
        case 'P2015': // Enregistrement non trouvé
          statusCode = HttpStatus.NOT_FOUND;
          message = 'L\'enregistrement demandé n\'existe pas.';
          break;
        case 'P2016': // Erreur de requête
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Erreur dans la requête: format ou paramètres invalides.';
          break;
        case 'P2017': // Relation entre les enregistrements inexistante
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'La relation entre les enregistrements n\'existe pas.';
          break;
      }

      const errorResponse = {
        statusCode,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      this.logger.error(`Prisma Error: ${code} - ${message} - ${request.url}`);
      return response.status(statusCode).json(errorResponse);
    }

    // 🔹 Gérer les erreurs Prisma de validation
    if (exception instanceof Prisma.PrismaClientValidationError) {
      const statusCode = HttpStatus.BAD_REQUEST;
      const message = 'Erreur de validation des données.';

      const errorResponse = {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: exception.message.split('\n').filter(line => line.trim() !== ''),
      };

      this.logger.error(`Prisma Validation Error: ${message} - ${request.url}`);
      return response.status(statusCode).json(errorResponse);
    }

    // 🔹 Gérer les erreurs générales (500)
    this.logger.error(`Erreur inconnue: ${exception.message || exception}`, exception.stack);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
