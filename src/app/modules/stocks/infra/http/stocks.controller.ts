import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StockMovementDTO } from '@stocks/domain/entities/stock-movement.entity';
import { AddStockMovementUseCase } from '@stocks/domain/use-cases/add-movement.use-case';
import { GetStockMovementUseCase } from '@stocks/domain/use-cases/get-movements.use-case';
import { GetStocksUseCase } from '@stocks/domain/use-cases/get-stocks.use-case';
import { Response } from 'express';

@Controller({ path: 'stocks' })
export class StocksController {
	constructor(
		private readonly getStocksUseCase: GetStocksUseCase,
		private readonly addStockMovementUseCase: AddStockMovementUseCase,
		private readonly getStockMovementUseCase: GetStockMovementUseCase,
	) {}

	@ApiQuery({ name: 'category', required: false, example: 'electronics' })
	@ApiResponse({ type: StockMovementDTO, isArray: true })
	@Get()
	async getStocks(
		@Query() { category }: { category?: string },
		@Res() res: Response,
	) {
		try {
			const response = await this.getStocksUseCase.execute(category);

			return response;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}

	@ApiBody({ type: StockMovementDTO, description: 'create Stock Movement' })
	@ApiResponse({ type: StockMovementDTO })
	@Post('/movements')
	async createStockMovement(
		@Body() movement: StockMovementDTO,
		@Res() res: Response,
	) {
		try {
			const response = await this.addStockMovementUseCase.execute(movement);

			return response;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}

	@ApiQuery({ name: 'category', required: false, example: 'electronics' })
	@ApiQuery({ name: 'page', required: false, example: 1 })
	@ApiQuery({ name: 'take', required: false, example: 10 })
	@ApiResponse({ type: StockMovementDTO, isArray: true })
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
		@Res() res: Response,
	) {
		try {
			const response = await this.getStockMovementUseCase.execute({
				page: Number(page),
				take: Number(take),
				category,
			});

			return response;
		} catch (err) {
			return res.status(err.status).json(err);
		}
	}
}
