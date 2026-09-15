import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { desc, eq, count } from 'drizzle-orm';
import { perfumeFormula } from '@server/database/schema';
import type { CreateFormulaRequest, FormulaRecord, FormulaListResponse } from '@shared/api.interface';

@Injectable()
export class FormulaService {
  private readonly logger = new Logger(FormulaService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async create(data: CreateFormulaRequest): Promise<FormulaRecord> {
    const [record] = await this.db.insert(perfumeFormula).values({
      customerWish: data.customerWish,
      perfumeName: data.perfumeName,
      directionName: data.directionName,
      feelings: data.feelings,
      formula: data.formula,
      storyCard: data.storyCard,
    }).returning({
      id: perfumeFormula.id,
      customerWish: perfumeFormula.customerWish,
      perfumeName: perfumeFormula.perfumeName,
      directionName: perfumeFormula.directionName,
      feelings: perfumeFormula.feelings,
      formula: perfumeFormula.formula,
      storyCard: perfumeFormula.storyCard,
      createdAt: perfumeFormula.createdAt,
    });

    this.logger.log(`Formula saved: ${record.id} - ${record.perfumeName}`);
    return { ...record, createdAt: record.createdAt.toISOString() } as FormulaRecord;
  }

  async list(page: number, pageSize: number): Promise<FormulaListResponse> {
    const offset = (page - 1) * pageSize;

    const [totalResult, items] = await Promise.all([
      this.db.select({ count: count() }).from(perfumeFormula),
      this.db
        .select({
          id: perfumeFormula.id,
          customerWish: perfumeFormula.customerWish,
          perfumeName: perfumeFormula.perfumeName,
          directionName: perfumeFormula.directionName,
          feelings: perfumeFormula.feelings,
          formula: perfumeFormula.formula,
          storyCard: perfumeFormula.storyCard,
          createdAt: perfumeFormula.createdAt,
        })
        .from(perfumeFormula)
        .orderBy(desc(perfumeFormula.createdAt))
        .limit(pageSize)
        .offset(offset),
    ]);

    const total = Number(totalResult[0].count);
    const mappedItems: FormulaRecord[] = items.map((item) => ({
      ...item,
      feelings: item.feelings as string[],
      formula: item.formula as FormulaRecord['formula'],
      storyCard: item.storyCard as FormulaRecord['storyCard'],
      createdAt: item.createdAt.toISOString(),
    }));
    return { items: mappedItems, total };
  }

  async getById(id: string): Promise<FormulaRecord> {
    const [record] = await this.db
      .select({
        id: perfumeFormula.id,
        customerWish: perfumeFormula.customerWish,
        perfumeName: perfumeFormula.perfumeName,
        directionName: perfumeFormula.directionName,
        feelings: perfumeFormula.feelings,
        formula: perfumeFormula.formula,
        storyCard: perfumeFormula.storyCard,
        createdAt: perfumeFormula.createdAt,
      })
      .from(perfumeFormula)
      .where(eq(perfumeFormula.id, id));

    if (!record) {
      throw new NotFoundException(`配方记录 ${id} 不存在`);
    }

    return {
      ...record,
      feelings: record.feelings as string[],
      formula: record.formula as FormulaRecord['formula'],
      storyCard: record.storyCard as FormulaRecord['storyCard'],
      createdAt: record.createdAt.toISOString(),
    };
  }
}
