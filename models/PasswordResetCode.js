
import mongoose from 'mongoose';

const passwordResetTokenSchema = mongoose.Schema(
  {
    resetCode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema);
