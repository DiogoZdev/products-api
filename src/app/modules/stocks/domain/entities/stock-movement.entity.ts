import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export enum StockMovementTypeEnum {
	ENTRY = 'ENTRY',
	EXIT = 'EXIT',
}

export interface ISotckMovement {
	id?: string;
	productId: string;
	type: StockMovementTypeEnum;
	quantity: number;
	date?: Date | string;
	description: string;
}

export class StockMovementDTO implements ISotckMovement {
	@ApiProperty()
	@IsDefined()
	@IsString()
	productId: string;

	@ApiProperty()
	@IsDefined()
	@IsString()
	type: StockMovementTypeEnum;

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
	@IsString()
	description: string;
}
