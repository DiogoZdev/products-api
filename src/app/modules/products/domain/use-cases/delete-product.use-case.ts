import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '@products/infra/database/products.repository';

@Injectable()
export class DeleteProductByIdUseCase {
	constructor(private readonly productsRepository: ProductsRepository) {}

	execute(id: string) {
		return this.productsRepository.deleteProductById(id);
	}
}
