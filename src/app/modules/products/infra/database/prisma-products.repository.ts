import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { PrismaService } from "@shared/services/prisma.service";
import { generateId } from "@shared/utils/generate-id.util";
import { IProduct } from "@products/domain/entities/product.entity";
import { IList } from "@shared/interfaces/list.interface";

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
	constructor(private readonly prisma: PrismaService) { }

	async createProduct(input: IProduct): Promise<IProduct> {
		try {
			const exists = await this.prisma.product.findFirst({
				where: {
					name: input.name,
					price: input.price,
					deletedAt: null
				}
			})

			if (exists) {
				throw new HttpException(`Product "${input.name}" already exists`, HttpStatus.CONFLICT);
			}

			const { categories, name, price, quantity } = input

			const productId = generateId()
			const res = await this.prisma.product.create({
				data: {
					id: productId,
					name,
					price,
					quantity,
				},
				include: {
					CategorieToProduct: {
						select: {
							categoryId: true
						}
					}
				}
			});

			const existingCategories = [];

			for (const category of categories) {

				const exists = await this.prisma.category.findFirst({
					where: {
						id: category,
						deletedAt: null
					}
				})

				if (!exists) {
					existingCategories.push(category)

					await this.prisma.categoryToProduct.create({
						data: {
							id: generateId(),
							categoryId: category,
							productId,
						}
					})
				}
			}

			return {
				categories: existingCategories,
				name: res.name,
				price: Number(res.price),
				quantity: Number(res.quantity),
			}
		}
		catch (e) {
			console.error(e)

			return e
		}
	}

	async getProducts({
		page,
		take,
	}: { page?: number, take?: number }): Promise<IList<IProduct>> {
		try {
			const where = {
				deletedAt: null
			}

			const [data, count] = await Promise.all([
				this.prisma.product.findMany({
					where,
					take: take ?? 10,
					skip: (page - 1) * take,
					include: {
						CategorieToProduct: {
							select: {
								categoryId: true
							}
						}
					}
				}),
				this.prisma.product.count({ where })
			])

			return {
				data: data.map(p => {
					return {
						categories: p.CategorieToProduct.map(c => c.categoryId),
						name: p.name,
						price: Number(p.price),
						quantity: Number(p.quantity),
					}
				}),
				count,
			}
		}
		catch (e) {
			console.error(e)

			throw new Error("An error occurred getting the products");
		}
	}

	async getProductById(id: string): Promise<IProduct> {
		const product = await this.prisma.product.findFirst({
			where: {
				id,
				deletedAt: null
			},
			include: {
				CategorieToProduct: {
					select: {
						categoryId: true
					}
				}
			}
		})

		if (!product) {
			throw new HttpException(`The Product was not found for id ${id}`, HttpStatus.BAD_REQUEST);
		}

		return {
			categories: product.CategorieToProduct.map(c => c.categoryId),
			name: product.name,
			price: Number(product.price),
			quantity: Number(product.quantity),
		}
	}

	async deleteProductById(id: string): Promise<string> {
		try {
			const exists = await this.getProductById(id)

			if (!exists) {
				throw new HttpException(`The Product for id ${id} was not found`, HttpStatus.BAD_REQUEST);
			}

			await this.prisma.product.update({
				where: {
					id
				},
				data: {
					deletedAt: new Date()
				}
			})

			return `The Product for id ${id} was deleted`;
		}
		catch (e) {
			console.error(e)

			return e;
		}
	}

	async updateProductById({ id, data }: { id: string, data: IProduct }): Promise<IProduct> {
		try {
			const productExists = await this.getProductById(id)

			if (!productExists) {
				throw new HttpException(`The Product for id ${id} was not found`, HttpStatus.BAD_REQUEST);
			}

			const { categories, name, price } = data

			const updatedProduct = await this.prisma.product.update({
				where: {
					id
				},
				data: {
					name,
					price,
				},
				include: {
					CategorieToProduct: {
						select: {
							categoryId: true
						}
					}
				}
			})

			const updatedCategories = []

			if (categories.length) {
				await this.prisma.categoryToProduct.deleteMany({
					where: {
						productId: id
					}
				})

				for (const category of categories) {

					const categoryExists = await this.prisma.category.findFirst({
						where: {
							id: category,
							deletedAt: null
						}
					})

					if (!categoryExists) {
						return
					}

					updatedCategories.push(category)

					await this.prisma.categoryToProduct.create({
						data: {
							id: generateId(),
							categoryId: category,
							productId: id,
						}
					})
				}
			}

			return {
				name: updatedProduct.name,
				quantity: Number(updatedProduct.quantity),
				price: Number(updatedProduct.price),
				categories: updatedCategories.length
					? updatedCategories
					: updatedProduct.CategorieToProduct.map(c => c.categoryId),
			}
		}
		catch (e) {
			console.error(e)

			return e
		}
	}
}