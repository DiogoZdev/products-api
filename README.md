# products-api

## Prerequisites

- Node (v18 or above)
- Docker


## Clone the Project
```
git clone https://github.com/DiogoZdev/products-api
```

## Define environment variables
Rename the file `.env.example` to `.env`.

## Install dependencies
```
npm install
```

## Testing the Project
Note that the project is currenlty not fully covered by tests, but there are examples.
```
npm run test
```

## Execute the Project
```
npm run compose:up
```
- the database will be provided
- the migrations will be applied
- the project models will be made available
- the application will run locally


### Access the project
- Open it `http://localhost:3000`
- Read the docs `http://localhost:3000/api`
- Check the execution `http://localhost:3000/health`


## Stop the project
```
npm run compose:down
```

## Future improvements
- [ ] Create mappers to adjust responses
- [ ] Adopt complete RESTful responses
- [ ] Complete project Test


## Made with

- Ubuntu 24.04
- VSCodium
- Beekeeper Studio (database viewer)
- ApiDog (endpoint design and test)
- Docker
- NestJS
- Jest
- Swagger
- TypeScript
- Prisma
- Postgres


## Stay in touch

- LinkedIn - [Diogo Lara](https://linkedin.com/in/diogo-lara)
