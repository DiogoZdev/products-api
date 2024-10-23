import { ISotckMovement, StockMovementTypeEnum } from "@stocks/domain/entities/stock-movement.entity";
import { StockRepository } from "@stocks/infra/database/stock.repository";
import { PrismaService } from "@shared/services/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IList } from "@shared/interfaces/list.interface";
import { IStockData } from "@stocks/domain/entities/stock-data.entity";
import { Prisma } from "@prisma/client";
import { generateId } from "@shared/utils/generate-id.util";

@Injectable()
export class PrismaStockRepository implements StockRepository {
	constructor(
		private readonly prisma: PrismaService
	) { }
	async createStockMovement(input: ISotckMovement): Promise<ISotckMovement> {
		const foundProduct = await this.prisma.product.findUnique({
			where: {
				id: input.productId
			},
			include: {
				Stock: {
					select: {
						quantity: true
					}
				}
			}

		})

		if (!foundProduct) {
			throw new HttpException("Product not found", HttpStatus.BAD_REQUEST);
		}

		if (foundProduct.Stock.quantity < input.quantity && input.type === StockMovementTypeEnum.EXIT) {
			throw new HttpException("Not enough stock", HttpStatus.BAD_REQUEST);
		}

		await this.prisma.$transaction(async (tx) => {
			await tx.stockMovement.create({
				data: {
					...input,
					id: generateId()
				}
			})

			await this.prisma.stock.update({
				where: {
					productId: foundProduct.id
				},
				data: {
					quantity: input.type === StockMovementTypeEnum.EXIT
						? foundProduct.Stock.quantity - input.quantity
						: foundProduct.Stock.quantity + input.quantity
				}
			})
		})

		return input
	}

	async getStockMovements({
		page = 1,
		take = 10,
		category
	}: {
		page?: number;
		take?: number;
		category?: string;
	}): Promise<IList<ISotckMovement>> {

		let where: Prisma.StockMovementWhereInput = {}

		if (category) {
			where = {
				Product: {
					CategoryToProduct: {
						some: {
							category: {
								name: {
									equals: category,
									mode: 'insensitive'
								}
							}
						}
					}
				}
			}
		}

		const count = await this.prisma.stockMovement.count({
			where
		})

		const stockMovements = await this.prisma.stockMovement.findMany({
			skip: (page - 1) * take,
			take,
			where,
			include: {
				Product: {
					include: {
						Stock: true
					}
				}
			}
		})

		return {
			data: stockMovements.map((movement) => {
				return {
					id: movement.id,
					productId: movement.Product.id,
					type: movement.type as StockMovementTypeEnum,
					quantity: movement.Product.Stock.quantity,
					date: movement.date.toISOString(),
					description: movement.description
				}
			}),
			count,
		}
	}

	async getStocks(categoryFilter?: string): Promise<IStockData> {

		const where: Prisma.ProductWhereInput = {
			deletedAt: null,
			CategoryToProduct: undefined
		}

		if (categoryFilter) {
			where.CategoryToProduct = {
				some: {
					category: {
						name: {
							equals: categoryFilter,
							mode: 'insensitive'
						}
					}
				}
			}
		}

		const res = await this.prisma.product.findMany({
			where,
			include: {
				Stock: {
					select: {
						quantity: true
					}
				},
				CategoryToProduct: {
					select: {
						category: {
							select: {
								id: true
							}
						}
					}
				}
			},
		})

		return {
			products: res.map((product) => {
				return {
					name: product.name,
					currentStock: product.Stock.quantity,
					category: categoryFilter
						? categoryFilter
						: product.CategoryToProduct.map(c => c.category.id).join(', ')
				}
			}),
			totalQuantity: res.reduce((acc, curr) => acc + curr.Stock.quantity, 0)
		}
	}
}