import { Injectable } from '@nestjs/common';
import { StockRepository } from '@stocks/infra/database/stock.repository';

@Injectable()
export class GetStockMovementUseCase {
	constructor(private readonly stocksRepository: StockRepository) {}

	async execute({
		page,
		take,
		category,
	}: {
		page?: number;
		take?: number;
		category?: string;
	}) {
		const { data, count } = await this.stocksRepository.getStockMovements({
			page,
			take,
			category,
		});

		return {
			data,
			meta: {
				total: count,
				page,
				take,
				previousPage: `/?page=${page === 1 ? 1 : page - 1}&take=${take}${category ? '&category=' + category : ''}`,
				nextPage: `/?page=${page + 1}&take=${take}${category ? '&category=' + category : ''}`,
			},
		};
	}
}
