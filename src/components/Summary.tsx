import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
}

export default function Summary({ transactions }: Props) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expense

  return (
    <div className="summary">
      <div className="summary-item income">
        <div className="summary-label">収入</div>
        <div className="summary-amount">¥{income.toLocaleString()}</div>
      </div>
      <div className="summary-item expense">
        <div className="summary-label">支出</div>
        <div className="summary-amount">¥{expense.toLocaleString()}</div>
      </div>
      <div className={`summary-item balance ${balance >= 0 ? 'positive' : 'negative'}`}>
        <div className="summary-label">残高</div>
        <div className="summary-amount">¥{balance.toLocaleString()}</div>
      </div>
    </div>
  )
}
