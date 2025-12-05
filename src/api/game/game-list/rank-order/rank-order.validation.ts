import { z } from 'zod';

export const RankOrderItemSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(200),
  imageUrl: z.string().url().optional(),
  correctOrder: z.number().int().positive(),
});

export const RankOrderGameDataSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  items: z.array(RankOrderItemSchema).min(2).max(10),
  timeLimit: z.number().int().positive().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const RankOrderSubmissionSchema = z.object({
  userOrder: z.array(z.string()).min(2),
  timeSpent: z.number().int().min(0),
});

export type IRankOrderGameData = z.infer<typeof RankOrderGameDataSchema>;
export type IRankOrderSubmission = z.infer<typeof RankOrderSubmissionSchema>;
