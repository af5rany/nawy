import { Metadata } from "next";
import ApartmentCard, { Apartment } from "../_components/ApartmentCard";
import AddApartmentForm from "../_components/AddApartmentForm";

export const metadata: Metadata = {
  title: "Apartment Listings",
  description:
    "Browse available apartments with detailed information, responsive design for mobile and web.",
};

async function fetchApartments(): Promise<Apartment[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/apartments`;
    // console.log(`[fetchApartment] fetching ${url}`);

    // console.log("API URL:", url);
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      // grab any error body for extra context
      const bodyText = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch apartments: ${res.status} ${res.statusText}${
          bodyText ? ` — ${bodyText}` : ""
        }`
      );
    }

    const data = await res.json();

    // sanity‐check the response shape
    if (!Array.isArray(data)) {
      throw new Error(
        `Unexpected response format: expected an array but got ${typeof data}`
      );
    }

    return data as Apartment[];
  } catch (err: unknown) {
    // log for debugging
    console.error("[fetchApartments] error:", err);
    // rethrow so caller (your page) can show the fallback UI
    if (err instanceof Error) throw err;
    throw new Error("An unknown error occurred while loading apartments");
  }
}

export default async function ApartmentsPage() {
  let apartments: Apartment[] = [];

  try {
    apartments = await fetchApartments();
    console.log("apartments", apartments);
  } catch (e) {
    console.error("Error fetching apartments:", e);
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Available Apartments
        </h1>
        <p className="text-red-500 text-center">
          Oops! Failed to load apartments.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Apartments
      </h1>
      <AddApartmentForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map((apt) => (
          <ApartmentCard key={apt._id} apartment={apt} />
        ))}
      </div>
    </main>
  );
}
