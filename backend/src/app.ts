import Fastify from 'fastify';
import transactionRoutes from './routes/transaction.routes';

export const app = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  },
});

// Register Routes
app.register(transactionRoutes, { prefix: '/api/v1/transactions' });

// Global Error Handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ success: false, error: 'Internal Server Error' });
});
