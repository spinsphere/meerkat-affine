import { join } from 'node:path';

import { ApolloDriverConfig } from '@nestjs/apollo';

import { defineModuleConfig } from '../config';

declare global {
  interface NewAppConfig {
    graphql: {
      apolloDriverConfig: ConfigItem<ApolloDriverConfig>;
    };
  }
}

defineModuleConfig('graphql', {
  apolloDriverConfig: {
    desc: 'The config for underlying nestjs GraphQL and apollo driver engine.',
    default: {
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      useGlobalPrefix: true,
      playground: true,
      introspection: true,
      sortSchema: true,
      autoSchemaFile: join(
        env.projectRoot,
        env.testing ? './node_modules/.cache/schema.gql' : './schema.gql'
      ),
    },
  },
});
