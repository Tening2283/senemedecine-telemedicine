"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultationsController_1 = require("../controllers/consultationsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', consultationsController_1.getConsultations);
router.get('/:id', consultationsController_1.getConsultationById);
router.post('/', (0, auth_1.authorizeRoles)('MEDECIN', 'ADMIN'), consultationsController_1.createConsultation);
router.put('/:id', (0, auth_1.authorizeRoles)('MEDECIN', 'ADMIN'), consultationsController_1.updateConsultation);
router.delete('/:id', (0, auth_1.authorizeRoles)('ADMIN'), consultationsController_1.deleteConsultation);
exports.default = router;
//# sourceMappingURL=consultations.js.map