"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeHospital = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Token d\'accès requis'
        });
        return;
    }
    try {
        const jwtSecret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({
            success: false,
            error: 'Token invalide'
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Utilisateur non authentifié'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Accès non autorisé'
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const authorizeHospital = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Utilisateur non authentifié'
        });
        return;
    }
    if (req.user.role === 'ADMIN') {
        next();
        return;
    }
    const hopitalId = req.params.hopitalId || req.body.hopital_id;
    if (req.user.hopital_id !== hopitalId) {
        res.status(403).json({
            success: false,
            error: 'Accès non autorisé à cet hôpital'
        });
        return;
    }
    next();
};
exports.authorizeHospital = authorizeHospital;
//# sourceMappingURL=auth.js.map