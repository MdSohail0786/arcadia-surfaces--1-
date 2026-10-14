import Product from "../models/Product.js";

// GET /api/products
export async function listProducts(req, res, next) {
  try {
    const {
      collection,
      material,
      category,
      application,
      page = 1,
      limit = 24,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "published" };
    if (collection) query.collectionRef = collection;
    if (material) query.material = material;
    if (category) query.category = category;
    if (application) query.applications = application;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 24));

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("collectionRef", "name slug")
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
      message: "Products retrieved",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/search
export async function searchProducts(req, res, next) {
  try {
    const {
      q,
      collection,
      material,
      category,
      application,
      color,
      page = 1,
      limit = 24,
    } = req.query;

    const query = { status: "published" };
    if (q) query.$text = { $search: String(q) };
    if (collection) query.collectionRef = collection;
    if (material) query.material = material;
    if (category) query.category = category;
    if (application) query.applications = application;
    if (color) query.color = new RegExp(String(color), "i");

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 24));

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("collectionRef", "name slug")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        results: items,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        activeFilters: { q, collection, material, category, application, color },
      },
      message: "Search results",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:slug
export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .populate("collectionRef", "name slug heroImage")
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", errors: [] });
    }

    const related = await Product.find({
      collectionRef: product.collectionRef?._id,
      _id: { $ne: product._id },
      status: "published",
    })
      .limit(4)
      .select("name slug productCode images")
      .lean();

    res.json({
      success: true,
      data: { product, related },
      message: "Product retrieved",
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product, message: "Product created" });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", errors: [] });
    }
    res.json({ success: true, data: product, message: "Product updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", errors: [] });
    }
    res.json({ success: true, data: null, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
