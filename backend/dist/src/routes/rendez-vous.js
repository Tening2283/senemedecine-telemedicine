"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rendezVousController_1 = require("../controllers/rendezVousController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', rendezVousController_1.getRendezVous);
router.get('/:id', rendezVousController_1.getRendezVousById);
router.post('/', (0, auth_1.authorizeRoles)('SECRETAIRE', 'MEDECIN', 'ADMIN'), rendezVousController_1.createRendezVous);
router.put('/:id', (0, auth_1.authorizeRoles)('SECRETAIRE', 'MEDECIN', 'ADMIN'), rendezVousController_1.updateRendezVous);
router.delete('/:id', (0, auth_1.authorizeRoles)('ADMIN'), rendezVousController_1.deleteRendezVous);
exports.default = router;
//# sourceMappingURL=rendez-vous.js.map