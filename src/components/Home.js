import React from 'react';
import ContactForm from './ContactForm'; // Adjust the path as necessary
// import GalleryComponent from './GalleryComponent'; // Uncomment this line if GalleryComponent is implemented

const Home = () => {
    return (
        <div className="bg-white mx-auto max-w-screen-lg rounded-lg shadow-lg p-6 md:p-8 mb-8 mt-0">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Sijgeria Umesh Chandra Smriti Sangha!</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We're delighted to have you here. Our club is a community of passionate individuals who come together to share interests, ideas, and experiences. Whether you're a long-time member or a new friend, we believe in creating a welcoming and inclusive environment where everyone can thrive.
            </p>
            <ContactForm />
            {/* Uncomment and adjust GalleryComponent if implemented */}
            {/* <div className="mt-8">
                <GalleryComponent />
            </div> */}
        </div>
    );
};

export default Home;
