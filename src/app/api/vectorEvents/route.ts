// returns two closest matches based on vector db searches

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import Together from "together-ai";

export async function GET(req: NextRequest) {
  const togetherapi = process.env.TOGETHER_API;
  if (!togetherapi) {
    return NextResponse.json(
      { error: "Together API is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const inputText = searchParams.get("index");

  if (!inputText) {
    return NextResponse.json(
      { error: "Blank Search Request" },
      { status: 400 }
    );
  }

  let query_emb: number[];

  try {
    const togetherclient = new Together({
      apiKey: togetherapi,
    });

    const embResponse = await togetherclient.embeddings.create({
      model: "WhereIsAI/UAE-Large-V1",
      input: inputText,
    });

    query_emb = embResponse.data[0].embedding;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

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
    const events = database.collection("Events");
    const agg = [
      {
        $vectorSearch: {
          queryVector: query_emb,
          path: "embedded",
          numCandidates: 100,
          limit: 3,
          index: "vector_index",
        },
      },
    ];
    const result = await events.aggregate(agg).toArray();

    return NextResponse.json({ status: 200, results: result });
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
