import { CategoriesRepository } from '@categories/infra/database/categories.repository';
import { GetCategoriesUseCase } from './get-categories.use-case';
import { Test } from '@nestjs/testing';

describe('GetCategoriesUseCase', () => {
	let sut: GetCategoriesUseCase;
	let categoriesRepository: CategoriesRepository;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				GetCategoriesUseCase,
				{
					provide: CategoriesRepository,
					useValue: {
						getCategories: jest.fn().mockResolvedValue({ data: [], count: 0 }),
					},
				},
			],
		}).compile();

		sut = module.get<GetCategoriesUseCase>(GetCategoriesUseCase);
		categoriesRepository =
			module.get<CategoriesRepository>(CategoriesRepository);
	});

	test('get categories', async () => {
		const repositorySpy = jest.spyOn(categoriesRepository, 'getCategories');

		const response = await sut.execute({ page: 1, take: 10 });

		expect(repositorySpy).toHaveBeenCalledWith({ page: 1, take: 10 });
		expect(repositorySpy).toHaveBeenCalledTimes(1);
		expect(response).toHaveProperty('data');
		expect(response).toHaveProperty('meta');
		expect(response).toHaveProperty('meta.total');
		expect(response).toHaveProperty('meta.page');
		expect(response).toHaveProperty('meta.take');
		expect(response).toHaveProperty('meta.previousPage');
		expect(response).toHaveProperty('meta.nextPage');
		expect(response.meta.page).toBe(1);
		expect(response.meta.take).toBe(10);
	});
});
