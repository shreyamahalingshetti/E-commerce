const express = require('express');
const router = express.Router();
const { listUsers, updateRole } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);
router.use(roleGuard('admin'));

router.get('/', listUsers);
router.put('/:id/role', updateRole);

module.exports = router;
