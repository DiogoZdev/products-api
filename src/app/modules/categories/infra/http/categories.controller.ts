import { CategoryDTO } from '@categories/domain/entities/category.entity';
import { CreateCategoryUseCase } from '@categories/domain/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '@categories/domain/use-cases/get-categories.use-case';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller({
	path: 'categories',
})
export class CategoriesController {
	constructor(
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly getCategoriesUseCase: GetCategoriesUseCase,
	) {}

	@Post()
	async createCategory(@Body() input: CategoryDTO, @Res() res: Response) {
		try {
			const response = await this.createCategoryUseCase.execute(input);

			return response;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}

	@Get()
	async getCategories(
		@Query() { page = 1, take = 10 }: { page?: number; take?: number },
		@Res() res: Response,
	) {
		try {
			const res = await this.getCategoriesUseCase.execute({
				page: Number(page),
				take: Number(take),
			});

			return res;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}
}
