import Asset from "../models/Asset.js";

export const summary = async (req, res, next) => {
  try {
    const [total, available, inUse, maintenance] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ assetStatus: "Available" }),
      Asset.countDocuments({ assetStatus: "In Use" }),
      Asset.countDocuments({ assetStatus: "Under Maintenance" })
    ]);

    res.json({ total, available, inUse, maintenance });
  } catch (error) {
    next(error);
  }
};

export const categoryDistribution = async (req, res, next) => {
  try {
    const data = await Asset.aggregate([
      { $group: { _id: "$assetCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(data.map(item => ({
      category: item._id,
      count: item.count
    })));
  } catch (error) {
    next(error);
  }
};
