"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Package {
  type: string;
  price: number;
  available: number;
}

interface Event {
  id: string; // Usar la ID generada automáticamente
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
  packages: Package[];
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/eventos");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/eventos/${event.id}`} // Usar la ID generada automáticamente
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
                <p className="text-sm text-gray-700 font-semibold">
                  Desde ${Math.min(...event.packages.map((pkg) => pkg.price))} CLP
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}