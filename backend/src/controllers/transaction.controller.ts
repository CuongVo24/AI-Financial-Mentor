import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { geminiService } from '../services/gemini.service';
import { AnalyzeRequest, APIResponse } from '../type';

const analyzeSchema = z.object({
  rawText: z.string().min(1, "rawText is required"),
});

export class TransactionController {
  async analyze(req: FastifyRequest<{ Body: AnalyzeRequest }>, reply: FastifyReply) {
    try {
      const { rawText } = analyzeSchema.parse(req.body);

      const result = await geminiService.parseNotification(rawText);

      const response: APIResponse<typeof result> = {
        success: true,
        data: result
      };

      return reply.code(200).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Fix: Use .issues instead of .errors as .errors does not exist on ZodError type
        return reply.code(400).send({ success: false, error: error.issues });
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return reply.code(500).send({ success: false, error: errorMessage });
    }
  }

  async health(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send({ success: true, data: { status: 'ok', service: 'Momo AI Backend' } });
  }
}

export const transactionController = new TransactionController();