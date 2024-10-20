import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriesModule } from '@categories/categories.module';

@Module({
	imports: [CategoriesModule],
	controllers: [AppController],
})
export class AppModule { }
