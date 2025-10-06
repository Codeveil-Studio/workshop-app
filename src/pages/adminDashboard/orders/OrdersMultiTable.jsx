import React, { useEffect, useMemo, useState, useCallback } from 'react'
import OrdersTable from './OrdersTable'
import OrderEditor from './OrderEditor'

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
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsData, setDetailsData] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, order: null })
  const closeConfirm = () => setConfirmModal({ open: false, type: null, order: null })
  const categories = DEFAULT_ORDER

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const base = (API_URL || '').replace(/\/+$/, '')
  const listEndpoint = /\/api\/?$/.test(base) ? `${base}/work-orders` : `${base}/api/work-orders`

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(listEndpoint)
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
  }, [listEndpoint])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const detailsEndpoint = (id) => (/\/api\/?$/.test(base) ? `${base}/work-orders/${id}` : `${base}/api/work-orders/${id}`)
  const statusEndpoint = (id) => (/\/api\/?$/.test(base) ? `${base}/work-orders/${id}/status` : `${base}/api/work-orders/${id}/status`)
  const deleteEndpoint = (id) => (/\/api\/?$/.test(base) ? `${base}/work-orders/${id}` : `${base}/api/work-orders/${id}`)

  const handleAccept = (order) => {
    setConfirmModal({ open: true, type: 'accept', order })
  }

  const handleDecline = (order) => {
    setConfirmModal({ open: true, type: 'decline', order })
  }

  const performConfirm = async () => {
    const { type, order } = confirmModal
    if (!type || !order) return closeConfirm()
    try {
      if (type === 'accept') {
        const res = await fetch(statusEndpoint(order.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'pending' })
        })
        const data = await res.json()
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to accept')
      } else if (type === 'decline') {
        const res = await fetch(deleteEndpoint(order.id), { method: 'DELETE' })
        const data = await res.json()
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to delete')
      }
      await fetchOrders()
      closeConfirm()
    } catch (e) {
      console.error(e)
      closeConfirm()
      alert('Action failed. Please try again.')
    }
  }

  const handleEdit = async (order) => {
    setDetailsOpen(true)
    setDetailsData(null)
    try {
      const res = await fetch(detailsEndpoint(order.id))
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to load details')
      setDetailsData(data)
    } catch (e) {
      console.error(e)
      alert('Failed to load work order details.')
    }
  }

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
                <OrdersTable
                  orders={catOrders}
                  onEdit={handleEdit}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  showActions={cat === 'Requested'}
                  showStatus={cat !== 'Requested'}
                />
              ) : (
                <div className="px-4 py-6 text-sm text-gray-500">{`No ${cat} Work Orders`}</div>
              )}
            </div>
          </div>
        )
      })}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Work Order Details</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-gray-600 hover:text-black">✕</button>
            </div>
            {!detailsData ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">ID:</span> {detailsData.order?.id}</div>
                    <div><span className="font-semibold">Status:</span> {detailsData.order?.status}</div>
                    <div><span className="font-semibold">Customer:</span> {detailsData.order?.customer}</div>
                    <div><span className="font-semibold">Vehicle:</span> {detailsData.order?.vehicle}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Edit</h4>
                  <OrderEditor order={{
                    id: detailsData.order?.id,
                    title: detailsData.order?.title || '',
                    charges: detailsData.order?.charges || 0,
                    status: detailsData.order?.status || 'Pending'
                  }} onCancel={() => setDetailsOpen(false)} onSave={() => setDetailsOpen(false)} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Items</h4>
                  {Array.isArray(detailsData.items) && detailsData.items.length > 0 ? (
                    <div className="space-y-2">
                      {detailsData.items.map((it, i) => (
                        <div key={i} className="p-2 rounded border border-gray-200 text-sm">
                          {Object.entries(it).map(([k, v]) => (
                            <div key={k}><span className="font-semibold">{k}:</span> {String(v)}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Work Types</h4>
                  {Array.isArray(detailsData.work_types) && detailsData.work_types.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm">
                      {detailsData.work_types.map((wt, i) => (
                        <li key={i}>{wt.type || wt.name || JSON.stringify(wt)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No work types.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Photos</h4>
                  {Array.isArray(detailsData.photos) && detailsData.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {detailsData.photos.map((ph, i) => (
                        <div key={i} className="border rounded overflow-hidden">
                          {ph.url || ph.path ? (
                            <img src={ph.url || ph.path} alt={`Photo ${i+1}`} className="w-full h-32 object-cover" />
                          ) : (
                            <div className="p-2 text-sm">{JSON.stringify(ph)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No photos.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${confirmModal.type === 'accept' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {confirmModal.type === 'accept' ? '✔' : '✕'}
              </div>
              <h3 className="text-lg font-semibold text-black">
                {confirmModal.type === 'accept' ? 'Accept Work Order' : 'Decline Work Order'}
              </h3>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              {confirmModal.type === 'accept'
                ? 'By accepting, this work order will be forwarded to a technician and moved to Pending.'
                : 'Declining will permanently delete this work order and all related records.'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={closeConfirm} className="px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button
                onClick={performConfirm}
                className={`px-4 py-2 rounded-md text-white cursor-pointer ${confirmModal.type === 'accept' ? 'bg-[#29cc6a] hover:bg-[#25b75f]' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {confirmModal.type === 'accept' ? 'Accept' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}