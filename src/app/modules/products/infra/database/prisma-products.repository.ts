import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { PrismaService } from '@shared/services/prisma.service';
import { generateId } from '@shared/utils/generate-id.util';
import { IProduct } from '@products/domain/entities/product.entity';
import { IList } from '@shared/interfaces/list.interface';
import { StockMovementTypeEnum } from '@stocks/domain/entities/stock-movement.entity';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createProduct(input: IProduct): Promise<IProduct> {
		try {
			const productExists = await this.prisma.product.findFirst({
				where: {
					name: {
						equals: input.name,
						mode: 'insensitive',
					},
					price: input.price,
					deletedAt: null,
				},
			});

			if (productExists) {
				throw new HttpException(
					`Product "${input.name}" already exists`,
					HttpStatus.CONFLICT,
				);
			}

			const { categories, name, price, quantity } = input;
			const productId = generateId();
			const existingCategories: string[] = [];

			const newProduct = await this.prisma.$transaction(async (tx) => {
				const createdProduct = await tx.product.create({
					data: {
						id: productId,
						name,
						price,
					},
					include: {
						CategoryToProduct: {
							select: {
								categoryId: true,
							},
						},
						Stock: {
							select: {
								quantity: true,
							},
						},
					},
				});

				for (const category of categories) {
					const categoryExists = await tx.category.findFirst({
						where: {
							id: category,
							deletedAt: null,
						},
					});

					if (categoryExists) {
						existingCategories.push(category);

						await tx.categoryToProduct.create({
							data: {
								id: generateId(),
								categoryId: category,
								productId,
							},
						});
					}
				}

				await tx.stockMovement.create({
					data: {
						id: generateId(),
						productId,
						type: StockMovementTypeEnum.ENTRY,
						description: 'Adding new product',
						quantity,
						date: new Date(),
					},
				});

				await tx.stock.create({
					data: {
						id: generateId(),
						productId,
						quantity,
					},
				});

				return {
					...createdProduct,
					categories: existingCategories,
				};
			});

			return {
				categories: existingCategories,
				name: newProduct.name,
				price: Number(newProduct.price),
				quantity,
			};
		} catch (err) {
			console.error(err);

			return err;
		}
	}

	async getProducts({
		page,
		take,
	}: {
		page?: number;
		take?: number;
	}): Promise<IList<IProduct>> {
		try {
			const where = {
				deletedAt: null,
			};

			const [data, count] = await Promise.all([
				this.prisma.product.findMany({
					where,
					take: take ?? 10,
					skip: (page - 1) * take,
					include: {
						CategoryToProduct: {
							select: {
								categoryId: true,
							},
						},
						Stock: {
							select: {
								quantity: true,
							},
						},
					},
				}),
				this.prisma.product.count({ where }),
			]);

			return {
				data: data.map((p) => {
					return {
						categories: p.CategoryToProduct.map((c) => c.categoryId),
						name: p.name,
						price: Number(p.price),
						quantity: Number(p.Stock.quantity),
					};
				}),
				count,
			};
		} catch (err) {
			console.error(err);

			throw new Error('An error occurred getting the products');
		}
	}

	async getProductById(id: string): Promise<IProduct> {
		const product = await this.prisma.product.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				CategoryToProduct: {
					select: {
						categoryId: true,
					},
				},
				Stock: {
					select: {
						quantity: true,
					},
				},
			},
		});

		if (!product) {
			throw new HttpException(
				`The Product was not found for id ${id}`,
				HttpStatus.BAD_REQUEST,
			);
		}

		return {
			categories: product.CategoryToProduct.map((c) => c.categoryId),
			name: product.name,
			price: Number(product.price),
			quantity: Number(product.Stock.quantity),
		};
	}

	async deleteProductById(id: string): Promise<string> {
		try {
			const exists = await this.getProductById(id);

			if (!exists) {
				throw new HttpException(
					`The Product for id ${id} was not found`,
					HttpStatus.BAD_REQUEST,
				);
			}

			await this.prisma.product.update({
				where: {
					id,
				},
				data: {
					deletedAt: new Date(),
				},
			});

			return `The Product for id ${id} was deleted`;
		} catch (err) {
			console.error(err);

			return err;
		}
	}

	async updateProductById({
		id,
		data,
	}: {
		id: string;
		data: IProduct;
	}): Promise<IProduct> {
		try {
			const productExists = await this.getProductById(id);

			if (!productExists) {
				throw new HttpException(
					`The Product for id ${id} was not found`,
					HttpStatus.BAD_REQUEST,
				);
			}

			const { categories, name, price } = data;

			const updatedProduct = await this.prisma.product.update({
				where: {
					id,
				},
				data: {
					name,
					price,
				},
				include: {
					CategoryToProduct: {
						select: {
							categoryId: true,
						},
					},
					Stock: {
						select: {
							quantity: true,
						},
					},
				},
			});

			const updatedCategories = [];

			if (categories.length) {
				await this.prisma.categoryToProduct.deleteMany({
					where: {
						productId: id,
					},
				});

				for (const category of categories) {
					const categoryExists = await this.prisma.category.findFirst({
						where: {
							id: category,
							deletedAt: null,
						},
					});

					if (!categoryExists) {
						return;
					}

					updatedCategories.push(category);

					await this.prisma.categoryToProduct.create({
						data: {
							id: generateId(),
							categoryId: category,
							productId: id,
						},
					});
				}
			}

			return {
				name: updatedProduct.name,
				quantity: Number(updatedProduct.Stock.quantity),
				price: Number(updatedProduct.price),
				categories: updatedCategories.length
					? updatedCategories
					: updatedProduct.CategoryToProduct.map((c) => c.categoryId),
			};
		} catch (err) {
			console.error(err);

			return err;
		}
	}
}
