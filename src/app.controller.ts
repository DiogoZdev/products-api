import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
	@Get()
	getHealth(): string {
		return 'Api is running';
	}
}
