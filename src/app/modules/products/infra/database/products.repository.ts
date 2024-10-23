import { HttpException } from '@nestjs/common';
import { IProduct } from '@products/domain/entities/product.entity';
import { IList } from '@shared/interfaces/list.interface';

export abstract class ProductsRepository {
	abstract createProduct(input: IProduct): Promise<IProduct>;

	abstract getProducts(input: {
		page?: number;
		take?: number;
	}): Promise<IList<IProduct>>;

	abstract getProductById(id: string): Promise<IProduct>;

	abstract updateProductById(input: {
		id: string;
		data: IProduct;
	}): Promise<IProduct>;

	abstract deleteProductById(id: string): Promise<string>;
}
