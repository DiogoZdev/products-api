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
	@IsDefined()
	@IsString()
	productId: string;

	@IsDefined()
	@IsString()
	type: StockMovementTypeEnum;

	@IsDefined()
	@IsNumber({
		maxDecimalPlaces: 0,
		allowInfinity: false,
		allowNaN: false,
	})
	quantity: number;

	@IsDefined()
	@IsString()
	description: string;
}
