import React, { useState, useEffect } from 'react';
import { ref, update, get } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { auth, database, storage } from '../Firebase'; // Adjust import path as necessary

const ProfileChange = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        photoFile: null,
        photoUrl: '',
    });
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userRef = ref(database, `users/${user.uid}`);
                    const userSnapshot = await get(userRef);
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        setFormData({
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            photoUrl: userData.photoUrl || '', // Handle case where photoUrl might be undefined
                        });
                        setInitialDataLoaded(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setFormData({
                ...formData,
                photoFile: e.target.files[0],
            });
        }
    };

    const handlePhotoUpload = async () => {
        if (formData.photoFile) {
            const storageRef = storage.ref(`users/${auth.currentUser.uid}/profile.jpg`);
            try {
                await uploadBytes(storageRef, formData.photoFile);
                const downloadURL = await getDownloadURL(storageRef);
                setFormData({
                    ...formData,
                    photoUrl: downloadURL,
                });
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        try {
            await update(userRef, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                photoUrl: formData.photoUrl,
            });
            console.log('Profile updated successfully!');
            // Optionally, redirect or show a success message
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!initialDataLoaded) {
        return <p>Loading User data...</p>;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        Profile Photo
                    </label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="mt-1 text-gray-900 bg-gray-200 border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {formData.photoUrl && (
                        <img
                            src={formData.photoUrl}
                            alt="Profile"
                            className="w-20 h-20 mt-2 rounded-full object-cover"
                        />
                    )}
                </div>
                <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md mr-2"
                >
                    Upload Photo
                </button>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfileChange;
