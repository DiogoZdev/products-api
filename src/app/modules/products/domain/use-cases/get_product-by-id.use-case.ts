import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "@products/infra/database/products.repository";

@Injectable()
export class GetProductByIdUseCase {
	constructor(
		private readonly productsRepository: ProductsRepository
	) { }

	async execute(id: string) {
		const product = await this.productsRepository.getProductById(id)
		return product
	}
}