import React from "react";
import Link from "next/link";

interface Event {
  id: number;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/eventos/${event.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{event.location}</p>
                <h3 className="text-lg font-bold text-black">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.date} - {event.time}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventList;