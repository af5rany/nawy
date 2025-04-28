import { Metadata } from "next";
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
  const { apartment } = await params; // <-- await here
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
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/apartments/${id}`;
    console.log(`[fetchApartment] fetching ${url}`);

    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 404) {
      throw new Error(`Apartment not found (ID: ${id})`);
    }
    if (!res.ok) {
      // try to extract any error text from the body
      const bodyText = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch apartment ${id}: ${res.status} ${res.statusText}` +
          (bodyText ? ` — ${bodyText}` : "")
      );
    }

    const data = await res.json();

    // sanity check
    if (typeof data !== "object" || data === null || !("_id" in data)) {
      throw new Error(
        `Invalid data format for apartment ${id}: expected object with _id`
      );
    }

    return data as ApartmentDetail;
  } catch (err: unknown) {
    console.error(`[fetchApartment] error loading ID=${id}`, err);
    if (err instanceof Error) {
      // rethrow the original error so caller can handle it
      throw err;
    }
    // wrap non-Error exceptions
    throw new Error(`Unknown error fetching apartment ${id}`);
  }
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
    if (err.message === "Not Found") {
      notFound();
    }
    return (
      <main className="container mx-auto p-8">
        <p className="text-center text-red-500">
          Unable to load apartment details.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8 space-y-6">
      {/* <button
        onClick={() => window.history.back()}
        className="text-indigo-600 hover:underline"
      >
        &larr; Back to listings
      </button> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          {apt.images.map((img, i) => (
            <Image
              key={i}
              src={img || "/placeholder.svg"}
              alt={`${apt.unitName} image ${i + 1}`}
              width={i === 0 ? 600 : 300}
              height={i === 0 ? 400 : 200}
              className={`rounded-lg object-cover ${i === 0 ? "h-80" : "h-48"}`}
            />
          ))}
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{apt.unitName}</h1>
          <p className="text-indigo-600 text-2xl font-semibold">
            ${apt.price.toLocaleString()}/mo
          </p>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Bed className="w-5 h-5" />
              <span>
                {apt.rooms} bed{apt.rooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <LayoutGrid className="w-5 h-5" />
              <span>{apt.area} m²</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-5 h-5" />
              <span>
                {apt.location.address}, {apt.location.city}
              </span>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{apt.description}</p>
        </div>
      </div>
    </main>
  );
}
