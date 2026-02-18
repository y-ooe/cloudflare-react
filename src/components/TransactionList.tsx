import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>取引履歴</h2>
        <p className="empty-message">まだ取引がありません</p>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      <h2>取引履歴</h2>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-info">
              <div className="transaction-date">{transaction.date}</div>
              <div className="transaction-details">
                <span className="transaction-description">
                  {transaction.description}
                </span>
                <span className="transaction-category">
                  {transaction.category}
                </span>
              </div>
            </div>
            <div className="transaction-amount-section">
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}
                ¥{transaction.amount.toLocaleString()}
              </span>
              <button
                className="delete-btn"
                onClick={() => onDelete(transaction.id)}
                aria-label="削除"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
