import React from 'react';

/**
 * Reusable component for displaying repair types from repairs_json
 * @param {Array|null} repairTypes - Array of repair type objects or null
 * @param {string} className - Additional CSS classes for styling
 * @param {string} emptyMessage - Message to display when no repair types
 */
export default function RepairTypesList({ 
  repairTypes, 
  className = '', 
  emptyMessage = 'No repair types selected' 
}) {
  // Handle null, undefined, or empty arrays
  if (!repairTypes || (Array.isArray(repairTypes) && repairTypes.length === 0)) {
    return <span className={`text-gray-500 ${className}`}>{emptyMessage}</span>;
  }

  // Handle non-array values
  if (!Array.isArray(repairTypes)) {
    return <span className={`text-gray-500 ${className}`}>{emptyMessage}</span>;
  }

  const formatPrice = (value) => {
    const num = Number(value);
    if (!isFinite(num) || num <= 0) return null;
    return Number.isInteger(num) ? num.toFixed(0) : num.toFixed(2);
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {repairTypes.map((repair, idx) => (
        <span 
          key={idx} 
          className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
        >
          {(() => {
            // Handle string repairs
            if (typeof repair === 'string') return repair;

            const name = repair?.name || repair?.title || repair?.description || repair?.item_name || 'Item';
            const priceRaw = repair?.price ?? repair?.unit_price ?? repair?.unitPrice ?? null;
            const price = formatPrice(priceRaw);
            return price ? `${name} ($${price})` : name;
          })()}
        </span>
      ))}
    </div>
  );
}