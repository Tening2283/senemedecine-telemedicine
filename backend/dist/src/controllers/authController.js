"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../database/connection");
const login = async (req, res) => {
    try {
        const { email, password, hopital_id } = req.body;
        if (!email || !password || !hopital_id) {
            res.status(400).json({
                success: false,
                error: 'Email, mot de passe et ID hôpital requis'
            });
            return;
        }
        const hopital = await (0, connection_1.db)('hopitaux')
            .where({ id: hopital_id, actif: true })
            .first();
        if (!hopital) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé ou inactif'
            });
            return;
        }
        const user = await (0, connection_1.db)('users')
            .where({ email, hopital_id })
            .first();
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                error: 'Identifiants invalides'
            });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET || 'default-secret';
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            hopital_id: user.hopital_id
        }, jwtSecret, { expiresIn: '24h' });
        const { password_hash, ...userWithoutPassword } = user;
        const response = {
            success: true,
            data: {
                user: userWithoutPassword,
                hopital,
                token
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await (0, connection_1.db)('users')
            .where({ id: userId })
            .first();
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
            return;
        }
        const { password_hash, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map