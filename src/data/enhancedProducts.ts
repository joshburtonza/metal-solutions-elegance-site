import { Product } from '@/types/ecommerce';

export const products: Product[] = [
  {
    id: "bella-01",
    name: "BELLA Coffee Table",
    itemCode: "BL-CT-01",
    category: "BELLA",
    dimensions: "120cm × 60cm × 45cm",
    materials: "Brushed Steel, Marble Top",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1969",
    price: 12500,
    stock: 8,
    isFeatured: true,
    description: "Elegant coffee table featuring brushed steel frame with premium marble top. Perfect centerpiece for modern living spaces.",
    specifications: ["Premium Carrara marble top", "Brushed steel frame", "Weight capacity: 50kg", "Assembly required"],
    finishOptions: ["Brushed Steel & White Marble", "Brushed Steel & Black Marble"],
    deliveryTime: "2-3 weeks"
  },
  {
    id: "bella-02",
    name: "BELLA Side Table",
    itemCode: "BL-ST-02",
    category: "BELLA",
    dimensions: "45cm × 45cm × 50cm",
    materials: "Polished Steel, Tempered Glass",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=2035",
    price: 4200,
    stock: 15,
    description: "Compact side table with polished steel frame and tempered glass top. Ideal for small spaces.",
    specifications: ["12mm tempered glass top", "Polished steel frame", "Weight capacity: 25kg", "Easy assembly"],
    finishOptions: ["Polished Steel & Clear Glass", "Polished Steel & Smoked Glass"],
    deliveryTime: "1-2 weeks"
  },
  {
    id: "demi-01",
    name: "DEMI Chair",
    itemCode: "DM-CH-01",
    category: "DEMI",
    dimensions: "60cm × 55cm × 80cm",
    materials: "Matte Steel, Premium Leather",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2080",
    price: 8900,
    stock: 12,
    isNew: true,
    description: "Ergonomic dining chair with matte steel frame and premium leather upholstery. Comfort meets sophistication.",
    specifications: ["Top-grain leather upholstery", "Ergonomic design", "Matte powder-coated steel", "Weight capacity: 120kg"],
    finishOptions: ["Matte Black & Black Leather", "Matte Black & Cognac Leather", "Matte White & White Leather"],
    deliveryTime: "3-4 weeks"
  },
  {
    id: "luna-01",
    name: "LUNA Mirror",
    itemCode: "LN-MR-01",
    category: "LUNA",
    dimensions: "90cm × 5cm × 90cm",
    materials: "Circular Brushed Steel Frame",
    image: "https://images.unsplash.com/photo-1619596662481-085e45d69762?q=80&w=1974",
    price: 3200,
    stock: 20,
    description: "Circular mirror with brushed steel frame. Adds depth and light to any room.",
    specifications: ["5mm silvered mirror", "Brushed steel frame", "Wall mounting hardware included", "Easy installation"],
    finishOptions: ["Brushed Steel", "Matte Black", "Antique Brass"],
    deliveryTime: "1-2 weeks"
  },
  {
    id: "amara-01",
    name: "AMARA Dining Set",
    itemCode: "AM-DS-01",
    category: "AMARA",
    dimensions: "Table: 180cm × 90cm × 75cm",
    materials: "Blackened Steel, Suede Chairs",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932",
    price: 28500,
    originalPrice: 32000,
    stock: 3,
    isFeatured: true,
    description: "Complete dining set featuring blackened steel table with matching suede-upholstered chairs. Seats 6 comfortably.",
    specifications: ["Table seats 6", "Blackened steel table frame", "Premium suede upholstery", "Chair weight capacity: 110kg each"],
    finishOptions: ["Blackened Steel & Charcoal Suede", "Blackened Steel & Tan Suede"],
    deliveryTime: "4-6 weeks"
  },
  {
    id: "bishop-01",
    name: "BISHOP Bookshelf",
    itemCode: "BS-BK-01",
    category: "BISHOP",
    dimensions: "90cm × 35cm × 200cm",
    materials: "Powder-coated Steel",
    image: "https://images.unsplash.com/photo-1588169257530-58be9c5d4adc?q=80&w=2070",
    price: 15200,
    stock: 6,
    description: "Tall industrial bookshelf with powder-coated steel construction. Multiple shelves for storage and display.",
    specifications: ["6 adjustable shelves", "Powder-coated finish", "Wall mounting brackets included", "Weight capacity: 30kg per shelf"],
    finishOptions: ["Matte Black", "Matte White", "Charcoal Grey"],
    deliveryTime: "2-3 weeks"
  },
  {
    id: "nikita-01",
    name: "NIKITA Desk",
    itemCode: "NK-DK-01",
    category: "NIKITA",
    dimensions: "140cm × 70cm × 75cm",
    materials: "Graphite Steel, Tempered Glass",
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=2065",
    price: 11800,
    stock: 9,
    description: "Modern desk with graphite steel frame and tempered glass top. Perfect for home office or study.",
    specifications: ["15mm tempered glass top", "Cable management system", "Graphite powder-coated steel", "Weight capacity: 40kg"],
    finishOptions: ["Graphite Steel & Clear Glass", "Graphite Steel & Frosted Glass"],
    deliveryTime: "2-3 weeks"
  },
  {
    id: "swing-01",
    name: "SWING BENCH",
    itemCode: "SW-BN-01",
    category: "SWING BENCH",
    dimensions: "180cm × 60cm × 45cm",
    materials: "Steel Frame, Premium Cushions",
    image: "https://images.unsplash.com/photo-1556438758-8d49568ce18e?q=80&w=2070",
    price: 18900,
    stock: 4,
    isNew: true,
    description: "Unique swing bench with steel frame and premium cushions. Indoor/outdoor versatility.",
    specifications: ["Weather-resistant cushions", "Galvanized steel frame", "Swing mechanism included", "Weight capacity: 200kg"],
    finishOptions: ["Black Frame & Charcoal Cushions", "White Frame & Cream Cushions"],
    deliveryTime: "3-4 weeks"
  },
  {
    id: "flower-01",
    name: "FLOWER Table",
    itemCode: "FL-TB-01",
    category: "FLOWER",
    dimensions: "100cm × 100cm × 75cm",
    materials: "Steel Base, Matte Black Finish",
    image: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab0?q=80&w=1974",
    price: 9200,
    stock: 11,
    description: "Square dining table with sculptural steel base and matte black finish. Artistic and functional.",
    specifications: ["Sculptural steel base", "Matte black powder coating", "Seats 4 comfortably", "Weight capacity: 60kg"],
    finishOptions: ["Matte Black", "Matte White", "Brushed Steel"],
    deliveryTime: "2-3 weeks"
  },
  {
    id: "zani-01",
    name: "ZANI Lamp",
    itemCode: "ZN-LP-01",
    category: "ZANI",
    dimensions: "35cm × 35cm × 120cm",
    materials: "Polished Steel, Frosted Glass",
    image: "https://images.unsplash.com/photo-1513506291046-13795ff14750?q=80&w=2070",
    price: 3800,
    stock: 18,
    description: "Elegant floor lamp with polished steel base and frosted glass shade. Ambient lighting solution.",
    specifications: ["E27 LED compatible", "Frosted glass shade", "Polished steel base", "In-line switch"],
    finishOptions: ["Polished Steel & Frosted Glass", "Matte Black & White Glass"],
    deliveryTime: "1-2 weeks"
  },
  {
    id: "hotel-01",
    name: "HOTEL Console",
    itemCode: "HT-CS-01",
    category: "HOTEL",
    dimensions: "120cm × 40cm × 85cm",
    materials: "Brushed Steel, Marble",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070",
    price: 14200,
    stock: 7,
    isFeatured: true,
    description: "Luxury console table with brushed steel frame and marble top. Perfect for entryways or dining rooms.",
    specifications: ["Premium marble top", "Brushed steel frame", "2 storage drawers", "Weight capacity: 45kg"],
    finishOptions: ["Brushed Steel & White Marble", "Brushed Steel & Black Marble"],
    deliveryTime: "3-4 weeks"
  },
  {
    id: "lana-01",
    name: "LANA Stool",
    itemCode: "LN-ST-01",
    category: "LANA",
    dimensions: "45cm × 45cm × 65cm",
    materials: "Steel Frame, Leather Seat",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965",
    price: 5200,
    stock: 22,
    description: "Versatile stool with steel frame and leather seat. Perfect for kitchen islands or extra seating.",
    specifications: ["Top-grain leather seat", "Steel tube frame", "Adjustable foot glides", "Weight capacity: 100kg"],
    finishOptions: ["Black Frame & Black Leather", "White Frame & Tan Leather", "Brass Frame & Brown Leather"],
    deliveryTime: "2-3 weeks"
  }
];

export const categories = [
  "BELLA", "DEMI", "LUNA", "AMARA", "BISHOP", "NIKITA", "SWING BENCH", "FLOWER", "ZANI", "HOTEL", "LANA"
];

export const deliveryOptions = [
  {
    id: "gauteng-local",
    name: "Gauteng Local Delivery",
    description: "Same-day or next-day delivery within Gauteng",
    price: 350,
    estimatedDays: "1-2 days",
    available: true
  },
  {
    id: "national-standard",
    name: "National Standard",
    description: "Standard delivery to major cities",
    price: 850,
    estimatedDays: "3-7 days",
    available: true
  },
  {
    id: "national-express",
    name: "National Express",
    description: "Express delivery to major cities",
    price: 1200,
    estimatedDays: "1-3 days",
    available: true
  },
  {
    id: "collection",
    name: "Collection",
    description: "Collect from our Johannesburg showroom",
    price: 0,
    estimatedDays: "Available immediately",
    available: true
  }
];