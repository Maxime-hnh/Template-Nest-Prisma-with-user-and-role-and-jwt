import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 🔹 Gérer les exceptions NestJS (404, 400, 401, etc.)
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
      });
    }

    // 🔹 Gérer les erreurs Prisma spécifiques
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let statusCode = HttpStatus.BAD_REQUEST;
      let message = 'Erreur Prisma inconnue';

      switch (exception.code) {
        case 'P2002': // Contrainte unique violée (ex: email déjà utilisé)
          statusCode = HttpStatus.CONFLICT;
          message = `Le champ ${(exception?.meta?.target as any)[0]} doit être unique. Une autre entrée existe déjà.`;
          break;
        case 'P2025': // Aucune correspondance trouvée pour l'update/delete
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Ressource non trouvée.';
          break;
      }

      return response.status(statusCode).json({
        statusCode,
        message,
      });
    }

    // 🔹 Gérer les erreurs générales (500)
    console.error('Erreur inconnue :', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    });
  }
}
