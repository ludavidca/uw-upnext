// returns list of all events in acsending order for now for likes, can filter to only include top 5

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: NextRequest) {
  const uri = process.env.DATABASE_URI;
  console.log(uri);
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

    const events = await Events.aggregate([
    { $sort: { "event_details.start_time": 1 } },
    ]).toArray();
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
