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
	@IsDefined()
	@IsString()
	name: string;

	@IsDefined()
	@IsNumber({
		maxDecimalPlaces: 2,
	})
	price: number;

	@IsDefined()
	@IsNumber({
		maxDecimalPlaces: 0,
		allowInfinity: false,
		allowNaN: false,
	})
	quantity: number;

	@IsDefined()
	@IsString({ each: true })
	@Length(1, 255, { each: true })
	categories: string[];
}
