// returns all events for a specific category. Only TECH and DESIGN work for now. Check basePrompt.in for all categories listed.

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: NextRequest) {
  const uri = process.env.DATABASE_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database URI is not configured" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("Instagram");
    const Events = database.collection("Events");

    // Get the category from the query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("index");

    console.log(category);

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const query = { "event_details.categories": category };
    const events = await Events.find(query).toArray();

    if (events.length === 0) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, results: events });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
