function EditIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3043 0.75 14.863 0.75C15.421 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.571 18.275 4.113C18.2917 4.65433 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="CurrentColor" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const map = {
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Completed": "bg-green-100 text-green-800",
    "Pending": "bg-gray-100 text-gray-800",
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}

function OrdersTable({ orders, setOrders, onEdit }) {
  return (
    <div className="bg-white">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="min-w-full">
          <thead>
            <tr className="">
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold">Charges</th>
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold">Updated</th>
              <th className="px-4 lg:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className=" hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 text-sm">{order.id}</td>
                <td className="px-4 lg:px-6 py-4 text-sm">{order.title}</td>
                <td className="px-4 lg:px-6 py-4 text-sm">${order.charges}</td>
                <td className="px-4 lg:px-6 py-4 text-sm">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">{order.updatedAt}</td>
                <td className="px-4 lg:px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(order)}
                    className="text-[#29cc6a] hover:text-[#1fa554]"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3 p-4">
        {orders.map(order => (
          <div key={order.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{order.title}</h3>
                <p className="text-xs text-gray-600">{order.id}</p>
              </div>
              <button
                onClick={() => onEdit(order)}
                className="text-[#29cc6a] hover:text-[#1fa554]"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">${order.charges}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500">{order.updatedAt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersTable