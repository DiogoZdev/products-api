import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { CategoriesRepository } from '@categories/infra/database/categories.repository';
import { PrismaCategoriesRepository } from '@categories/infra/database/prisma-categories.repository';
import { CategoriesController } from '@categories/infra/http/categories.controller';
import { CreateCategoryUseCase } from '@categories/domain/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '@categories/domain/use-cases/get-categories.use-case';

@Module({
	imports: [],
	controllers: [CategoriesController],
	providers: [
		PrismaService,
		CreateCategoryUseCase,
		GetCategoriesUseCase,
		{
			provide: CategoriesRepository,
			useClass: PrismaCategoriesRepository,
		},
	],
})
export class CategoriesModule {}
