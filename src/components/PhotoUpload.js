import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import ClipLoader from 'react-spinners/ClipLoader';

const PhotoUpload = ({ memberId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setUploading(true);

        try {
            const storage = getStorage(); // Initialize Firebase Storage
            const fileRef = ref(storage, `images/${uuidv4()}`); // Unique file path

            // Upload file to Firebase Storage
            await uploadBytes(fileRef, selectedFile);

            alert('File uploaded successfully!');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload Photo</h2>
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded-md block w-full focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {uploading ? (
                    <ClipLoader color="#ffffff" loading={uploading} size={20} />
                ) : (
                    'Upload'
                )}
            </button>
        </div>
    );
};

export default PhotoUpload;
