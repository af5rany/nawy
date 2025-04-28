"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface AddApartmentFormData {
  unitName: string;
  unitNumber: string;
  description: string;
  address: string;
  city: string;
  price: string;
  area: string;
  rooms: string;

  images: FileList | null;
}

export default function AddApartmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddApartmentFormData>({
    unitName: "",
    unitNumber: "",
    description: "",
    address: "",
    city: "",
    price: "",
    area: "",
    rooms: "",

    images: null,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setError(null);
    setFormData({
      unitName: "",
      unitNumber: "",
      description: "",
      address: "",
      city: "",
      price: "",
      area: "",
      rooms: "",

      images: null,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e: FormEvent) => {
    // console.log(
    //   "process.env.NEXT_PUBLIC_API_URL",
    //   process.env.NEXT_PUBLIC_API_URL
    // );
    e.preventDefault();
    setError(null);
    try {
      const payload = new FormData();
      payload.append("unitName", formData.unitName);
      payload.append("unitNumber", formData.unitNumber);
      payload.append("description", formData.description);
      payload.append(
        "location",
        JSON.stringify({ address: formData.address, city: formData.city })
      );
      payload.append("price", formData.price);
      payload.append("area", formData.area);
      payload.append("rooms", formData.rooms);

      if (formData.images) {
        Array.from(formData.images).forEach((file) => {
          payload.append("images", file);
        });
      }

      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apartments`, {
      const res = await fetch(`/api/apartments`, {
        method: "POST",
        body: payload,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      close();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <button
        onClick={open}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Add New Apartment
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={close}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Apartment</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-red-500">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="unitName"
                  placeholder="Unit Name"
                  value={formData.unitName}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  name="unitNumber"
                  placeholder="Unit Number"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded h-24"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="price"
                  placeholder="Price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  name="area"
                  placeholder="Area (m²)"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  name="rooms"
                  placeholder="Rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
