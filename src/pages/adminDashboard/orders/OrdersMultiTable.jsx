import React, { useMemo } from 'react'
import OrdersTable from './OrdersTable'

const DEFAULT_ORDER = ['Requested', 'Completed', 'In-Progress', 'Pending']

function FilterIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 5h14l-5 6v4l-4 2v-6L3 5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function OrdersMultiTable({ orders, onEdit, selectedCategory }) {
  // For now, same data in all tables
  const categories = DEFAULT_ORDER

  const orderedCategories = useMemo(() => {
    if (!selectedCategory) return categories
    return [selectedCategory, ...categories.filter(c => c !== selectedCategory)]
  }, [categories, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Render 4 tables in ordered sequence; data same for now */}
      {orderedCategories.map((cat) => (
        <div key={cat} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-md sm:text-lg font-semibold text-black">{cat}</h3>
          </div>
          <div className="overflow-x-auto">
            <OrdersTable orders={orders} onEdit={onEdit} />
          </div>
        </div>
      ))}
    </div>
  )
}