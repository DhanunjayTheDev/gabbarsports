import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User'
import Category from '../models/Category'
import Brand from '../models/Brand'
import Product from '../models/Product'
import Coupon from '../models/Coupon'
import Review from '../models/Review'

const MONGO_URI = process.env.MONGODB_URI!

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGO_URI)
  console.log('Connected.')

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    Review.deleteMany({}),
  ])
  console.log('Cleared existing data.')

  // ─── Users ───────────────────────────────────────────────────────────
  // Plain text User pre-save hook hashes once. Do NOT pre-hash here.
  const [admin, customer1, customer2] = await User.create([
    {
      name: 'Gabbar Admin',
      email: 'admin@gabbarsports.in',
      password: 'Admin@123',
      role: 'super_admin',
      isVerified: true,
      isActive: true,
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'Customer@123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      phone: '+91-9876543210',
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'Customer@123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      phone: '+91-9123456789',
    },
  ])
  console.log(`Created ${3} users. Admin: admin@gabbarsports.in / Admin@123`)

  // ─── Categories ──────────────────────────────────────────────────────
  const categories = await Category.create([
    { name: 'Cricket', slug: 'cricket', description: 'Complete cricket equipment and accessories', isActive: true, sortOrder: 1 },
    { name: 'Football', slug: 'football', description: 'Football boots, balls and gear', isActive: true, sortOrder: 2 },
    { name: 'Badminton', slug: 'badminton', description: 'Rackets, shuttlecocks and badminton gear', isActive: true, sortOrder: 3 },
    { name: 'Hockey', slug: 'hockey', description: 'Hockey sticks, balls and protective gear', isActive: true, sortOrder: 4 },
    { name: 'Shoes', slug: 'shoes', description: 'Sports shoes for all disciplines', isActive: true, sortOrder: 5 },
    { name: 'Jerseys', slug: 'jerseys', description: 'Cricket, football and sports jerseys', isActive: true, sortOrder: 6 },
    { name: 'Accessories', slug: 'accessories', description: 'Sports accessories and equipment bags', isActive: true, sortOrder: 7 },
  ])

  const categoryMap: Record<string, mongoose.Types.ObjectId> = {}
  for (const c of categories) categoryMap[c.slug] = c._id as mongoose.Types.ObjectId
  console.log(`Created ${categories.length} categories.`)

  // Sub-categories under cricket
  const cricketSubs = await Category.create([
    { name: 'Cricket Bats', slug: 'cricket-bats', parent: categoryMap['cricket'], isActive: true, sortOrder: 1 },
    { name: 'Cricket Balls', slug: 'cricket-balls', parent: categoryMap['cricket'], isActive: true, sortOrder: 2 },
    { name: 'Cricket Pads', slug: 'cricket-pads', parent: categoryMap['cricket'], isActive: true, sortOrder: 3 },
    { name: 'Cricket Gloves', slug: 'cricket-gloves', parent: categoryMap['cricket'], isActive: true, sortOrder: 4 },
    { name: 'Cricket Helmets', slug: 'cricket-helmets', parent: categoryMap['cricket'], isActive: true, sortOrder: 5 },
    { name: 'Cricket Bags', slug: 'cricket-bags', parent: categoryMap['cricket'], isActive: true, sortOrder: 6 },
  ])
  for (const c of cricketSubs) categoryMap[c.slug] = c._id as mongoose.Types.ObjectId

  const footballSubs = await Category.create([
    { name: 'Football Boots', slug: 'football-boots', parent: categoryMap['football'], isActive: true, sortOrder: 1 },
    { name: 'Football Balls', slug: 'football-balls', parent: categoryMap['football'], isActive: true, sortOrder: 2 },
    { name: 'Shin Guards', slug: 'football-shin-guards', parent: categoryMap['football'], isActive: true, sortOrder: 3 },
    { name: 'Football Gloves', slug: 'football-gloves', parent: categoryMap['football'], isActive: true, sortOrder: 4 },
    { name: 'Football Jerseys', slug: 'football-jerseys', parent: categoryMap['football'], isActive: true, sortOrder: 5 },
  ])
  for (const c of footballSubs) categoryMap[c.slug] = c._id as mongoose.Types.ObjectId

  const badmintonSubs = await Category.create([
    { name: 'Badminton Rackets', slug: 'badminton-rackets', parent: categoryMap['badminton'], isActive: true, sortOrder: 1 },
    { name: 'Shuttlecocks', slug: 'badminton-shuttlecocks', parent: categoryMap['badminton'], isActive: true, sortOrder: 2 },
    { name: 'Badminton Shoes', slug: 'badminton-shoes', parent: categoryMap['badminton'], isActive: true, sortOrder: 3 },
    { name: 'Badminton Bags', slug: 'badminton-bags', parent: categoryMap['badminton'], isActive: true, sortOrder: 4 },
    { name: 'Badminton Strings', slug: 'badminton-strings', parent: categoryMap['badminton'], isActive: true, sortOrder: 5 },
  ])
  for (const c of badmintonSubs) categoryMap[c.slug] = c._id as mongoose.Types.ObjectId

  const hockeySubs = await Category.create([
    { name: 'Hockey Sticks', slug: 'hockey-sticks', parent: categoryMap['hockey'], isActive: true, sortOrder: 1 },
    { name: 'Hockey Balls', slug: 'hockey-balls', parent: categoryMap['hockey'], isActive: true, sortOrder: 2 },
    { name: 'Hockey Gloves', slug: 'hockey-gloves', parent: categoryMap['hockey'], isActive: true, sortOrder: 3 },
    { name: 'Hockey Shoes', slug: 'hockey-shoes', parent: categoryMap['hockey'], isActive: true, sortOrder: 4 },
    { name: 'Hockey Gear', slug: 'hockey-gear', parent: categoryMap['hockey'], isActive: true, sortOrder: 5 },
  ])
  for (const c of hockeySubs) categoryMap[c.slug] = c._id as mongoose.Types.ObjectId

  console.log(`Created ${cricketSubs.length + footballSubs.length + badmintonSubs.length + hockeySubs.length} sport sub-categories.`)

  // ─── Brands ──────────────────────────────────────────────────────────
  const brands = await Brand.create([
    { name: 'MRF', slug: 'mrf', description: 'India\'s most trusted cricket brand', isActive: true },
    { name: 'SG Cricket', slug: 'sg-cricket', description: 'Sanspareils Greenlands premium cricket equipment since 1931', isActive: true },
    { name: 'DSC', slug: 'dsc', description: 'Dynamic Sports Corporation quality cricket gear', isActive: true },
    { name: 'SS Cricket', slug: 'ss-cricket', description: 'Sareen Sports Industries made in Meerut', isActive: true },
    { name: 'GM Cricket', slug: 'gm-cricket', description: 'Gunn & Moore British heritage cricket brand', isActive: true },
    { name: 'Kookaburra', slug: 'kookaburra', description: 'Australian cricket equipment brand', isActive: true },
    { name: 'Gray-Nicolls', slug: 'gray-nicolls', description: 'Premium English cricket brand', isActive: true },
    { name: 'Adidas', slug: 'adidas', description: 'Global sports equipment and apparel', isActive: true },
    { name: 'Nike', slug: 'nike', description: 'World\'s leading sports brand', isActive: true },
    { name: 'Puma', slug: 'puma', description: 'German sports lifestyle brand', isActive: true },
    { name: 'Yonex', slug: 'yonex', description: 'Japan\'s leading badminton brand', isActive: true },
    { name: 'Nivia', slug: 'nivia', description: 'India\'s leading sports goods company', isActive: true },
  ])

  const brandMap: Record<string, mongoose.Types.ObjectId> = {}
  for (const b of brands) brandMap[b.slug] = b._id as mongoose.Types.ObjectId
  console.log(`Created ${brands.length} brands.`)

  // ─── Products ────────────────────────────────────────────────────────
  const products = await Product.create([
    // Cricket Bats
    {
      name: 'MRF Genius Grand Edition Cricket Bat',
      slug: 'mrf-genius-grand-edition-bat',
      description: 'Used by Virat Kohli. English Willow Grade 1+. Full size with premium blade profile, thick edges and deep spine for maximum power. Ideal for hard pitches and aggressive batting.',
      shortDescription: 'Virat Kohli\'s bat English Willow Grade 1+, thick edges, powerful spine.',
      price: 12999,
      originalPrice: 15999,
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80'],
      category: categoryMap['cricket-bats'],
      brand: brandMap['mrf'],
      sku: 'MRF-GGE-001',
      stockQuantity: 45,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'bat', 'english willow', 'mrf', 'kohli'],
      attributes: new Map([['weight', '1.2 kg'], ['grade', 'Grade 1+'], ['handle', 'Oval'], ['size', 'SH']]),
      rating: 4.8,
      reviewCount: 234,
    },
    {
      name: 'SG Sunny Tonny Classic Kashmir Willow Bat',
      slug: 'sg-sunny-tonny-classic-bat',
      description: 'Perfect starter bat made from finest Kashmir Willow. Machine pressed blade with traditional shape. Ideal for practice and club-level cricket. Comes with full-length protective cover.',
      shortDescription: 'Premium Kashmir Willow starter bat ideal for practice and club cricket.',
      price: 1899,
      originalPrice: 2499,
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80'],
      category: categoryMap['cricket-bats'],
      brand: brandMap['sg-cricket'],
      sku: 'SG-STC-001',
      stockQuantity: 120,
      inStock: true,
      gstRate: 18,
      isFeatured: false,
      isTrending: true,
      isNewArrival: true,
      isActive: true,
      tags: ['cricket', 'bat', 'kashmir willow', 'sg', 'beginner'],
      attributes: new Map([['weight', '1.1 kg'], ['grade', 'Kashmir'], ['handle', 'Round'], ['size', 'SH']]),
      rating: 4.3,
      reviewCount: 189,
    },
    {
      name: 'DSC Pearla Glider English Willow Bat',
      slug: 'dsc-pearla-glider-english-willow-bat',
      description: 'Grade 2 English Willow with a big sweet spot and concave spine. Hand-crafted for superior balance and pick-up. Multi-layer toe and shoulder protection included.',
      shortDescription: 'Grade 2 English Willow with concave spine and big sweet spot.',
      price: 7499,
      originalPrice: 9500,
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80'],
      category: categoryMap['cricket-bats'],
      brand: brandMap['dsc'],
      sku: 'DSC-PG-EW-001',
      stockQuantity: 30,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      isActive: true,
      tags: ['cricket', 'bat', 'english willow', 'dsc'],
      attributes: new Map([['weight', '1.15 kg'], ['grade', 'Grade 2'], ['size', 'SH']]),
      rating: 4.5,
      reviewCount: 87,
    },
    // Cricket Balls
    {
      name: 'SG Club Red Leather Cricket Ball',
      slug: 'sg-club-red-leather-ball',
      description: 'Traditional 4-piece red leather ball. Hand-stitched with alum-tanned leather. Ideal for club, league and practice matches. Maintains shape throughout long innings.',
      shortDescription: '4-piece hand-stitched red leather ball for club and league cricket.',
      price: 699,
      originalPrice: 899,
      thumbnail: 'https://images.unsplash.com/photo-oDs_AxeR5g4?w=600&q=80',
      images: ['https://images.unsplash.com/photo-oDs_AxeR5g4?w=600&q=80'],
      category: categoryMap['cricket-balls'],
      brand: brandMap['sg-cricket'],
      sku: 'SG-CB-RED-001',
      stockQuantity: 500,
      inStock: true,
      gstRate: 12,
      isFeatured: false,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'ball', 'leather', 'red', 'sg'],
      attributes: new Map([['type', 'Leather'], ['color', 'Red'], ['seam', '4-piece']]),
      rating: 4.6,
      reviewCount: 412,
    },
    {
      name: 'Kookaburra Turf Cricket Ball',
      slug: 'kookaburra-turf-cricket-ball',
      description: 'Used in international cricket. Premium 4-piece alum-tanned leather construction. Machine stitching for consistent seam. Excellent for turf pitches.',
      shortDescription: 'International grade Kookaburra turf ball used in first-class cricket.',
      price: 1299,
      originalPrice: 1599,
      thumbnail: 'https://images.unsplash.com/photo-oDs_AxeR5g4?w=600&q=80',
      images: ['https://images.unsplash.com/photo-oDs_AxeR5g4?w=600&q=80'],
      category: categoryMap['cricket-balls'],
      brand: brandMap['kookaburra'],
      sku: 'KK-TURF-001',
      stockQuantity: 200,
      inStock: true,
      gstRate: 12,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'ball', 'leather', 'kookaburra', 'international'],
      attributes: new Map([['type', 'Leather'], ['color', 'Red'], ['grade', 'International']]),
      rating: 4.9,
      reviewCount: 156,
    },
    // Cricket Pads
    {
      name: 'SG Proguard Cricket Batting Pads',
      slug: 'sg-proguard-batting-pads',
      description: 'Professional grade batting pads with high-density foam protection. PVC facing with cane bolsters for superior impact absorption. Lightweight design with 3-strap velcro closure.',
      shortDescription: 'Pro-grade batting pads with HD foam protection and cane bolsters.',
      price: 2499,
      originalPrice: 3200,
      thumbnail: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=600&q=80'],
      category: categoryMap['cricket-pads'],
      brand: brandMap['sg-cricket'],
      sku: 'SG-PG-PAD-001',
      stockQuantity: 60,
      inStock: true,
      gstRate: 18,
      isFeatured: false,
      isTrending: false,
      isNewArrival: true,
      isActive: true,
      tags: ['cricket', 'pads', 'batting', 'sg', 'protection'],
      attributes: new Map([['size', 'Full'], ['color', 'White'], ['straps', '3']]),
      rating: 4.4,
      reviewCount: 98,
    },
    // Cricket Helmet
    {
      name: 'SS Sunridges Matrix Cricket Helmet',
      slug: 'ss-matrix-cricket-helmet',
      description: 'CE certified cricket helmet with ABS shell and steel grill. High-density foam liner for maximum protection. Adjustable inner cradle for perfect fit. Suitable for Test and limited overs cricket.',
      shortDescription: 'CE certified ABS helmet with steel grill Test and ODI grade protection.',
      price: 2999,
      originalPrice: 3999,
      thumbnail: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&q=80'],
      category: categoryMap['cricket-helmets'],
      brand: brandMap['ss-cricket'],
      sku: 'SS-MX-HLM-001',
      stockQuantity: 40,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: false,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'helmet', 'ss', 'protection', 'ce certified'],
      attributes: new Map([['certification', 'CE'], ['shell', 'ABS'], ['grill', 'Steel']]),
      rating: 4.6,
      reviewCount: 143,
    },
    // Cricket Gloves
    {
      name: 'GM Cricket Original Batting Gloves',
      slug: 'gm-original-batting-gloves',
      description: 'Genuine leather batting gloves with high-density foam finger protection. PVC palm padding for grip. Full mesh back for ventilation. Velcro wrist closure for secure fit.',
      shortDescription: 'GM leather batting gloves with HD foam protection and mesh back.',
      price: 1599,
      originalPrice: 2100,
      thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80'],
      category: categoryMap['cricket-gloves'],
      brand: brandMap['gm-cricket'],
      sku: 'GM-OBG-001',
      stockQuantity: 75,
      inStock: true,
      gstRate: 18,
      isFeatured: false,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'gloves', 'batting', 'gm', 'leather'],
      attributes: new Map([['hand', 'Right'], ['material', 'Leather'], ['size', 'Medium']]),
      rating: 4.5,
      reviewCount: 211,
    },
    // Cricket Jersey
    {
      name: 'Team India Cricket Jersey 2024',
      slug: 'team-india-cricket-jersey-2024',
      description: 'Official Team India T20 jersey. Dri-Fit fabric for moisture management. Sublimation printed design. Number and name customization available on request.',
      shortDescription: 'Official Team India T20 Dri-Fit jersey 2024 edition.',
      price: 899,
      originalPrice: 1299,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'],
      category: categoryMap['jerseys'],
      brand: brandMap['adidas'],
      sku: 'IND-T20-JRS-001',
      stockQuantity: 300,
      inStock: true,
      gstRate: 12,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      isActive: true,
      tags: ['jersey', 'india', 'cricket', 't20', 'adidas'],
      attributes: new Map([['fabric', 'Dri-Fit'], ['fit', 'Regular'], ['sizes', 'S-XXXL']]),
      rating: 4.7,
      reviewCount: 567,
      variants: [
        { sku: 'IND-T20-JRS-S', size: 'S', price: 899, originalPrice: 1299, stockQuantity: 60 },
        { sku: 'IND-T20-JRS-M', size: 'M', price: 899, originalPrice: 1299, stockQuantity: 80 },
        { sku: 'IND-T20-JRS-L', size: 'L', price: 899, originalPrice: 1299, stockQuantity: 90 },
        { sku: 'IND-T20-JRS-XL', size: 'XL', price: 899, originalPrice: 1299, stockQuantity: 50 },
        { sku: 'IND-T20-JRS-XXL', size: 'XXL', price: 899, originalPrice: 1299, stockQuantity: 20 },
      ],
    },
    // Badminton
    {
      name: 'Yonex Astrox 88D Pro Badminton Racket',
      slug: 'yonex-astrox-88d-pro-racket',
      description: 'Steep angle smash power racket used by Hideki Hayashi. Rotational Generator System for explosive power. Nanomesh Neo + Carbon Nanotube construction for ultra-light strength.',
      shortDescription: 'Yonex Astrox 88D Pro pro smash power with Rotational Generator System.',
      price: 18999,
      originalPrice: 22000,
      thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'],
      category: categoryMap['badminton-rackets'],
      brand: brandMap['yonex'],
      sku: 'YNX-AX88D-PRO',
      stockQuantity: 15,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['badminton', 'racket', 'yonex', 'astrox', 'pro'],
      attributes: new Map([['weight', '4U'], ['flex', 'Stiff'], ['balance', 'Head Heavy'], ['string', 'Pre-strung']]),
      rating: 4.9,
      reviewCount: 78,
    },
    {
      name: 'Yonex Mavis 350 Nylon Shuttlecock (Pack of 6)',
      slug: 'yonex-mavis-350-shuttlecock-6pack',
      description: 'Premium nylon featherless shuttlecock for all-round play. Consistent flight path in medium to cool temperatures. Durable barrel for prolonged play. Recommended for recreational to club-level play.',
      shortDescription: 'Yonex Mavis 350 nylon shuttlecock consistent flight, 6-pack.',
      price: 699,
      originalPrice: 849,
      thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'],
      category: categoryMap['badminton-shuttlecocks'],
      brand: brandMap['yonex'],
      sku: 'YNX-MV350-6',
      stockQuantity: 400,
      inStock: true,
      gstRate: 12,
      isFeatured: false,
      isTrending: false,
      isNewArrival: true,
      isActive: true,
      tags: ['badminton', 'shuttlecock', 'yonex', 'nylon'],
      attributes: new Map([['type', 'Nylon'], ['speed', 'Medium'], ['pack', '6']]),
      rating: 4.4,
      reviewCount: 322,
    },
    // Football
    {
      name: 'Nivia Force Football (Size 5)',
      slug: 'nivia-force-football-size-5',
      description: 'FIFA approved match ball. PU laminated 32-panel design. Latex bladder for consistent bounce and shape retention. Machine stitched for durability. Size 5 official match size.',
      shortDescription: 'FIFA approved 32-panel PU football official match size 5.',
      price: 1299,
      originalPrice: 1699,
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80'],
      category: categoryMap['football-balls'],
      brand: brandMap['nivia'],
      sku: 'NIV-FORCE-FB5',
      stockQuantity: 150,
      inStock: true,
      gstRate: 12,
      isFeatured: false,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['football', 'ball', 'nivia', 'size 5', 'match'],
      attributes: new Map([['size', '5'], ['material', 'PU'], ['panels', '32']]),
      rating: 4.3,
      reviewCount: 198,
    },
    // Hockey
    {
      name: 'Adidas LX Kromaskin Hockey Stick',
      slug: 'adidas-lx-kromaskin-hockey-stick',
      description: 'International grade carbon-fibre composite stick. 95% carbon for maximum power transfer. Mid bow shape for elite drag flick and 3D skills. FIH approved for international play.',
      shortDescription: '95% carbon composite hockey stick FIH approved, mid bow design.',
      price: 9999,
      originalPrice: 13000,
      thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80'],
      category: categoryMap['hockey-sticks'],
      brand: brandMap['adidas'],
      sku: 'ADS-LX-KROM-001',
      stockQuantity: 20,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      isActive: true,
      tags: ['hockey', 'stick', 'adidas', 'carbon', 'international'],
      attributes: new Map([['carbon', '95%'], ['bow', 'Mid'], ['approved', 'FIH']]),
      rating: 4.8,
      reviewCount: 45,
    },
    // Sports Shoes
    {
      name: 'Adidas Cricket 22 Yds Rubber Spikes',
      slug: 'adidas-cricket-22yds-rubber-spikes',
      description: 'Purpose-built cricket shoes with rubber spike sole for all pitches. Lightweight mesh upper for breathability. EVA midsole for cushioning. Non-marking outsole for indoor practice.',
      shortDescription: 'Lightweight cricket spikes with rubber sole all-surface traction.',
      price: 4999,
      originalPrice: 6499,
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
      category: categoryMap['shoes'],
      brand: brandMap['adidas'],
      sku: 'ADS-CR22-SPK-001',
      stockQuantity: 80,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isActive: true,
      tags: ['shoes', 'cricket', 'spikes', 'adidas'],
      attributes: new Map([['sole', 'Rubber'], ['upper', 'Mesh'], ['closure', 'Lace']]),
      rating: 4.6,
      reviewCount: 234,
      variants: [
        { sku: 'ADS-CR22-SPK-7', size: 'UK 7', price: 4999, originalPrice: 6499, stockQuantity: 15 },
        { sku: 'ADS-CR22-SPK-8', size: 'UK 8', price: 4999, originalPrice: 6499, stockQuantity: 20 },
        { sku: 'ADS-CR22-SPK-9', size: 'UK 9', price: 4999, originalPrice: 6499, stockQuantity: 25 },
        { sku: 'ADS-CR22-SPK-10', size: 'UK 10', price: 4999, originalPrice: 6499, stockQuantity: 15 },
        { sku: 'ADS-CR22-SPK-11', size: 'UK 11', price: 4999, originalPrice: 6499, stockQuantity: 5 },
      ],
    },
    // Accessories
    {
      name: 'SG Premium Cricket Kit Bag',
      slug: 'sg-premium-cricket-kit-bag',
      description: 'Full-size cricket kit bag with bat sleeve, multiple compartments for pads, gloves, helmet and ball pouches. Heavy-duty polyester with waterproof base. Padded shoulder straps and trolley sleeve.',
      shortDescription: 'Full-size cricket kit bag with separate bat sleeve and multiple compartments.',
      price: 2999,
      originalPrice: 3999,
      thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
      category: categoryMap['accessories'],
      brand: brandMap['sg-cricket'],
      sku: 'SG-PREM-BAG-001',
      stockQuantity: 55,
      inStock: true,
      gstRate: 18,
      isFeatured: false,
      isTrending: false,
      isNewArrival: true,
      isActive: true,
      tags: ['accessories', 'bag', 'cricket', 'sg', 'kit bag'],
      attributes: new Map([['capacity', 'Full Kit'], ['material', 'Polyester'], ['waterproof', 'Yes']]),
      rating: 4.5,
      reviewCount: 134,
    },
    {
      name: 'Gray-Nicolls Legend English Willow Bat',
      slug: 'gray-nicolls-legend-english-willow-bat',
      description: 'Hand-selected Grade 1 English Willow with natural clefts. Low middle profile for superior control shots. Premium Sarawak cane handle for vibration absorption. For serious club and professional players.',
      shortDescription: 'Grade 1 English Willow with low middle profile pro and club level.',
      price: 10999,
      originalPrice: 13500,
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=600&q=80'],
      category: categoryMap['cricket-bats'],
      brand: brandMap['gray-nicolls'],
      sku: 'GN-LEG-EW-001',
      stockQuantity: 12,
      inStock: true,
      gstRate: 18,
      isFeatured: true,
      isTrending: false,
      isNewArrival: false,
      isActive: true,
      tags: ['cricket', 'bat', 'english willow', 'gray-nicolls', 'professional'],
      attributes: new Map([['grade', 'Grade 1'], ['profile', 'Low Middle'], ['handle', 'Sarawak Cane']]),
      rating: 4.9,
      reviewCount: 56,
    },
  ])
  console.log(`Created ${products.length} products.`)

  // ─── Reviews ─────────────────────────────────────────────────────────
  const reviewData = [
    { product: products[0]._id, user: customer1._id, rating: 5, title: 'Kohli choice for a reason!', body: 'Best bat I have ever used. MRF Genius lives up to the hype completely. Power and control are superb.', isApproved: true },
    { product: products[1]._id, user: customer2._id, rating: 4, title: 'Great value for beginners', body: 'Great starter bat at this price. Kashmir willow quality is good. Highly recommend for beginners.', isApproved: true },
    { product: products[2]._id, user: customer1._id, rating: 4, title: 'Solid mid-range bat', body: 'DSC Pearla Glider is a solid Grade 2 bat. Big sweet spot and good balance. Happy with the purchase.', isApproved: true },
    { product: products[3]._id, user: customer2._id, rating: 5, title: 'Best club ball in the market', body: 'SG leather ball is excellent. Seam stays intact for full 50 overs. Perfect for our club matches.', isApproved: true },
    { product: products[4]._id, user: customer1._id, rating: 5, title: 'Gold standard cricket ball', body: 'Kookaburra is the gold standard. Swings beautifully for the first 15 overs. Worth the price.', isApproved: true },
    { product: products[9]._id, user: customer2._id, rating: 5, title: 'Smash machine!', body: 'Yonex Astrox 88D Pro is a beast. The smash power is unreal. Worth every rupee for serious players.', isApproved: true },
    { product: products[8]._id, user: customer1._id, rating: 5, title: 'Premium quality jersey', body: 'Team India jersey feels premium. Dri-Fit really works during intense matches. Fits perfectly.', isApproved: true },
    { product: products[6]._id, user: customer2._id, rating: 4, title: 'Excellent protection', body: 'SS Matrix helmet gives excellent protection. Steel grill is solid. Would recommend to any batsman.', isApproved: true },
  ]

  await Review.create(reviewData)
  console.log(`Created ${reviewData.length} reviews.`)

  // ─── Coupons ─────────────────────────────────────────────────────────
  await Coupon.create([
    {
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      minOrderAmount: 1000,
      maxDiscount: 500,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'CRICKET500',
      type: 'fixed',
      value: 500,
      minOrderAmount: 3000,
      applicableCategories: [categoryMap['cricket']],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'FLAT10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 500,
      maxDiscount: 300,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: 2000,
      isActive: true,
    },
    {
      code: 'FIRSTORDER',
      type: 'fixed',
      value: 200,
      minOrderAmount: 799,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 5000,
      isActive: true,
    },
  ])
  console.log('Created 4 coupons.')

  console.log('\n✅ Seed complete!')
  console.log('─────────────────────────────────────')
  console.log('Admin login:    admin@gabbarsports.in / Admin@123')
  console.log('Customer 1:     rahul@example.com / Customer@123')
  console.log('Customer 2:     priya@example.com / Customer@123')
  console.log('─────────────────────────────────────')
  console.log(`Categories: ${categories.length + cricketSubs.length + footballSubs.length + badmintonSubs.length + hockeySubs.length}`)
  console.log(`Brands:     ${brands.length}`)
  console.log(`Products:   ${products.length}`)
  console.log(`Coupons:    4`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
