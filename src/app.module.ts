import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriesModule } from '@categories/categories.module';
import { ProductsModule } from '@products/products.module';

@Module({
	imports: [
		CategoriesModule,
		ProductsModule,
	],
	controllers: [AppController],
})
export class AppModule { }
