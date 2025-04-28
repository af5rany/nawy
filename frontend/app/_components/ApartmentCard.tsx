"use client";

import Link from "next/link";
import React from "react";
import { Bed, LayoutGrid, MapPin } from "lucide-react";
import Image from "next/image";

export interface Apartment {
  _id: string;
  unitName: string;
  unitNumber: string;

  price: number;
  area: number;
  rooms: number;
  images: string[];
}

interface ApartmentCardProps {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link
      href={`/apartments/${apartment._id}`}
      className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={apartment.images[0] || "/placeholder.svg"}
          alt={apartment.unitName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={600}
          height={400}
        />

        <span className="absolute top-3 right-3 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
          ${apartment.price.toLocaleString()}/mo
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {apartment.unitName}
        </h3>
        <div className="flex items-center text-gray-500 text-sm space-x-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">• Unit {apartment.unitNumber}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span>{apartment.rooms} bd</span>
          </div>
          <div className="flex items-center space-x-1">
            <LayoutGrid className="w-4 h-4" />
            <span>{apartment.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
