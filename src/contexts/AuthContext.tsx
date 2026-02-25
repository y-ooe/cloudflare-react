import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
    id: string
    login: string
    name: string
    avatar_url: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    startLogin: () => void
    completeLogin: (code: string, state: string | null) => Promise<User>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // ローカルストレージから認証情報を読み込む
        const storedUser = localStorage.getItem('github_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const startLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID

        if (!clientId) {
            throw new Error('VITE_GITHUB_CLIENT_ID is not set')
        }

        const redirectUri = `${window.location.origin}/callback`
        const scope = 'read:user'
        const state = crypto.randomUUID()

        sessionStorage.setItem('github_oauth_state', state)
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`
    }

    const completeLogin = async (code: string, state: string | null) => {
        const storedState = sessionStorage.getItem('github_oauth_state')
        if (!state || state !== storedState) {
            sessionStorage.removeItem('github_oauth_state')
            throw new Error('Invalid OAuth state')
        }

        const response = await fetch('/api/github/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })

        if (!response.ok) {
            throw new Error('OAuth exchange failed')
        }

        const data = await response.json()
        const nextUser: User = data.user
        setUser(nextUser)
        localStorage.setItem('github_user', JSON.stringify(nextUser))
        sessionStorage.removeItem('github_oauth_state')
        return nextUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('github_user')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, startLogin, completeLogin, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
