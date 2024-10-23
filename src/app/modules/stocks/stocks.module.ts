import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/services/prisma.service";
import { StocksController } from "@stocks/infra/http/stocks.controller";
import { StockRepository } from "@stocks/infra/database/stock.repository";
import { PrismaStockRepository } from "@stocks/infra/database/prisma-stock.repository";
import { AddStockMovementUseCase } from "@stocks/domain/use-cases/add-movement.use-case";
import { GetStockMovementUseCase } from "@stocks/domain/use-cases/get-movements.use-case";
import { GetStocksUseCase } from "@stocks/domain/use-cases/get-stocks.use-case";

@Module({
	imports: [],
	controllers: [
		StocksController
	],
	providers: [
		PrismaService,
		AddStockMovementUseCase,
		GetStockMovementUseCase,
		GetStocksUseCase,
		{
			provide: StockRepository,
			useClass: PrismaStockRepository,
		}
	],
})
export class StocksModule { }