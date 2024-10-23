import { CategoryDTO } from '@categories/domain/entities/category.entity';
import { CreateCategoryUseCase } from '@categories/domain/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '@categories/domain/use-cases/get-categories.use-case';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller({
	path: 'categories',
})
export class CategoriesController {
	constructor(
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly getCategoriesUseCase: GetCategoriesUseCase,
	) {}

	@ApiBody({
		description: 'new category',
		type: CategoryDTO,
	})
	@ApiResponse({ status: 201, type: CategoryDTO })
	@Post()
	async createCategory(@Body() input: CategoryDTO, @Res() res: Response) {
		try {
			const response = await this.createCategoryUseCase.execute(input);

			return response;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}

	@ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
	@ApiQuery({ name: 'take', type: Number, required: false, example: 10 })
	@ApiResponse({ status: 200, type: CategoryDTO, isArray: true })
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
