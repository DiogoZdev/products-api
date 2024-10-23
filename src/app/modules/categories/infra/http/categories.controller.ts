import { CategoryDTO } from '@categories/domain/entities/category.entity';
import { CreateCategoryUseCase } from '@categories/domain/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '@categories/domain/use-cases/get-categories.use-case';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller({
	path: 'categories',
})
export class CategoriesController {
	constructor(
		private readonly createCategoryUseCase: CreateCategoryUseCase,
		private readonly getCategoriesUseCase: GetCategoriesUseCase,
	) {}

	@Post()
	createCategory(@Body() input: CategoryDTO) {
		return this.createCategoryUseCase.execute(input);
	}

	@Get()
	async getCategories(
		@Query() { page = 1, take = 10 }: { page?: number; take?: number },
	) {
		const res = await this.getCategoriesUseCase.execute({
			page: Number(page),
			take: Number(take),
		});

		return res;
	}
}
