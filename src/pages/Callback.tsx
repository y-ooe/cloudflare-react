import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Callback.css'

export default function Callback() {
  const { completeLogin } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      setError('認証コードが見つかりませんでした。')
      return
    }

    completeLogin(code, state)
      .then(() => navigate('/home'))
      .catch((err: Error) => {
        setError(err.message || 'ログインに失敗しました。')
      })
  }, [completeLogin, navigate, searchParams])

  return (
    <div className="callback-container">
      <div className="callback-card">
        <h1>ログイン処理中...</h1>
        {error ? (
          <p className="callback-error">{error}</p>
        ) : (
          <p>GitHubから認証情報を取得しています。</p>
        )}
      </div>
    </div>
  )
}
