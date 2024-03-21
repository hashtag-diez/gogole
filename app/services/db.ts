import { MikroORM, SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import app from '@adonisjs/core/services/app'

export const db = await MikroORM.init<SqliteDriver>({
  entities: [app.makePath('app/models')], // path to your JS entities (dist), relative to `baseDir`
  dbName: app.makePath('tmp/db.sqlite3'),
  metadataProvider: TsMorphMetadataProvider,
  allowGlobalContext: true,
  pool: {
    afterCreate: (conn: any, done: any) => {
      conn.loadExtension(app.makePath('app/services/sqlean-macos-arm64/regexp.dylib'));
      done(null, conn);
    },
  },
})