import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FormulaService } from './formula.service';
import type { CreateFormulaRequest } from '@shared/api.interface';

@Controller('api/formulas')
export class FormulaController {
  constructor(private readonly formulaService: FormulaService) {}

  @Post()
  async create(@Body() body: CreateFormulaRequest) {
    return this.formulaService.create(body);
  }

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const ps = Math.min(50, Math.max(1, parseInt(pageSize || '20', 10) || 20));
    return this.formulaService.list(p, ps);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.formulaService.getById(id);
  }
}
