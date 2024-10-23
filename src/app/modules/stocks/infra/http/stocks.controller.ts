import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StockMovementDTO } from '@stocks/domain/entities/stock-movement.entity';
import { AddStockMovementUseCase } from '@stocks/domain/use-cases/add-movement.use-case';
import { GetStockMovementUseCase } from '@stocks/domain/use-cases/get-movements.use-case';
import { GetStocksUseCase } from '@stocks/domain/use-cases/get-stocks.use-case';

@Controller({ path: 'stocks' })
export class StocksController {
	constructor(
		private readonly getStocksUseCase: GetStocksUseCase,
		private readonly addStockMovementUseCase: AddStockMovementUseCase,
		private readonly getStockMovementUseCase: GetStockMovementUseCase,
	) {}

	@Get()
	async getStocks(@Query() { category }: { category?: string }) {
		const response = await this.getStocksUseCase.execute(category);

		return response;
	}

	@Post('/movements')
	async createStockMovement(@Body() movement: StockMovementDTO) {
		const response = await this.addStockMovementUseCase.execute(movement);

		return response;
	}

	@Get('/movements')
	async getStockMovements(
		@Query()
		{
			page = 1,
			take = 10,
			category,
		}: {
			page?: number;
			take?: number;
			category?: string;
		},
	) {
		const response = await this.getStockMovementUseCase.execute({
			page: Number(page),
			take: Number(take),
			category,
		});

		return response;
	}
}
