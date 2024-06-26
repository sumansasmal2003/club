import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary

const EventUploadForm = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Validate form inputs
            if (!eventName || !eventDate || !deadlineDate || !eventTime) {
                setError('Please fill in all fields.');
                return;
            }

            // Reference to the 'events' node in Firebase Realtime Database
            const eventsRef = ref(database, 'events');

            // Generate a unique key for the new event
            const newEventRef = push(eventsRef);

            // Set the event data under the unique key
            await set(newEventRef, {
                eventName,
                eventDate,
                deadlineDate,
                eventTime
            });

            // Reset the form after successful submission
            setEventName('');
            setEventDate('');
            setDeadlineDate('');
            setEventTime('');

            alert('Event uploaded successfully!');
        } catch (error) {
            console.error('Error uploading event:', error);
            setError('Failed to upload event. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="px-4 py-6 sm:p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Participating Event</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                            Event Name
                        </label>
                        <input
                            type="text"
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                            Event Date
                        </label>
                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700">
                            Registration Deadline
                        </label>
                        <input
                            type="date"
                            id="deadlineDate"
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
                            Event Time
                        </label>
                        <input
                            type="time"
                            id="eventTime"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out"
                        >
                            Upload Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventUploadForm;
