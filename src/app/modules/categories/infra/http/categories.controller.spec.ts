describe('CategoriesController', () => {});
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '@categories/infra/http/categories.controller';
import { CreateCategoryUseCase } from '@categories/domain/use-cases/create-category.use-case';
import { GetCategoriesUseCase } from '@categories/domain/use-cases/get-categories.use-case';
import { Response } from 'express';

describe('CategoriesController', () => {
	let controller: CategoriesController;
	let res: Response;
	let createCategoryUseCase: CreateCategoryUseCase;
	let getCategoriesUseCase: GetCategoriesUseCase;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [
				{
					provide: CreateCategoryUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
				{
					provide: GetCategoriesUseCase,
					useValue: {
						execute: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<CategoriesController>(CategoriesController);
		createCategoryUseCase = module.get<CreateCategoryUseCase>(
			CreateCategoryUseCase,
		);
		getCategoriesUseCase =
			module.get<GetCategoriesUseCase>(GetCategoriesUseCase);
		res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
	});

	it('create category', async () => {
		const useCaseSpy = jest
			.spyOn(createCategoryUseCase, 'execute')
			.mockResolvedValue({ id: '1', name: 'Category 1' });

		const response = await controller.createCategory(
			{ name: 'Category 1' },
			res,
		);

		expect(response).toHaveProperty('id');
		expect(useCaseSpy).toHaveBeenCalledWith({ name: 'Category 1' });
	});

	it('handle errors on create category', async () => {
		const expectedError = {
			status: 409,
			message: 'Category already exists',
		};

		jest
			.spyOn(createCategoryUseCase, 'execute')
			.mockRejectedValue(expectedError);

		const response = await controller.createCategory(
			{ name: 'Category 1' },
			res,
		);

		expect(response).toBe(undefined);
		expect(res.status).toHaveBeenCalledWith(expectedError.status);
	});

	it('get categories', async () => {
		const expectedCategories = [
			{ id: '1', name: 'Category 1' },
			{ id: '2', name: 'Category 2' },
		];

		jest.spyOn(getCategoriesUseCase, 'execute').mockResolvedValue({
			data: expectedCategories,
			meta: {
				total: 2,
				page: 1,
				take: 10,
				previousPage: '?page=1&take=10',
				nextPage: '?page=2&take=10',
			},
		});

		const response = await controller.getCategories({}, res);

		expect(res.status).not.toHaveBeenCalled();
		expect(response).toHaveProperty('data');
		expect(response).toHaveProperty('meta');
		expect(response).toHaveProperty('meta.total');
		expect(response).toHaveProperty('meta.page');
		expect(response).toHaveProperty('meta.take');
		expect(response).toHaveProperty('meta.previousPage');
		expect(response).toHaveProperty('meta.nextPage');
	});

	it('handle errors on get categories', async () => {
		const expectedError = {
			status: 500,
			message: 'Internal server error',
		};

		jest
			.spyOn(getCategoriesUseCase, 'execute')
			.mockRejectedValue(expectedError);

		const response = await controller.getCategories({}, res);

		expect(response).toBe(undefined);
		expect(res.status).toHaveBeenCalledWith(expectedError.status);
	});
});
