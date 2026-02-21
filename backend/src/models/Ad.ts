import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
    title: string;
    description: string;
    category: string;
    subCategory: string;
    province: string;
    city: string;
    priceType: 'fixed' | 'negotiable' | 'on_request' | 'free';
    price?: number;
    delivery: {
        available: boolean;
        national: boolean;
        included: boolean;
    };
    condition?: 'new' | 'used' | 'refurbished';
    sellerId: mongoose.Schema.Types.ObjectId;
    attributes: Record<string, any>;
    images: { url: string; key: string }[];
    status: 'active' | 'pending' | 'removed' | 'sold';
    promoted: boolean;
    promotedUntil?: Date;
}

const AdSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true, index: true },
        subCategory: { type: String, required: true, index: true },
        province: { type: String, required: true, index: true },
        city: { type: String, required: true, index: true },
        priceType: {
            type: String,
            enum: ['fixed', 'negotiable', 'on_request', 'free'],
            required: true,
            index: true,
        },
        price: { type: Number },
        delivery: {
            available: { type: Boolean, default: false },
            national: { type: Boolean, default: false },
            included: { type: Boolean, default: false },
        },
        condition: { type: String, enum: ['new', 'used', 'refurbished'] },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        attributes: { type: Schema.Types.Mixed, default: {} },
        images: [{ url: String, key: String }],
        status: {
            type: String,
            enum: ['active', 'pending', 'removed', 'sold'],
            default: 'active',
            index: true,
        },
        promoted: { type: Boolean, default: false, index: true },
        promotedUntil: { type: Date },
    },
    { timestamps: true }
);

// Indexes for Search & Filtering
AdSchema.index({ status: 1, createdAt: -1 });                                      // Default home query
AdSchema.index({ status: 1, promoted: 1, createdAt: -1 });                         // Flash deals query
AdSchema.index({ category: 1, subCategory: 1, province: 1, city: 1, createdAt: -1 });
AdSchema.index({ province: 1, city: 1, priceType: 1, price: 1 });
AdSchema.index({ subCategory: 1, city: 1, createdAt: -1 });                        // Similar ads
AdSchema.index({ title: 'text', description: 'text' });                            // Text search

export default mongoose.model<IAd>('Ad', AdSchema);
