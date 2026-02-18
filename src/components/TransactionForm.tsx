import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Transaction, TransactionType } from '../types'

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void
}

const CATEGORIES = {
  income: ['給与', '副業', 'その他収入'],
  expense: ['食費', '交通費', '住居費', '光熱費', '娯楽', 'その他支出']
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('expense')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES.expense[0])

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory(CATEGORIES[newType][0])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!description || !amount || parseFloat(amount) <= 0) {
      alert('すべての項目を正しく入力してください')
      return
    }

    onAdd({
      date,
      description,
      amount: parseFloat(amount),
      category,
      type
    })

    // フォームをリセット
    setDescription('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>取引を追加</h2>
      
      <div className="form-group type-selector">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : 'expense'}
          onClick={() => handleTypeChange('expense')}
        >
          支出
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : 'income'}
          onClick={() => handleTypeChange('income')}
        >
          収入
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="date">日付</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">説明</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: スーパーで買い物"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">金額</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          min="0"
          step="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">カテゴリー</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES[type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-btn">追加</button>
    </form>
  )
}
