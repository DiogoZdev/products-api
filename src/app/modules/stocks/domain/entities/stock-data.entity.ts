interface StockProduct {
	name: string
	currentStock: number
	category: string
}

export interface IStockData {
	products: StockProduct[]
	totalQuantity: number
}