import profilePic from '../../assets/images/profile.jpg'

function AdminNavbar() {
  return (
    <div className="bg-white px-8 py-2 w-full">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Admin</span>
          <img src={profilePic} alt="Admin Profile" className="w-8 h-8 rounded-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar