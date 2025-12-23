const express = require('express');
const Category = require('../models/Category');
const { createSlug } = require('../utils/helpers');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true
    }).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (Admin only)
router.post('/', auth, authorize('admin'), upload.single('categoryImage'), async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    
    const slug = createSlug(name);
    const image = req.file ? `/${req.file.path}` : '';

    const category = new Category({
      name,
      slug,
      description,
      image,
      parent: parent || null
    });

    await category.save();
    await category.populate('parent', 'name slug');

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category (Admin only)
router.put('/:id', auth, authorize('admin'), upload.single('categoryImage'), async (req, res) => {
  try {
    const { name, description, parent, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name !== category.name) {
      category.slug = createSlug(name);
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.parent = parent || category.parent;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    if (req.file) {
      category.image = `/${req.file.path}`;
    }

    await category.save();
    await category.populate('parent', 'name slug');

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete category (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.isActive = false;
    await category.save();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
