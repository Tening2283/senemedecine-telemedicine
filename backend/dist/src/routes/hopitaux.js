"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hopitauxController_1 = require("../controllers/hopitauxController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', hopitauxController_1.getAllHopitaux);
router.get('/:id', hopitauxController_1.getHopitalById);
router.use(auth_1.authenticateToken);
router.post('/', (0, auth_1.authorizeRoles)('ADMIN'), hopitauxController_1.createHopital);
router.put('/:id', (0, auth_1.authorizeRoles)('ADMIN'), hopitauxController_1.updateHopital);
router.delete('/:id', (0, auth_1.authorizeRoles)('ADMIN'), hopitauxController_1.deleteHopital);
exports.default = router;
//# sourceMappingURL=hopitaux.js.map