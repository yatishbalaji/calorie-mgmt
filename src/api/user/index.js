const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/intake', authenticate, controller.getIntakes);

router.put('/setting', authenticate, controller.updateSetting);
router.put('/intake/:id', authenticate, controller.updateIntake);

router.post('/', controller.create);
router.post('/login', controller.login);
router.post('/intake', authenticate, controller.addIntake);

router.delete('/intake/:id', authenticate, controller.deleteIntake);

module.exports = router;
