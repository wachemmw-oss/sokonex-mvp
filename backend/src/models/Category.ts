import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    icon: string;
    subCategories: {
        name: string;
        slug: string;
    }[];
    attributes: {
        id: string;
        label: string;
        type: 'text' | 'select' | 'number' | 'boolean';
        options?: string[];
    }[];
    order: number;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        icon: { type: String, required: true, default: 'MoreHorizontal' },
        subCategories: [{
            name: { type: String, required: true },
            slug: { type: String, required: true }
        }],
        attributes: [{
            id: { type: String, required: true },
            label: { type: String, required: true },
            type: { type: String, enum: ['text', 'select', 'number', 'boolean'], default: 'text' },
            options: [String]
        }],
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
