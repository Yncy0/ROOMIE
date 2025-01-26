import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoomsDescription() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    id,
    room_image,
    room_name,
    room_location,
    room_capacity,
    room_type,
    building_id,
  } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    room_name,
    room_location,
    room_capacity,
    room_type,
    room_image,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, room_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update logic here
    console.log("Form data:", formData);
    // Close modal after saving data
    closeModal();
  };

  const handleDeleteConfirm = () => {
    // Perform delete action here
    console.log(`Room with ID: ${id} deleted`);
    navigate("/archives"); // Navigate to the Archives page
  };

  return (
    <div className="my-5">
      {/* Back to Rooms Button*/}
      <button
        onClick={() => navigate("/rooms")}
        className="-mt-2 ml-4 bg-transparent text-gray-500 
        hover:text-red-500 py-2 px-4 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Rooms
      </button>

      {/*Room Description Contents*/}
      <div className="bg-white p-8 rounded-[40px] shadow-lg w-[95%] mx-auto mt-4">
      <h3 style={{
        textAlign: 'center', 
        fontSize: '1.125rem',  // equivalent to text-lg
        fontWeight: '600',     // equivalent to font-semibold
        color: '#2d3748',       // equivalent to text-gray-800\
        marginBottom:'15px',
      }}>
        Room Description
      </h3>

        {/*Room Image*/}
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={room_image}
            alt="image of room"
            className="w-full md:w-1/2 h-[360px] object-cover rounded-[40px] mb-6 md:mb-0"
          />

          {/*Room Details*/}
          <div className="md:ml-6 text-left w-full md:w-1/2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Room Name:</h3>
              <h2 className="text-xl text-gray-500">{room_name}</h2>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Location:</h3>
              <p className="text-xl text-gray-500">{room_location}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Seat Capacity:</h3>
              <p className="text-xl text-gray-500">{room_capacity}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Room Type:</h3>
              <p className="text-xl text-gray-500">{room_type}</p>
            </div>

            {/*Edit and Delete Buttons*/}
            <button
              onClick={openModal}
              className="mt-4 bg-[#8aa9ff] text-white py-2 px-4 rounded-md"
            >
              Edit Room Information
            </button>

            <button
                onClick={openDeleteModal}
                className="bg-red-500 text-white py-2 px-4 rounded-md ml-4"
              >
                Delete Room
              </button>
          </div>
        </div>
      </div>

      {/*Edit Room Info Modal*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-[#1f2947]">
            <h2 className="text-xl font-semibold text-[#1f2947] mb-4">Edit Room Information</h2>
            <form onSubmit={handleSubmit}>
              {/*Change Room Image*/}
              <label className="block mb-2 text-[#1f2947]">
                Change Room Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full border border-[#1f2947] rounded-md py-2 px-4 text-[#1f2947]"
                />

              </label>
              {/*Room Name*/}
              <label className="block mb-2 text-[#1f2947]">
                Room Name:
                <input
                  type="text"
                  name="room_name"
                  className="mt-1 block w-full border border-[#1f2947] rounded-md py-2 px-4 text-[#1f2947] shadow-sm"
                  value={formData.room_name}
                onChange={handleInputChange}
                />
              </label>

              {/*Location*/}
              <label className="block mb-2 text-[#1f2947]">
                Location:
                <input
                  type="text"
                  name="room_location"
                  className="mt-1 block w-full border border-[#1f2947] rounded-md py-2 px-4 text-[#1f2947] shadow-sm"
                  value={formData.room_location}
                  onChange={handleInputChange}
                />
              </label>

              {/*Seat Capacity*/}
              <label className="block mb-2 text-[#1f2947]">
                Seat Capacity:
                <input
                  type="number"
                  name="room_capacity"
                  className="mt-1 block w-full border border-[#1f2947] rounded-md py-2 px-4 text-[#1f2947] shadow-sm"
                  value={formData.room_capacity}
                  onChange={handleInputChange}
                />
              </label>

              {/*Room Type*/}
              <label className="block mb-2 text-[#1f2947]">
                Room Type:
                <input
                  type="text"
                  name="room_type"
                  className="mt-1 block w-full border border-[#1f2947] rounded-md py-2 px-4 
                  text-[#1f2947] shadow-sm"
                  value={formData.room_type}
                  onChange={handleInputChange}
                />
              </label>

              {/*Buttons*/}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md border border-[#1f2947]"
                >
                  Cancel
                </button>
            
                <button
                  type="submit"
                  className="bg-[#1f2947] text-white py-2 px-4 rounded-md border border-[#1f2947] 
                hover:bg-[#172331]"
                > 
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this room?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
