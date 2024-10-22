import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/services/prisma.service";
import { CategoriesRepository } from "./categories.repository";
import { ICategory } from "@categories/domain/entities/category.entity";
import { generateId } from "@shared/utils/generate-id.util";
import { IList } from "@shared/interfaces/list.interface";

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
	constructor(private readonly prisma: PrismaService) { }

	async createCategory(input: ICategory): Promise<ICategory> {
		try {
			const exists = await this.prisma.category.findFirst({
				where: {
					name: input.name,
					deletedAt: null
				}
			})

			if (exists) {
				throw new HttpException(`Category "${input.name}" already exists`, HttpStatus.CONFLICT);
			}

			const res = await this.prisma.category.create({
				data: {
					...input,
					id: generateId()
				}
			});

			return res
		}
		catch (e) {
			console.error(e)

			return e
		}
	}

	async getCategories({
		page,
		take,
	}: { page?: number, take?: number }): Promise<IList<ICategory>> {
		try {
			const where = {
				deletedAt: null
			}

			const [data, count] = await Promise.all([
				this.prisma.category.findMany({
					where,
					take: take ?? 10,
					skip: (page - 1) * take
				}),
				this.prisma.category.count({ where })
			])

			return {
				data,
				count,
			}
		}
		catch (e) {
			console.error(e)

			throw new Error("An error occurred getting the categories");
		}
	}
}