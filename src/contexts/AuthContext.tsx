import { createContext, useContext, useState, useEffect } from 'react'
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
    login: () => void
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

    const login = () => {
        // GitHub OAuth認証のリダイレクトURL
        // 実際の実装では、GitHub OAuthアプリケーションを作成し、
        // Client IDとClient Secretを使用する必要があります
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID

        if (!clientId) {
            // デモ用のモックユーザー
            const mockUser: User = {
                id: '1',
                login: 'demo-user',
                name: 'デモユーザー',
                avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
            }
            setUser(mockUser)
            localStorage.setItem('github_user', JSON.stringify(mockUser))
        } else {
            // 実際のGitHub OAuth認証
            const redirectUri = `${window.location.origin}/callback`
            const scope = 'read:user'
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('github_user')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
