import { defineConfig } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations'

const config = defineConfig({
  entities: ['./app/models'], 
  dbName: './tmp/db.sqlite3',
  metadataProvider: TsMorphMetadataProvider,
  allowGlobalContext: true,
  extensions: [Migrator],
  pool: {
    afterCreate: (conn: any, done: any) => {
      conn.loadExtension('./app/services/sqlean-macos-arm64/regexp.dylib');
      done(null, conn);
    },
  },
})

export default config;