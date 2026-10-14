import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import Project from "../models/Project.js";
import { collections as collectionsSeed } from "./data/collections.js";
import { buildProducts } from "./data/products.js";
import { projects as projectsSeed } from "./data/projects.js";

async function run() {
  await connectDB();

  console.log("[seed] clearing existing collections/products/projects...");
  await Promise.all([
    Collection.deleteMany({}),
    Product.deleteMany({}),
    Project.deleteMany({}),
  ]);

  console.log("[seed] inserting collections...");
  const insertedCollections = await Collection.insertMany(collectionsSeed);

  console.log("[seed] inserting products...");
  const productDocs = buildProducts(collectionsSeed).map((p) => {
    const { collectionIndex, ...rest } = p;
    return { ...rest, collectionRef: insertedCollections[collectionIndex]._id };
  });
  await Product.insertMany(productDocs);

  console.log("[seed] inserting projects...");
  const nameToId = new Map(insertedCollections.map((c) => [c.name, c._id]));
  const projectDocs = projectsSeed.map(({ collectionNames, ...rest }) => ({
    ...rest,
    relatedCollections: (collectionNames || []).map((n) => nameToId.get(n)).filter(Boolean),
  }));
  await Project.insertMany(projectDocs);

  console.log(
    `[seed] done. ${insertedCollections.length} collections, ${productDocs.length} products, ${projectDocs.length} projects.`
  );

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
