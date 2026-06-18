const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();

const products = [
  // --- MEN'S COLLECTION ---
  {
    name: "Nike Classic Cap",
    description: "Premium branded adjustable sports cap.",
    price: 35,
    quantityInStock: 25,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg",
  },
  {
    name: "Minimalist White Tee",
    description: "Clean, regular-fit everyday heavy cotton t-shirt.",
    price: 25,
    quantityInStock: 40,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/18257675/pexels-photo-18257675.jpeg",
  },
  {
    name: "Classic Blue Trousers",
    description: "Tailored-fit smart casual blue pants.",
    price: 75,
    quantityInStock: 15,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/6843238/pexels-photo-6843238.jpeg",
  },
  {
    name: "Premium Sunglasses",
    description: "Dark-lens sleek frames with UV protection.",
    price: 60,
    quantityInStock: 20,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/13430499/pexels-photo-13430499.jpeg",
  },
  {
    name: "Urban Red Sneakers",
    description: "High-top striking red athletic shoes.",
    price: 110,
    quantityInStock: 12,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/31688982/pexels-photo-31688982.jpeg",
  },
  {
    name: "Retro Blue Kicks",
    description: "Classic canvas comfortable low-top blue shoes.",
    price: 90,
    quantityInStock: 18,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/16947118/pexels-photo-16947118.jpeg",
  },
  {
    name: "Modern Outerwear Jacket",
    description: "Premium technical everyday streetwear jacket.",
    price: 140,
    quantityInStock: 10,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/16428734/pexels-photo-16428734.jpeg",
  },
  {
    name: "Tailored White Suit",
    description: "Luxury slim-fit formal white blazer and trouser set.",
    price: 299,
    quantityInStock: 8,
    category: "Men",
    imageUrl: "https://images.pexels.com/photos/16159027/pexels-photo-16159027.jpeg",
  },
  // --- WOMEN'S COLLECTION ---
  {
    name: "Tailored Blue Suit",
    description: "Elegant slim-cut formal blue pantsuit set.",
    price: 280,
    quantityInStock: 10,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/19303743/pexels-photo-19303743.jpeg",
  },
  {
    name: "Crimson Statement Suit",
    description: "Bold, modern tailored red blazer suit.",
    price: 295,
    quantityInStock: 7,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/19584321/pexels-photo-19584321.jpeg",
  },
  {
    name: "Wide-Brim Sun Hat",
    description: "Classic woven straw hat for elevated styling.",
    price: 45,
    quantityInStock: 25,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/9889206/pexels-photo-9889206.jpeg",
  },
  {
    name: "Ethereal Tint Shades",
    description: "Statement oversized fashion sunglasses with tinted lenses.",
    price: 65,
    quantityInStock: 15,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/27353350/pexels-photo-27353350.jpeg",
  },
  {
    name: "Minimalist Classic Watch",
    description: "Luxury understated leather-strap analog watch.",
    price: 180,
    quantityInStock: 12,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/31110072/pexels-photo-31110072.jpeg",
  },
  {
    name: "Sleek Leather Handbag",
    description: "Premium structured shoulder bag with gold accents.",
    price: 210,
    quantityInStock: 9,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/36385199/pexels-photo-36385199.jpeg",
  },
  {
    name: "Strappy Summer Sandals",
    description: "Comfortable, stylish low-heel open-toe sandals.",
    price: 85,
    quantityInStock: 20,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/27204291/pexels-photo-27204291.jpeg",
  },
  {
    name: "Knit Top & Skirt Coordinates",
    description: "Premium matching autumn knit crop sweater and slit skirt set.",
    price: 135,
    quantityInStock: 14,
    category: "Women",
    imageUrl: "https://images.pexels.com/photos/6770820/pexels-photo-6770820.jpeg",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(
      products.map((product) => ({
        ...product,
        stock: product.quantityInStock,
      })),
    );
    console.log(`Seeded ${products.length} products successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedProducts();
