const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Link = require('../models/Link');

exports.createLink = async (req, res) => {
  try {
    const { target_url, customCode } = req.body;

    if (!validUrl.isWebUri(target_url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const code = customCode || nanoid(6);

    const existing = await Link.findOne({ where: { code } });
    if (existing) {
      return res.status(409).json({ error: 'Custom code already exists' });
    }

    const link = await Link.create({ code, target_url });
    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.findAll();
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { code } });

    if (!link) return res.status(404).json({ error: 'Link not found' });

    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { code } });

    if (!link) return res.status(404).json({ error: 'Link not found' });

    await link.destroy();
    res.json({ message: 'Link deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
