// app/apartments/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import ApartmentCard, { Apartment } from "../_components/ApartmentCard";
import AddApartmentForm from "../_components/AddApartmentForm";

export default function ApartmentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  // debounce
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(h);
  }, [search]);

  // our loader, memoized so we can call it on demand
  const loadApartments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`api/apartments?${params}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setApartments(await res.json());
    } catch (err) {
      console.error(err);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  // fetch on mount + when search changes
  useEffect(() => {
    loadApartments();
  }, [loadApartments]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Apartments
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded focus:ring-indigo-500"
        />
      </div>

      {/* Pass loadApartments as onSuccess callback */}
      <AddApartmentForm onSuccess={loadApartments} />

      {loading ? (
        <p className="text-center">Loading…</p>
      ) : apartments.length === 0 ? (
        <p className="text-center text-gray-500">No apartments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <ApartmentCard
              key={apt._id}
              apartment={apt}
              onDeleteSuccess={loadApartments} // same here!
            />
          ))}
        </div>
      )}
    </main>
  );
}
