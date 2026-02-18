import { useState } from 'react'
import './App.css'
import type { Transaction } from './types'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Summary from './components/Summary'

function App() {
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
    <div className="app">
      <h1>💰 家計簿アプリ</h1>
      <Summary transactions={transactions} />
      <TransactionForm onAdd={addTransaction} />
      <TransactionList 
        transactions={transactions} 
        onDelete={deleteTransaction} 
      />
    </div>
  )
}

export default App
