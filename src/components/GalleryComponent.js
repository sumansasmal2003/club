import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const GalleryComponent = () => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const storage = getStorage(); // Initialize Firebase Storage
                const imagesRef = ref(storage, 'images'); // Reference to 'images' node in Firebase Storage

                // List all images under 'images' node
                const imageList = await listAll(imagesRef);

                // Array to hold image download URLs
                const urls = await Promise.all(imageList.items.map(async (imageRef) => {
                    const url = await getDownloadURL(imageRef);
                    return url;
                }));

                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images from Firebase Storage:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div className="container flex-col mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative overflow-hidden group">
                        <img
                            src={url}
                            alt={`Image ${index}`}
                            className="object-cover w-full h-64 sm:h-56 md:h-64 lg:h-72 transform transition-transform duration-300 scale-100 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-lg font-semibold">View Image</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryComponent;
