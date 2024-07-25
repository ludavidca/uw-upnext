import { MongoClient, ServerApiVersion } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const uri = process.env.DATABASE_URI;
    console.log(uri);

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Here you would typically query your database for messages
    // For example:
    // const messages = await client.db("your_db_name").collection("messages").find().toArray();

    await client.close();

    return NextResponse.json(
      { message: "DB Queried successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error querying database:", error);
    return NextResponse.json(
      { message: "Error querying database", error: (error as Error).message },
      { status: 500 }
    );
  }
}
