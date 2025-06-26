"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientsController_1 = require("../controllers/patientsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', patientsController_1.getPatients);
router.get('/:id', patientsController_1.getPatientById);
router.post('/', (0, auth_1.authorizeRoles)('MEDECIN', 'SECRETAIRE', 'ADMIN'), patientsController_1.createPatient);
router.put('/:id', (0, auth_1.authorizeRoles)('MEDECIN', 'SECRETAIRE', 'ADMIN'), patientsController_1.updatePatient);
router.delete('/:id', (0, auth_1.authorizeRoles)('ADMIN'), patientsController_1.deletePatient);
exports.default = router;
//# sourceMappingURL=patients.js.map