import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Transaction } from '../types'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import Summary from '../components/Summary'
import './Home.css'

export default function Home() {
    const { user, logout } = useAuth()
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
        }
        setTransactions([newTransaction, ...transactions])
    }

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id))
    }

    return (
        <div className="home-container">
            <header className="app-header">
                <h1>💰 家計簿アプリ</h1>
                <div className="user-section">
                    <div className="user-info">
                        <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="user-avatar"
                        />
                        <span className="user-name">{user?.name || user?.login}</span>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        ログアウト
                    </button>
                </div>
            </header>

            <div className="app">
                <Summary transactions={transactions} />
                <TransactionForm onAdd={addTransaction} />
                <TransactionList
                    transactions={transactions}
                    onDelete={deleteTransaction}
                />
            </div>
        </div>
    )
}
