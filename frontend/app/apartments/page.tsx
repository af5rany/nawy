// app/apartments/page.tsx
"use client";

import { useState, useEffect } from "react";
import ApartmentCard, { Apartment } from "../_components/ApartmentCard";
import AddApartmentForm from "../_components/AddApartmentForm";

export default function ApartmentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  // debounce the search input
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(h);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);

        const res = await fetch(`api/apartments?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Apartment[];
        setApartments(data);
      } catch (err) {
        console.error("Failed to load apartments:", err);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debouncedSearch]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Apartments
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by unit, number or project…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search apartments"
        />
      </div>

      <AddApartmentForm />

      {loading ? (
        <p className="text-center">Loading…</p>
      ) : apartments.length === 0 ? (
        <div className="text-center text-gray-500 space-y-2">
          <p>No apartments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <ApartmentCard key={apt._id} apartment={apt} />
          ))}
        </div>
      )}
    </main>
  );
}
