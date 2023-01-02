// require("dotenv").config({ path: "./env/.env" })
import {DataSource} from 'typeorm'

// host chạy local thì là localhost
// chay container thi la ten cua service container
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: "123",
  database: "test_db_shop_online",
  synchronize : true,
  logging : false,
  entities: ['src/module/**/*.entity.ts'],
//   migrations: ['src/migration/*.ts'],
})

export default dataSource
