import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '@products/infra/database/products.repository';
import { IProduct } from '../entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
	constructor(private readonly productsRepository: ProductsRepository) {}

	async execute({ id, data }: { id: string; data: IProduct }) {
		const res = await this.productsRepository.updateProductById({ id, data });

		return res;
	}
}
