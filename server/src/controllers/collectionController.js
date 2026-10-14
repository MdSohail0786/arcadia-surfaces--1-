import Collection from "../models/Collection.js";
import Product from "../models/Product.js";

// GET /api/collections
export async function listCollections(req, res, next) {
  try {
    const {
      category,
      style,
      material,
      application,
      search,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "published" };
    if (category) query.category = category;
    if (style) query.styles = style;
    if (material) query.materials = material;
    if (application) query.applications = application;
    if (search) query.$text = { $search: String(search) };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));

    const [items, total] = await Promise.all([
      Collection.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Collection.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
      message: "Collections retrieved",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/collections/:slug
export async function getCollectionBySlug(req, res, next) {
  try {
    const collection = await Collection.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
        errors: [],
      });
    }

    const products = await Product.find({
      collectionRef: collection._id,
      status: "published",
    })
      .select("name slug productCode material images tags")
      .lean();

    res.json({
      success: true,
      data: { collection, products },
      message: "Collection retrieved",
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/collections (admin - stubbed auth guard applied at route level)
export async function createCollection(req, res, next) {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({
      success: true,
      data: collection,
      message: "Collection created",
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCollection(req, res, next) {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found", errors: [] });
    }
    res.json({ success: true, data: collection, message: "Collection updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteCollection(req, res, next) {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found", errors: [] });
    }
    res.json({ success: true, data: null, message: "Collection deleted" });
  } catch (err) {
    next(err);
  }
}
