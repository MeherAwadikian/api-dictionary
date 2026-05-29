interface Env {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: CORS })

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { email, password } = await ctx.request.json() as { email: string; password: string }

  const resp = await fetch(
    `${ctx.env.VITE_SUPABASE_URL}/auth/v1/signup`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': ctx.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    }
  )

  return new Response(await resp.text(), {
    status: resp.status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}
