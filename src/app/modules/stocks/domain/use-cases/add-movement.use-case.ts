import { Injectable } from '@nestjs/common';
import { StockRepository } from '@stocks/infra/database/stock.repository';
import { ISotckMovement } from '../entities/stock-movement.entity';

@Injectable()
export class AddStockMovementUseCase {
	constructor(private readonly stocksRepository: StockRepository) {}

	execute(input: ISotckMovement) {
		return this.stocksRepository.createStockMovement(input);
	}
}
