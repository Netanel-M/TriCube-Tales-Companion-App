import { z } from 'zod';

export const CharacterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    genre: z.string().min(1, "Genre is required"),
    trait: z.enum(['Agile', 'Brawny', 'Crafty']),
    concept: z.string().min(1, "Concept is required"),
    perks: z.array(z.string()).min(1, "At least one perk is required"),
    quirks: z.array(z.string()).min(1, "At least one quirk is required"),
    karma: z.number().int().min(0).max(6).default(3),
    resolve: z.number().int().min(0).max(6).default(3),
    maxKarma: z.number().int().min(1).max(6).default(3),
    maxResolve: z.number().int().min(1).max(6).default(3),
    sceneCount: z.number().int().min(0).default(0),
    level: z.number().int().min(0).default(0),
    tags: z.array(z.string()).default([]),
});

export const LogEntrySchema = z.object({
    id: z.string().uuid(),
    timestamp: z.number(),
    type: z.enum(['roll', 'oracle', 'note']),
    content: z.string(),
    result: z.any().optional(),
});

export const GameSessionSchema = z.object({
    characterId: z.string().uuid().optional(),
    sceneToken: z.number().default(0),
    log: z.array(LogEntrySchema).default([]),
});

export const OracleSchema = z.object({
    themes: z.array(z.string()),
    actions: z.array(z.string()),
    subjects: z.array(z.string()),
});
