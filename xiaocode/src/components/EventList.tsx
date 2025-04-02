import React from "react";

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
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-500">{event.location}</p>
              <h3 className="text-lg text-black font-bold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date} - {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;