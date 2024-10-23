import { CategoryDTO } from './category.entity';

describe('CategoryDTO', () => {
	it('create category', () => {
		const category: CategoryDTO = {
			name: 'Example Category',
		};

		expect(category.name).toBe('Example Category');
	});
});
