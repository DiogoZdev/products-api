import { CategoriesRepository } from '@categories/infra/database/categories.repository';
import { CreateCategoryUseCase } from './create-category.use-case';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@shared/services/prisma.service';

describe('CreateCategoryUseCase', () => {
	let sut: CreateCategoryUseCase;
	let categoriesRepository: CategoriesRepository;

	const mockInput = {
		id: '123QWERTY',
		name: 'any_name',
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				CreateCategoryUseCase,
				{
					provide: CategoriesRepository,
					useValue: {
						createCategory: jest.fn().mockResolvedValue(mockInput),
					},
				},
			],
		}).compile();

		sut = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
		categoriesRepository =
			module.get<CategoriesRepository>(CategoriesRepository);
	});

	test('get categories', async () => {
		const repositorySpy = jest.spyOn(categoriesRepository, 'createCategory');

		const response = await sut.execute(mockInput);

		expect(repositorySpy).toHaveBeenCalledWith(mockInput);
		expect(repositorySpy).toHaveBeenCalledTimes(1);
		expect(response).toHaveProperty('id');
	});
});
