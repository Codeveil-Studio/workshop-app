import React from "react";

export default function ActivityDetails({ activity, setActivity }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-green-600 mb-3">Activity Details</h3>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <select 
          value={activity.type} 
          onChange={(e) => setActivity((a) => ({ ...a, type: e.target.value }))} 
          className="border p-2 rounded col-span-1"
        >
          <option>Inspection</option>
          <option>Repair</option>
          <option>Maintenance</option>
        </select>

        <input className="border p-2 rounded col-span-2" placeholder="Short quote" />
        <textarea 
          className="border p-2 rounded col-span-3" 
          placeholder="Activity description" 
          value={activity.description} 
          onChange={(e) => setActivity((a) => ({ ...a, description: e.target.value }))} 
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.engineCheck} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, engineCheck: e.target.checked } }))} 
          /> 
          Engine checkup
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.ecuTesting} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, ecuTesting: e.target.checked } }))} 
          /> 
          ECU testing
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.acService} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, acService: e.target.checked } }))} 
          /> 
          A/C service
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.brake} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, brake: e.target.checked } }))} 
          /> 
          Brake
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.oilChange} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, oilChange: e.target.checked } }))} 
          /> 
          Oil change
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={activity.repairs.other} 
            onChange={(e) => setActivity((a) => ({ ...a, repairs: { ...a.repairs, other: e.target.checked } }))} 
          /> 
          Other
        </label>
      </div>
    </div>
  );
}
