// SimpleEvents.js

import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary

const SimpleEvents = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Validate form inputs
            if (!eventName || !eventDate || !eventTime || !eventDescription) {
                setError('Please fill in all fields.');
                return;
            }

            // Reference to the 'simple_events' node in Firebase Realtime Database
            const eventsRef = ref(database, 'simple_events');

            // Push new event data to Firebase under 'simple_events' node
            await push(eventsRef, {
                eventName,
                eventDate,
                eventTime,
                eventDescription
            });

            // Reset the form after successful submission
            setEventName('');
            setEventDate('');
            setEventTime('');
            setEventDescription('');

            alert('Event uploaded successfully!');
        } catch (error) {
            console.error('Error uploading event:', error);
            setError('Failed to upload event. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Simple Event</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                    <input type="date" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                    <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">Event Time</label>
                    <input type="time" id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Event Description</label>
                    <textarea id="eventDescription" rows="4" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out">Upload Event</button>
            </form>
        </div>
    );
};

export default SimpleEvents;
