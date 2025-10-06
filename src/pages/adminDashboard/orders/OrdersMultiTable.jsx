import React, { useEffect, useMemo, useState } from 'react'
import OrdersTable from './OrdersTable'

const DEFAULT_ORDER = ['Requested', 'In Process', 'Completed', 'Pending']

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

export default function OrdersMultiTable({ orders: initialOrders, onEdit, selectedCategory }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState(initialOrders || [])
  const categories = DEFAULT_ORDER

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const base = (API_URL || '').replace(/\/+$/, '')
    const endpoint = /\/api\/?$/.test(base) ? `${base}/work-orders` : `${base}/api/work-orders`

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(endpoint)
        const ct = res.headers.get('content-type') || ''
        const isJson = ct.includes('application/json')
        const data = isJson ? await res.json() : null
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || res.statusText)
        }
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const orderedCategories = useMemo(() => {
    if (!selectedCategory) return categories
    return [selectedCategory, ...categories.filter(c => c !== selectedCategory)]
  }, [categories, selectedCategory])

  return (
    <div className="space-y-6">
      {loading && (
        <div className="p-4 text-sm text-gray-600">Loading work orders…</div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-600">Failed to load: {error}</div>
      )}
      {!loading && !error && orderedCategories.map((cat) => {
        const catOrders = orders.filter(o => o.status === cat)
        return (
          <div key={cat} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-md sm:text-lg font-semibold text-black">{cat}</h3>
            </div>
            <div className="overflow-x-auto">
              {catOrders.length > 0 ? (
                <OrdersTable orders={catOrders} onEdit={onEdit} />
              ) : (
                <div className="px-4 py-6 text-sm text-gray-500">{`No ${cat} Work Orders`}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}