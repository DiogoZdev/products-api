import { Injectable } from "@nestjs/common";
import { StockRepository } from "@stocks/infra/database/stock.repository";

@Injectable()
export class GetStocksUseCase {
	constructor(
		private readonly stocksRepository: StockRepository
	) { }

	execute(category?: string) {
		return this.stocksRepository.getStocks(category)
	}
}