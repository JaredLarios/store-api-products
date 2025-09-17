import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    const clientIp = _req.ip || 'unknown';
    const clientPort = _req.socket.remotePort || 'unknown';
    const method = _req.method;
    const path = _req.url || 'unknown';

    _res.on('finish', () => {
      const statusCode = _res.statusCode;
      console.log(
        `${clientIp}:${clientPort} - ${method} ${path} ${statusCode}`,
      );
    });
    next();
  }
}
