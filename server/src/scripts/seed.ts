import "dotenv/config";
import mongoose from "mongoose";
import Plant from "../models/plants";
import Review from "../models/review";


async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  await Plant.deleteMany({});
  await Review.deleteMany({});
  await Plant.insertMany([
   { name: "Calathea plant", subtitle: "Trendy House Plant", imageUrl: "https://placehold.co/540x680/png", rating: 5, isFeatured: true, price: 39.9 },
   { name: "Fiddle Leaf Fig", subtitle: "Indoor Beauty", imageUrl: "https://placehold.co/540x680/png?text=Fig", rating: 4, isFeatured: true, price: 49.0 },
   { name: "Snake Plant", subtitle: "Air Purifier", imageUrl: "https://placehold.co/540x680/png?text=Snake", rating: 5, isFeatured: true, price: 29.9 },
  ]);

  await Review.create({
    userName: "Alena Patel",
    avatarUrl: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
    highlighted: true,
  });

  console.log("Seeded");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });