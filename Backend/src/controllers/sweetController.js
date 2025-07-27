import Sweet from '../models/Sweet';

// Create a sweet
export const createSweet = async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllSweets = async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
};

export const searchSweets = async (req, res) => {
  const { name, category } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };

  const sweets = await Sweet.find(query);
  res.status(200).json(sweets);
};

export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.status(200).json(sweet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};