import { ICategory } from "@categories/domain/entities/category.entity"
import { CategoriesRepository } from "@categories/infra/database/categories.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateCategoryUseCase {
	constructor(
		private readonly categoriesRepository: CategoriesRepository
	) { }

	async execute(input: ICategory) {
		const response = await this.categoriesRepository.createCategory(input)

		return response
	}
}