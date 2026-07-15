export type DeployPlatform = 'vercel' | 'netlify' | 'cloudflare' | 'self-host'

export function getDeployPlatform(): DeployPlatform {
  const env = process.env

  // 优先自定义变量（用于自建手动指定）
  if (env.DEPLOY_PLATFORM) {
    return env.DEPLOY_PLATFORM as DeployPlatform
  }

  if (env.VERCEL) return 'vercel'
  if (env.NETLIFY) return 'netlify'
  if (env.CF_PAGES) return 'cloudflare'

  return 'self-host'
}

export const isVercel = () => getDeployPlatform() === 'vercel'
export const isNetlify = () => getDeployPlatform() === 'netlify'
export const isCloudflare = () => getDeployPlatform() === 'cloudflare'
export const isSelfHost = () => getDeployPlatform() === 'self-host'