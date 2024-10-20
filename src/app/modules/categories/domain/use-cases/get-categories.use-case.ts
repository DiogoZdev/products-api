import { CategoriesRepository } from "@categories/infra/database/categories.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetCategoriesUseCase {
	constructor(private readonly categoriesRepository: CategoriesRepository) { }

	async execute({ page, take }: { page?: number, take?: number }) {
		const { count, data } = await this.categoriesRepository.getCategories({
			page: page ?? 1,
			take: take ?? 10,
		})

		return {
			data: data,
			meta: {
				total: count,
				page: page ?? 1,
				take: take ?? 10,
				previousPage: `/?page=${page === 1 ? 1 : page - 1}&take=${take ?? 10}`,
				nextPage: `/?page=${page + 1}&take=${take ?? 10}`,
			}
		}
	}
}