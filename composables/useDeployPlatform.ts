export function useDeployPlatform() {
  const config = useRuntimeConfig()
  const platform = config.public.deployPlatform as 'vercel' | 'netlify' | 'cloudflare' | 'self-host'

  return {
    platform,
    isVercel: platform === 'vercel',
    isNetlify: platform === 'netlify',
    isCloudflare: platform === 'cloudflare',
    isSelfHost: platform === 'self-host',
    isDev: import.meta.dev
  }
}