import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export interface ICategory {
	id?: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export class CategoryDTO implements ICategory {
	@ApiProperty()
	@IsDefined()
	@IsString()
	name: string;
}
