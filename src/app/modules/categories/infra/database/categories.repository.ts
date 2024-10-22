import { IList } from "@shared/interfaces/list.interface";
import { ICategory } from "@categories/domain/entities/category.entity";

export abstract class CategoriesRepository {
	abstract createCategory(input: ICategory): Promise<ICategory>

	abstract getCategories(input: { page?: number, take?: number }): Promise<IList<ICategory>>
}