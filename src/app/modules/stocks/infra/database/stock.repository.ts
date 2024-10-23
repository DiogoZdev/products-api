import { IList } from "@shared/interfaces/list.interface";
import { IStockData } from "@stocks/domain/entities/stock-data.entity";
import { ISotckMovement } from "@stocks/domain/entities/stock-movement.entity";

export abstract class StockRepository {
	abstract createStockMovement(input: ISotckMovement): Promise<ISotckMovement>

	abstract getStockMovements(input: { page?: number, take?: number, category?: string }): Promise<IList<ISotckMovement>>

	abstract getStocks(category?: string): Promise<IStockData>
}