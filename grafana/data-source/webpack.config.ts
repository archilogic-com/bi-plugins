import path from 'path';
import type { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import grafanaConfig from './.config/webpack/webpack.config'

const config = async (env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env)

  return merge(baseConfig, {
    resolve: {
      alias: {
        '@bi-plugin-utils': path.resolve(__dirname, '../../utils/index.ts'),
        '@grafana-common': path.resolve(__dirname, '../common/index.ts')
      },
    },
  })
}

export default config
