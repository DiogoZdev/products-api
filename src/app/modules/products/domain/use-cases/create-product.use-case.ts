import { IProduct } from '@products/domain/entities/product.entity';
import { ProductsRepository } from '@products/infra/database/products.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateProductUseCase {
	constructor(private readonly productsRepository: ProductsRepository) {}

	async execute(input: IProduct) {
		const response = await this.productsRepository.createProduct(input);

		return response;
	}
}
