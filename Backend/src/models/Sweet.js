import mongoose from 'mongoose';


const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String },
  description: { type: String },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Sweet', sweetSchema);
