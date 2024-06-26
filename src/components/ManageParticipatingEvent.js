// ManageParticipatingEvent.js

import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary

const ManageParticipatingEvent = () => {
    const [events, setEvents] = useState([]);
    const [editEventId, setEditEventId] = useState(null);
    const [editEventName, setEditEventName] = useState('');
    const [editEventDate, setEditEventDate] = useState('');
    const [editEventTime, setEditEventTime] = useState('');
    const [editEventDescription, setEditEventDescription] = useState('');
    const [editEventDeadline, setEditEventDeadline] = useState('');
    const [deleteEventId, setDeleteEventId] = useState(null);

    useEffect(() => {
        const eventsRef = ref(database, 'events'); // Adjust this path according to your database structure
        onValue(eventsRef, (snapshot) => {
            const eventData = snapshot.val();
            if (eventData) {
                const eventsArray = Object.keys(eventData).map((key) => ({
                    id: key,
                    ...eventData[key]
                }));
                setEvents(eventsArray);
            } else {
                setEvents([]);
            }
        });
    }, []);

    const handleEdit = (eventId, eventName, eventDate, eventTime, eventDescription, eventDeadline) => {
        setEditEventId(eventId);
        setEditEventName(eventName);
        setEditEventDate(eventDate);
        setEditEventTime(eventTime);
        setEditEventDescription(eventDescription);
        setEditEventDeadline(eventDeadline);
    };

    const handleUpdate = async () => {
        try {
            const eventRef = ref(database, `events/${editEventId}`);
            await set(eventRef, {
                eventName: editEventName,
                eventDate: editEventDate,
                eventTime: editEventTime,
                eventDescription: editEventDescription,
                eventDeadline: editEventDeadline
            });

            // Reset edit state after update
            setEditEventId(null);
            setEditEventName('');
            setEditEventDate('');
            setEditEventTime('');
            setEditEventDescription('');
            setEditEventDeadline('');
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (confirmDelete) {
            try {
                const eventRef = ref(database, `events/${eventId}`);
                await remove(eventRef);
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    return (
        <div className="container flex-col mx-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Manage Participating Events</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                    <li key={event.id} className="border p-4 rounded-md shadow-md">
                        {editEventId === event.id ? (
                            <div className="mb-4">
                                <label htmlFor="editEventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                                <input type="text" id="editEventName" value={editEventName} onChange={(e) => setEditEventName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        ) : (
                            <h3 className="text-lg font-semibold">{event.eventName}</h3>
                        )}
                        {editEventId === event.id ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="editEventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                                    <input type="date" id="editEventDate" value={editEventDate} onChange={(e) => setEditEventDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="editEventTime" className="block text-sm font-medium text-gray-700">Event Time</label>
                                    <input type="time" id="editEventTime" value={editEventTime} onChange={(e) => setEditEventTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">Date: {event.eventDate} | Time: {event.eventTime}</p>
                        )}
                        {editEventId === event.id ? (
                            <div className="mb-4">
                                <label htmlFor="editEventDescription" className="block text-sm font-medium text-gray-700">Event Description</label>
                                <textarea id="editEventDescription" rows="4" value={editEventDescription} onChange={(e) => setEditEventDescription(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                            </div>
                        ) : (
                            <p className="text-gray-600">{event.eventDescription}</p>
                        )}
                        {editEventId === event.id ? (
                            <div>
                                <label htmlFor="editEventDeadline" className="block text-sm font-medium text-gray-700">Deadline Date</label>
                                <input type="date" id="editEventDeadline" value={editEventDeadline} onChange={(e) => setEditEventDeadline(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        ) : (
                            <p className="text-gray-600">Deadline: {event.deadlineDate}</p>
                        )}
                        {editEventId === event.id ? (
                            <div className="flex space-x-4">
                                <button onClick={handleUpdate} className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out">Save</button>
                                <button onClick={() => setEditEventId(null)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <button onClick={() => handleEdit(event.id, event.eventName, event.eventDate, event.eventTime, event.eventDescription, event.deadlineDate)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">Edit</button>
                                <button onClick={() => setDeleteEventId(event.id)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out">Delete</button>
                            </div>
                        )}
                        {deleteEventId === event.id && (
                            <div className="mt-2">
                                <p className="text-red-600">Are you sure you want to delete this event?</p>
                                <div className="flex space-x-4 mt-2">
                                    <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out">Yes</button>
                                    <button onClick={() => setDeleteEventId(null)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out">No</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageParticipatingEvent;
