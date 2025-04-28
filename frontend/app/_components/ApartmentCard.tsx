"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Bed, LayoutGrid, MapPin, Trash2 } from "lucide-react";

export interface Apartment {
  _id: string;
  unitName: string;
  unitNumber: string;
  project: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  images: string[];
}

interface ApartmentCardProps {
  apartment: Apartment;
  onDeleteSuccess: () => void;
}

export default function ApartmentCard({
  apartment,
  onDeleteSuccess,
}: ApartmentCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this apartment?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/apartments/${apartment._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      // refresh the current route so the deleted card disappears
      onDeleteSuccess();
      // router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800 p-1 bg-white rounded-full shadow"
        title="Delete apartment"
      >
        <Trash2 className={`w-5 h-5 ${deleting ? "animate-spin" : ""}`} />
      </button>

      {/* clickable content */}
      <Link href={`/apartments/${apartment._id}`} className="group block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={apartment.images[0] || "/placeholder.svg"}
            alt={apartment.unitName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={600}
            height={400}
          />
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
            ${apartment.price.toLocaleString()}/mo
          </span>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {apartment.unitName}
          </h3>
          <div className="flex items-center text-gray-500 text-sm space-x-1">
            <MapPin className="w-4 h-4" />
            <span>
              {apartment.project} • Unit {apartment.unitNumber}
            </span>
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
    </div>
  );
}
