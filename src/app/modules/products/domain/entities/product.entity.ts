import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNumber, Length } from 'class-validator';

export interface IProduct {
	id?: string;
	name: string;
	price: number;
	quantity: number;
	categories: string[];
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export class ProductDTO implements IProduct {
	@ApiProperty()
	@IsDefined()
	@IsString()
	name: string;

	@ApiProperty()
	@IsDefined()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	price: number;

	@ApiProperty()
	@IsDefined()
	@IsNumber({
		maxDecimalPlaces: 0,
		allowInfinity: false,
		allowNaN: false,
	})
	quantity: number;

	@ApiProperty()
	@IsDefined()
	@IsString({ each: true })
	@Length(1, 255, { each: true })
	categories: string[];
}
