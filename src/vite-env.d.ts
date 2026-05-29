/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_ETHERSCAN_API_KEY: string
  readonly VITE_RECEIVER_ADDRESS: string
  readonly VITE_USDT_CONTRACT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
