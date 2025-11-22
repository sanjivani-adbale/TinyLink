const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.post('/links', linkController.createLink);
router.get('/links', linkController.getAllLinks);
router.get('/links/:code', linkController.getLink);
router.delete('/links/:code', linkController.deleteLink);

module.exports = router;
