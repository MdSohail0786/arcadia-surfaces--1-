import Project from "../models/Project.js";

export async function listProjects(req, res, next) {
  try {
    const { category, page = 1, limit = 12, sort = "-year" } = req.query;
    const query = { status: "published" };
    if (category) query.category = category;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));

    const [items, total] = await Promise.all([
      Project.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
      message: "Projects retrieved",
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectBySlug(req, res, next) {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: "published" })
      .populate("relatedCollections", "name slug heroImage")
      .populate("relatedProducts", "name slug images")
      .lean();

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found", errors: [] });
    }

    res.json({ success: true, data: { project }, message: "Project retrieved" });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project, message: "Project created" });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found", errors: [] });
    }
    res.json({ success: true, data: project, message: "Project updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found", errors: [] });
    }
    res.json({ success: true, data: null, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}
