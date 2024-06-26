import React, { useEffect, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from '../Firebase'; // Adjust the path as necessary
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader from react-spinners

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const dbRef = ref(database);
                const eventsSnapshot = await get(child(dbRef, 'simple_events'));

                if (eventsSnapshot.exists()) {
                    const eventsData = [];
                    eventsSnapshot.forEach((event) => {
                        eventsData.push({
                            id: event.key,
                            ...event.val()
                        });
                    });
                    setEvents(eventsData);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false); // Set loading to false when done fetching
            }
        };

        fetchEvents();
    }, []);

    const override = css`
        display: block;
        margin: 0 auto;
    `;

    return (
        <div className="container flex-col mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Check out our upcoming events and join us for an exciting time!
            </p>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <ClipLoader color="#3B82F6" loading={loading} css={override} size={35} />
                </div>
            ) : events.length > 0 ? (
                <ul className="grid gap-6">
                    {events.map((event) => (
                        <li key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.eventName}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold">Date:</span> {event.eventDate},
                                    <span className="font-semibold ml-2">Time:</span> {event.eventTime}
                                </p>
                                <p className="text-gray-700">{event.eventDescription}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600">No upcoming events found.</p>
                </div>
            )}
        </div>
    );
};

export default Events;
