import Sweet from '../models/Sweet.js';


export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

    if (sweet.inStock == false) {
      return res.status(400).json({ message: 'Sweet out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.status(200).json({ message: 'Sweet purchased successfully', sweet });
  } catch (error) {
    console.error('Error purchasing sweet:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const restockSweet = async (req, res) => {
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({ message: 'Sweet restocked successfully', sweet });
  } catch (error) {
    console.error('Error restocking sweet:', error);
    res.status(500).json({ error: 'Server error' });
  }
};