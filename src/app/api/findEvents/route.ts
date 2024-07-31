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

    // Get the index from the query parameters
    const { searchParams } = new URL(req.url);
    const index = searchParams.get("index");

    if (!index) {
      return NextResponse.json({ error: "Index is required" }, { status: 400 });
    }

    const query = { index: parseInt(index, 10) };
    const event = await Events.findOne(query);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, results: event });
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
