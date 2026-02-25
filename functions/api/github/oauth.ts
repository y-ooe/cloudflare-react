interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

interface GitHubTokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface GitHubUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
}

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Missing GitHub OAuth env vars', { status: 500 })
  }

  let body: { code?: string }
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  if (!body.code) {
    return new Response('Missing code', { status: 400 })
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: body.code,
    }),
  })

  const tokenData = (await tokenResponse.json()) as GitHubTokenResponse
  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return new Response(tokenData.error_description || 'OAuth token exchange failed', {
      status: 400,
    })
  }

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'cloudflare-react-app',
    },
  })

  if (!userResponse.ok) {
    return new Response('Failed to fetch user', { status: 400 })
  }

  const user = (await userResponse.json()) as GitHubUser

  return new Response(
    JSON.stringify({
      user: {
        id: String(user.id),
        login: user.login,
        name: user.name ?? user.login,
        avatar_url: user.avatar_url,
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  )
}
