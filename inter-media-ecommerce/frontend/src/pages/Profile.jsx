import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.addresses?.[0]?.address || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FiEdit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FiSave size={16} />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <FiUser className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiMail className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 py-2">{formData.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FiPhone className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiMapPin className="text-gray-400 mt-2" size={20} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.address || 'No address added'}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
