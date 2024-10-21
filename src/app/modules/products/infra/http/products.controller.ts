import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ProductDTO } from "@products/domain/entities/product.entity";
import { CreateProductUseCase } from "@products/domain/use-cases/create-product.use-case";
import { DeleteProductByIdUseCase } from "@products/domain/use-cases/delete-product.use-case";
import { GetProductsUseCase } from "@products/domain/use-cases/get-products.use-case";
import { GetProductByIdUseCase } from "@products/domain/use-cases/get_product-by-id.use-case";
import { UpdateProductUseCase } from "@products/domain/use-cases/update-product.use-case";

@Controller({
	path: "/products",
})
export class ProductsController {

	constructor(
		private readonly createProductUseCase: CreateProductUseCase,
		private readonly getProductsUseCase: GetProductsUseCase,
		private readonly getProductsByIdUseCase: GetProductByIdUseCase,
		private readonly deleteProductUseCase: DeleteProductByIdUseCase,
		private readonly updateProductUseCase: UpdateProductUseCase,
	) { }

	@Post()
	createProduct(@Body() input: ProductDTO) {
		return this.createProductUseCase.execute(input)
	}

	@Get()
	getProducts(
		@Query() query: { page?: number, take?: number }
	) {
		const { page = 1, take = 10 } = query;

		return this.getProductsUseCase.execute({
			page: Number(page),
			take: Number(take),
		})
	}

	@Get(':id')
	async getProductsById(
		@Param('id') id: string
	) {
		const res = this.getProductsByIdUseCase.execute(id)
		return res
	}

	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		const res = await this.deleteProductUseCase.execute(id)
		return res
	}

	@Patch(
		':id',
	)
	async updateProduct(
		@Param('id') id: string,
		@Body() data: ProductDTO
	) {
		const res = await this.updateProductUseCase.execute({ id, data })

		return res
	}
}