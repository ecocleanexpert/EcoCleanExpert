import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 h

type GReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
};

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ reviews: [], configured: false });

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": key,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.rating,places.userRatingCount,places.reviews",
  };

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers,
    body: JSON.stringify({ textQuery: "Eco Clean Expert Abidjan" }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return NextResponse.json({ reviews: [], configured: true, error: res.status });

  const data = await res.json();
  const place = (data.places || []).find((p: any) =>
    p.displayName?.text?.toLowerCase().includes("eco clean")
  ) || data.places?.[0];

  const reviews = (place?.reviews || [])
    .filter((r: GReview) => (r.text?.text || "").trim().length > 0)
    .map((r: GReview) => ({
      author: r.authorAttribution?.displayName || "Client Google",
      photo: r.authorAttribution?.photoUri || null,
      rating: r.rating || 5,
      text: r.text!.text,
      time: r.relativePublishTimeDescription || "",
    }));

  return NextResponse.json({
    configured: true,
    rating: place?.rating || null,
    count: place?.userRatingCount || null,
    reviews,
  });
}
