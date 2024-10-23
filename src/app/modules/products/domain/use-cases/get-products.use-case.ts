import { ProductsRepository } from '@products/infra/database/products.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProductsUseCase {
	constructor(private readonly productsRepository: ProductsRepository) {}

	async execute({ page, take }: { page?: number; take?: number }) {
		const { count, data } = await this.productsRepository.getProducts({
			page: page ?? 1,
			take: take ?? 10,
		});

		return {
			data: data,
			meta: {
				total: count,
				page: page ?? 1,
				take: take ?? 10,
				previousPage: `/?page=${page === 1 ? 1 : page - 1}&take=${take ?? 10}`,
				nextPage: `/?page=${page + 1}&take=${take ?? 10}`,
			},
		};
	}
}
