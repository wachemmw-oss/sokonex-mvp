import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Ad from '../models/Ad';
import { cache } from '../utils/cache';

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Private (Phone Verified)
export const createAd = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authorized' } });

        if (!user.isPhoneVerified) {
            return res.status(403).json({ success: false, error: { code: 'PHONE_NOT_VERIFIED', message: 'Phone verification required' } });
        }

        const {
            title, description, category, subCategory, province, city,
            priceType, price, delivery, condition, attributes, images
        } = req.body;

        // Basic validation could be improved with Zod
        if (!title || !description || !category || !subCategory || !province || !city || !priceType) {
            return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } });
        }

        if ((priceType === 'fixed' || priceType === 'negotiable') && !price) {
            return res.status(400).json({ success: false, error: { code: 'PRICE_REQUIRED', message: 'Price is required for this price type' } });
        }

        const ad = await Ad.create({
            sellerId: user._id as any,
            title,
            description,
            category,
            subCategory,
            province,
            city,
            priceType,
            price,
            delivery,
            condition,
            attributes,
            images,
            status: 'active'
        });

        // Invalidate all ads cache so new ad appears immediately
        cache.invalidatePrefix('ads:');

        res.status(201).json({ success: true, data: ad });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Get ads with filters, search, and facets
// @route   GET /api/ads
// @access  Public
export const getAds = async (req: Request, res: Response) => {
    try {
        // Build cache key from all query params
        const cacheKey = 'ads:' + JSON.stringify(req.query);
        const cached = cache.get(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }

        const {
            q, category, subCategory, province, city,
            priceType, min, max, delivery, condition, sellerType,
            sort, page = 1, limit = 24,
            ...others
        } = req.query;

        const query: any = { status: 'active' };

        // Search
        if (q) {
            // Simple regex for MVP, better use text index if configured
            query.$text = { $search: q as string };
            // Fallback or combination? Strict text search is better for performance than regex on large datasets
        }

        // Filters
        if (req.query.sellerId) query.sellerId = req.query.sellerId;
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (province) query.province = province;
        if (city) query.city = city;
        if (priceType) query.priceType = priceType;
        if (condition) query.condition = condition;

        // Delivery
        if (delivery === '1') query['delivery.available'] = true;

        // Promoted
        if (req.query.promoted) {
            query.promoted = req.query.promoted === 'true';
        }

        // Price Range
        // “Gratuit” => priceType=free, “Sur demande” => on_request
        if (min || max) {
            query.priceType = { $in: ['fixed', 'negotiable'] }; // Only these have numeric price relevant for range
            query.price = {};
            if (min) query.price.$gte = Number(min);
            if (max) query.price.$lte = Number(max);
        }

        // Dynamic Attributes (attr_*)
        // Need to parse keys starting with attr_
        Object.keys(others).forEach(key => {
            if (key.startsWith('attr_')) {
                const attrKey = key.replace('attr_', '');
                // Simple equality check for now. Range query for attrs would require more parsing logic
                query[`attributes.${attrKey}`] = others[key];
            }
        });

        // Pagination
        const pageNum = Number(page) || 1;
        const limitNum = Math.min(Number(limit) || 24, 50);
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        let sortOptions: any = { createdAt: -1 }; // Default new
        if (sort === 'price_asc') sortOptions = { price: 1 };
        if (sort === 'price_desc') sortOptions = { price: -1 };
        // if sort === 'newest' (default)

        // Execute Main Query — parallel for speed
        const [total, ads] = await Promise.all([
            Ad.countDocuments(query),
            Ad.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .select('title price priceType images city province subCategory condition promoted createdAt sellerId')
                .populate('sellerId', 'name avatar badge')
        ]);

        // Facets (Aggregation for counts)
        // We want facets for the CURRENT query context usually, OR for the category context?
        // Standard is: facets reflect what's available given current filters (narrowing) OR
        // all available within the current category (filtering within category).
        // Let's go with narrowing for simplicity and accuracy.

        // Aggregation pipeline for facets
        // We can run parallel queries or one big aggregation using $facet
        // $facet is efficient but requires re-matching.

        const facetsPipeline = [
            { $match: query },
            {
                $facet: {
                    subCategories: [{ $group: { _id: "$subCategory", count: { $sum: 1 } } }],
                    delivery: [{ $match: { "delivery.available": true } }, { $count: "count" }],
                    // sellerType needs lookup or embedding. Since we populated, we can't easily aggregate on referenced field without generic $lookup
                    // Skipping sellerType facet for MVP if it complicates query performance too much without denormalization
                    // But we can verify strict instruction requirements
                }
            }
        ];

        // For price ranges, it's fixed buckets usually.
        // 0-5, 5-10, 10-20, ...

        const response = {
            success: true,
            data: {
                items: ads,
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            },
            facets: { subCategories: [] }
        };

        // Store in cache — 90 sec TTL (fresh enough, fast enough)
        cache.set(cacheKey, response, 90);

        res.setHeader('X-Cache', 'MISS');
        res.json(response);

    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Get single ad
// @route   GET /api/ads/:id
export const getAdById = async (req: Request, res: Response) => {
    try {
        const cacheKey = `ad:${req.params.id}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }

        // FIX: added 'name' and 'avatar' which were missing — that's why seller name/photo didn't show
        const ad = await Ad.findById(req.params.id)
            .populate('sellerId', 'name avatar badge email phone whatsapp showPhone isPhoneVerified role createdAt');
        if (!ad) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });

        const adObj = ad.toObject();
        const seller = adObj.sellerId as any;
        if (seller) {
            if (!seller.showPhone || !seller.isPhoneVerified) {
                seller.phone = null;
                seller.whatsapp = null;
            }
        }

        const response = { success: true, data: adObj };
        cache.set(cacheKey, response, 60); // 60 sec TTL
        res.setHeader('X-Cache', 'MISS');
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
}

// @desc    Get similar ads
// @route   GET /api/ads/:id/similar
export const getSimilarAds = async (req: Request, res: Response) => {
    try {
        const currentAd = await Ad.findById(req.params.id);
        if (!currentAd) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });

        const limit = Number(req.query.limit) || 8;

        // Anti-bug similar logic:
        // 1. Same subCategory + Same City
        // 2. Same subCategory + Same Province
        // 3. Same Category

        let similar = await Ad.find({
            _id: { $ne: currentAd._id },
            subCategory: currentAd.subCategory,
            city: currentAd.city,
            status: 'active'
        }).limit(limit);

        if (similar.length < limit) {
            const more = await Ad.find({
                _id: { $ne: currentAd._id, $nin: similar.map(a => a._id) },
                subCategory: currentAd.subCategory,
                province: currentAd.province,
                status: 'active'
            }).limit(limit - similar.length);
            similar = [...similar, ...more];
        }

        if (similar.length < limit) {
            const evenMore = await Ad.find({
                _id: { $ne: currentAd._id, $nin: similar.map(a => a._id) },
                category: currentAd.category,
                status: 'active'
            }).select('title price priceType images city subCategory condition createdAt')
                .limit(limit - similar.length);
            similar = [...similar, ...evenMore];
        }

        // FIX: wrap in {items:...} to match frontend's similarData?.data?.items access pattern
        const response = { success: true, data: { items: similar } };
        cache.set(`similar:${req.params.id}`, response, 120); // 2 min TTL
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
}

// @desc    Get my ads
// @route   GET /api/ads/mine
export const getMyAds = async (req: Request, res: Response) => {
    try {
        const ads = await Ad.find({ sellerId: req.user!._id as any }).sort({ createdAt: -1 });
        res.json({ success: true, data: ads });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
}

// @desc    Delete ad
// @route   DELETE /api/ads/:id
export const deleteAd = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });

        if (ad.sellerId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } });
        }

        await ad.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private (Owner or Admin)
export const updateAd = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ad not found' } });

        if (ad.sellerId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to edit this ad' } });
        }

        const {
            title, description, category, subCategory, province, city,
            priceType, price, delivery, condition, attributes, images
        } = req.body;

        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.category = category || ad.category;
        ad.subCategory = subCategory || ad.subCategory;
        ad.province = province || ad.province;
        ad.city = city || ad.city;
        ad.priceType = priceType || ad.priceType;
        ad.price = price !== undefined ? price : ad.price;
        ad.delivery = delivery || ad.delivery;
        ad.condition = condition || ad.condition;
        ad.attributes = attributes || ad.attributes;
        ad.images = images || ad.images;

        const updatedAd = await ad.save();
        res.json({ success: true, data: updatedAd });
    } catch (error: any) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
    }
};
