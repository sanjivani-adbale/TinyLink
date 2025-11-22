require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./config/database');
const Link = require('./models/Link');         
const linkRoutes = require('./routes/linkRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes 
app.use('/api', linkRoutes);


app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});


app.get('/test', (req, res) => {
  res.send('API Working');
});


app.get('/r/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { code } });

    if (!link) return res.status(404).send('Link not found');

    link.clicks = (link.clicks || 0) + 1;
    link.last_clicked_at = new Date();
    await link.save();

    return res.redirect(link.target_url);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).send('Server error');
  }
});


app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


(async () => {
  try {
    
    await sequelize.authenticate();
    console.log('Database connection authenticated.');

    
    await sequelize.sync();
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB error:', err);
    process.exit(1); 
  }
})();
