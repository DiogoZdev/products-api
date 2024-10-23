import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CategoriesModule } from '@categories/categories.module';
import { ProductsModule } from '@products/products.module';
import { StocksModule } from '@stocks/stocks.module';

@Module({
	imports: [CategoriesModule, ProductsModule, StocksModule],
	controllers: [AppController],
})
export class AppModule {}
