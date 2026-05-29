import { useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { verifyUsdtPayment } from '../lib/etherscan'
import { CopyButton } from '../components/CopyButton'

const RECEIVER = import.meta.env.VITE_RECEIVER_ADDRESS

type Props = {
  user: User
  trialDaysLeft: number
  onAccessGranted: () => void
  signOut: () => void
}

export function PaymentPage({ user, trialDaysLeft, onAccessGranted, signOut }: Props) {
  const [txHash,   setTxHash]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [verified, setVerified] = useState(false)

  const verify = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await verifyUsdtPayment(txHash.trim())

    if (!result.ok) {
      setError(result.reason)
      setLoading(false)
      return
    }

    // Mark paid in Supabase
    const { error: dbErr } = await supabase
      .from('user_profiles')
      .update({ paid: true, payment_tx: txHash.trim(), payment_verified_at: new Date().toISOString() })
      .eq('id', user.id)

    if (dbErr) {
      setError('Payment verified but failed to save. Contact support.')
      setLoading(false)
      return
    }

    setVerified(true)
    setLoading(false)
    setTimeout(onAccessGranted, 1800)
  }

  const trialExpired = trialDaysLeft === 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">📚</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">API Dictionary</h1>
          {!trialExpired ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in free trial
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium">
              ⏰ Free trial expired
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 space-y-6">

          {verified ? (
            <div className="text-center py-6 space-y-3">
              <div className="text-5xl">✅</div>
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Payment Verified!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unlocking full access…</p>
            </div>
          ) : (
            <>
              {/* Pricing */}
              <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">One-time payment</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">5 <span className="text-blue-600 dark:text-blue-400">USDT</span></p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Lifetime access · ERC-20 on Ethereum</p>
              </div>

              {/* Wallet */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Send exactly <span className="text-blue-600 dark:text-blue-400">5 USDT</span> to:
                </p>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                  <code className="flex-1 text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                    {RECEIVER}
                  </code>
                  <CopyButton getText={() => RECEIVER} label="Copy" className="shrink-0" />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  ⚠️ ERC-20 USDT on Ethereum mainnet only. Other networks will not be detected.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {[
                  'Send 5 USDT (ERC-20) to the address above',
                  'Wait for the transaction to confirm (~1 min)',
                  'Paste the transaction hash below and click Verify',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>

              {/* Verify form */}
              <form onSubmit={verify} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction Hash
                  </label>
                  <input
                    type="text"
                    required
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
                >
                  {loading ? 'Verifying on Etherscan…' : 'Verify Payment'}
                </button>
              </form>
            </>
          )}

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
            <span>{user.email}</span>
            <button onClick={signOut} className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
