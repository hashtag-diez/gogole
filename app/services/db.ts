import { MikroORM, SqliteDriver } from '@mikro-orm/sqlite';
import config from '../../mikro-orm.config.js';


export const db = await MikroORM.init<SqliteDriver>(config)