const API_KEY  = import.meta.env.VITE_ETHERSCAN_API_KEY
const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS.toLowerCase()
const CONTRACT = import.meta.env.VITE_USDT_CONTRACT.toLowerCase()
const REQUIRED = 5 * 1_000_000  // 5 USDT — 6 decimals

export type VerifyResult = { ok: true } | { ok: false; reason: string }

export async function verifyUsdtPayment(txHash: string): Promise<VerifyResult> {
  if (!txHash.match(/^0x[0-9a-fA-F]{64}$/)) {
    return { ok: false, reason: 'Invalid transaction hash format.' }
  }

  try {
    const url =
      `https://api.etherscan.io/api?module=account&action=tokentx` +
      `&contractaddress=${CONTRACT}&address=${RECEIVER}` +
      `&page=1&offset=200&sort=desc&apikey=${API_KEY}`

    const res  = await fetch(url)
    const json = await res.json()

    if (json.status !== '1' || !Array.isArray(json.result)) {
      return { ok: false, reason: 'Etherscan returned no data. Try again shortly.' }
    }

    const tx = (json.result as Record<string, string>[]).find(
      t => t.hash.toLowerCase() === txHash.toLowerCase()
    )

    if (!tx) {
      return { ok: false, reason: 'Transaction not found. Confirm the hash and that it is on Ethereum mainnet.' }
    }
    if (tx.to.toLowerCase() !== RECEIVER) {
      return { ok: false, reason: 'That transaction was not sent to the correct wallet.' }
    }
    if (parseInt(tx.value) < REQUIRED) {
      const sent = (parseInt(tx.value) / 1_000_000).toFixed(2)
      return { ok: false, reason: `Amount too low — you sent ${sent} USDT, minimum is 5 USDT.` }
    }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'Network error contacting Etherscan. Please try again.' }
  }
}
