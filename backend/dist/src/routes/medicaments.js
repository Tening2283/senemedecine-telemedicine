"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => {
    res.json({ success: true, message: 'Médicaments - Route à implémenter' });
});
router.post('/', (0, auth_1.authorizeRoles)('MEDECIN', 'ADMIN'), (req, res) => {
    res.json({ success: true, message: 'Créer médicament - Route à implémenter' });
});
exports.default = router;
//# sourceMappingURL=medicaments.js.map