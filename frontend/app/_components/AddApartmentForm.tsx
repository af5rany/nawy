"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface AddApartmentFormData {
  unitName: string;
  unitNumber: string;
  project: string;
  description: string;
  address: string;
  city: string;
  price: string;
  area: string;
  rooms: string;
  images: FileList | null;
}

interface ValidationErrors {
  unitName?: string;
  unitNumber?: string;
  project?: string;
  description?: string;
  address?: string;
  city?: string;
  price?: string;
  area?: string;
  rooms?: string;
  images?: string;
}

export default function AddApartmentForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddApartmentFormData>({
    unitName: "",
    unitNumber: "",
    project: "",
    description: "",
    address: "",
    city: "",
    price: "",
    area: "",
    rooms: "",
    images: null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setErrors({});
    setSubmitError(null);
    setFormData({
      unitName: "",
      unitNumber: "",
      project: "",
      description: "",
      address: "",
      city: "",
      price: "",
      area: "",
      rooms: "",
      images: null,
    });
    setLoading(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  function validate(): boolean {
    const errs: ValidationErrors = {};

    if (!formData.unitName.trim()) errs.unitName = "Unit Name is required";
    if (!formData.unitNumber.trim())
      errs.unitNumber = "Unit Number is required";
    if (!formData.project.trim()) errs.project = "project is required";
    if (!formData.description.trim())
      errs.description = "Description is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";

    const p = Number(formData.price);
    if (!formData.price.trim()) errs.price = "Price is required";
    else if (isNaN(p) || p <= 0) errs.price = "Enter a valid positive price";

    const a = Number(formData.area);
    if (formData.area.trim()) {
      if (isNaN(a) || a <= 0) errs.area = "Enter a valid positive area";
    }

    const r = Number(formData.rooms);
    if (!formData.rooms.trim()) errs.rooms = "Number of rooms is required";
    else if (isNaN(r) || r <= 0) errs.rooms = "Enter a valid positive rooms";

    if (!formData.images || formData.images.length === 0)
      errs.images = "Please select at least one image";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("unitName", formData.unitName);
      payload.append("unitNumber", formData.unitNumber);
      payload.append("project", formData.project);
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

      const res = await fetch(`/api/apartments`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Submit failed (${res.status}) ${text}`);
      }
      onSuccess();
      close();
      // router.refresh();
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong");
      setLoading(false);
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
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={close}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Apartment</h2>
            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="unitName"
                    placeholder="Unit Name"
                    value={formData.unitName}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.unitName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.unitName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unitName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="unitNumber"
                    placeholder="Unit Number"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.unitNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.unitNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unitNumber}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  name="project"
                  placeholder="Project"
                  value={formData.project}
                  onChange={handleChange}
                  disabled={loading}
                  className={`border p-2 rounded w-full ${
                    errors.unitName ? "border-red-500" : ""
                  }`}
                />
                {errors.project && (
                  <p className="text-red-500 text-sm mt-1">{errors.project}</p>
                )}
              </div>
              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full border p-2 rounded h-24 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.city ? "border-red-500" : ""
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    name="price"
                    placeholder="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.price ? "border-red-500" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                <div>
                  <input
                    name="area"
                    placeholder="Area (m²)"
                    type="number"
                    value={formData.area}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.area ? "border-red-500" : ""
                    }`}
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                </div>
                <div>
                  <input
                    name="rooms"
                    placeholder="Rooms"
                    type="number"
                    value={formData.rooms}
                    onChange={handleChange}
                    disabled={loading}
                    className={`border p-2 rounded w-full ${
                      errors.rooms ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.rooms}</p>
                  )}
                </div>
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
                  disabled={loading}
                  className={`w-full ${errors.images ? "border-red-500" : ""}`}
                />
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 w-full flex justify-center items-center bg-indigo-600 text-white py-2 rounded transition ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
