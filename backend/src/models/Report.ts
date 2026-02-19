import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
    adId: mongoose.Schema.Types.ObjectId;
    reporterUserId?: mongoose.Schema.Types.ObjectId;
    reason: 'scam' | 'prohibited' | 'duplicate' | 'wrong_category' | 'other';
    text?: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

const ReportSchema: Schema = new Schema(
    {
        adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
        reporterUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: {
            type: String,
            enum: ['scam', 'prohibited', 'duplicate', 'wrong_category', 'other'],
            required: true,
        },
        text: { type: String },
        status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    },
    { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
