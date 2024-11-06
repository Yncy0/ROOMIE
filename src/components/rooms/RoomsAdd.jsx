import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import app from "../firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function RoomsAdd() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [close, setClose] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  async function saveData() {
    const firestore = getFirestore(app);
    const storage = getStorage(app);
    let imageUrl = "";

    if (imageFile) {
      try {
        const imageRef = storageRef(storage, `images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
        console.log("Image URL:", imageUrl);
        alert("image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Image upload failed: " + error.message);
        return;
      }
    }

    try {
      await addDoc(collection(firestore, "Rooms"), {
        roomName,
        roomDescription,
        roomCapacity,
        roomLocation,
        imageUrl,
      });
      alert("Data saved successfully");
      navigate("/rooms");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  }

  return (
    <div className="round-box flex flex-col bg-white gap-4 p-4">
      <h1 className="text-center font-bold text-lg">Create New Room</h1>
      <div className="flex justify-center">
        <img
          src={
            imageFile
              ? URL.createObjectURL(imageFile)
              : "src/assets/dummy/image-placeholder.png"
          }
          alt=""
          className="object-cover w-64"
        />
      </div>
      {/* Image Upload Section */}
      <label htmlFor="imageUpload">Upload Image</label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border-2 border-gray-300 p-2 rounded-md"
      />
      <label htmlFor="roomName">Room Name</label>
      <input
        id="roomName"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={roomName}
        type="text"
        placeholder="Enter room name here"
        onChange={(e) => setRoomName(e.target.value)}
      />
      <label htmlFor="roomDescription">Room Description</label>
      <input
        id="roomDescription"
        className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm"
        value={roomDescription}
        type="text"
        placeholder="Enter room description here"
        onChange={(e) => setRoomDescription(e.target.value)}
      />
      <label htmlFor="roomCapacity">Room Capacity</label>
      <input
        id="roomCapacity"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={roomCapacity}
        type="text"
        placeholder="Enter room capacity"
        onChange={(e) => setRoomCapacity(e.target.value)}
      />
      <label htmlFor="roomLocation">Room Location/Building</label>
      <input
        id="roomLocation"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        value={roomLocation}
        type="text"
        placeholder="Enter room location"
        onChange={(e) => setRoomLocation(e.target.value)}
      />
      <div className="flex flex-row justify-center gap-8 w-full">
        <button
          onClick={() => setClose(!close)}
          className="bg-gray-100 w-full text-center p-2 rounded-md"
        >
          Cancel
        </button>
        {close && <Navigate to="/rooms" />}
        <button
          onClick={saveData}
          className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md"
        >
          Create
        </button>
      </div>
    </div>
  );
}
