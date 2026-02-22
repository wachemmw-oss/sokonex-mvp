import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    phone: string;
    whatsapp?: string;
    avatar?: string;
    showPhone: boolean;
    isPhoneVerified: boolean;
    status: 'active' | 'suspended';
    bio?: string;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, default: 'Utilisateur' }, // Default for existing users
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        phone: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        avatar: { type: String, default: '' },
        showPhone: { type: Boolean, default: true },
        isPhoneVerified: { type: Boolean, default: false },
        status: { type: String, enum: ['active', 'suspended'], default: 'active' },
        bio: { type: String, default: '' },
    },
    { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

UserSchema.pre<IUser>('save', async function (this: IUser) {
    if (!this.isModified('passwordHash')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

export default mongoose.model<IUser>('User', UserSchema);
