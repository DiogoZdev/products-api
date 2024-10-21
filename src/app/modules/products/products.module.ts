import { Module } from "@nestjs/common";
import { PrismaService } from "@shared/services/prisma.service";
import { ProductsRepository } from "@products/infra/database/products.repository";
import { PrismaProductsRepository } from "@products/infra/database/prisma-products.repository";
import { GetProductByIdUseCase } from "@products/domain/use-cases/get_product-by-id.use-case";
import { CreateProductUseCase } from "@products/domain/use-cases/create-product.use-case";
import { ProductsController } from "@products/infra/http/products.controller";
import { GetProductsUseCase } from "@products/domain/use-cases/get-products.use-case";
import { DeleteProductByIdUseCase } from "@products/domain/use-cases/delete-product.use-case";
import { UpdateProductUseCase } from "@products/domain/use-cases/update-product.use-case";

@Module({
	imports: [],
	controllers: [ProductsController],
	providers: [
		PrismaService,
		GetProductsUseCase,
		GetProductByIdUseCase,
		CreateProductUseCase,
		DeleteProductByIdUseCase,
		UpdateProductUseCase,
		{
			provide: ProductsRepository,
			useClass: PrismaProductsRepository
		},
	],
})
export class ProductsModule { }