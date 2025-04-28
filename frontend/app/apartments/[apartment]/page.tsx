import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bed, LayoutGrid, MapPin } from "lucide-react";
import Image from "next/image";

interface ApartmentDetail {
  _id: string;
  unitName: string;
  unitNumber: string;
  description: string;
  location: {
    address: string;
    city: string;
    coords?: { lat: number; lng: number };
  };
  price: number;
  area: number;
  rooms: number;
  images: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ apartment: string }>;
}): Promise<Metadata> {
  const { apartment } = await params;
  try {
    const apt = await fetchApartment(apartment);
    return {
      title: apt.unitName,
      description: apt.description.slice(0, 160),
    };
  } catch {
    return { title: "Apartment Details", description: "" };
  }
}

async function fetchApartment(id: string): Promise<ApartmentDetail> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/apartments/${id}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) throw new Error("Not Found");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ apartment: string }>;
}) {
  const { apartment: id } = await params;
  let apt: ApartmentDetail;
  try {
    apt = await fetchApartment(id);
  } catch (err: any) {
    if (err.message === "Not Found") notFound();
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <p className="text-red-500">Unable to load apartment details.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Link
            href="/apartments"
            className="text-indigo-600 hover:underline flex items-center"
          >
            ← Back to listings
          </Link>
          <span className="text-gray-500 text-sm">Unit {apt.unitNumber}</span>
        </div>

        <div className="md:flex">
          {/* Left: Images */}
          <div className="md:w-1/2 bg-gray-100 p-4">
            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={apt.images[0] || "/placeholder.svg"}
                alt={`${apt.unitName} main`}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {apt.images.slice(1).map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <Image
                    src={img}
                    alt={`${apt.unitName} ${i + 2}`}
                    width={150}
                    height={100}
                    className="w-full h-24 object-cover hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-6 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{apt.unitName}</h1>
            <p className="text-3xl font-semibold text-indigo-600">
              ${apt.price.toLocaleString()}/mo
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                <Bed className="w-4 h-4" /> {apt.rooms} bed
                {apt.rooms > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                <LayoutGrid className="w-4 h-4" /> {apt.area} m²
              </span>
              <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                <MapPin className="w-4 h-4" /> {apt.location.address},{" "}
                {apt.location.city}
              </span>
            </div>

            <div className="prose prose-indigo max-w-none text-gray-700">
              <p>{apt.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
