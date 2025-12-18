import { FastifyInstance } from 'fastify';
import { transactionController } from '../controllers/transaction.controller';

export default async function transactionRoutes(fastify: FastifyInstance) {
  fastify.post('/analyze', transactionController.analyze.bind(transactionController));
  fastify.get('/health', transactionController.health.bind(transactionController));
}
