"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRendezVous = exports.updateRendezVous = exports.createRendezVous = exports.getRendezVousById = exports.getRendezVous = void 0;
const connection_1 = require("../database/connection");
const getRendezVous = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const hopitalId = req.query.hopital_id;
        const offset = (page - 1) * limit;
        let query = (0, connection_1.db)('rendez_vous').select('*');
        if (hopitalId) {
            query = query.where({ hopital_id: hopitalId });
        }
        const rendezVous = await query.limit(limit).offset(offset);
        const total = await (0, connection_1.db)('rendez_vous').count('* as count').first();
        const totalCount = total ? parseInt(total.count) : 0;
        const response = {
            success: true,
            data: {
                data: rendezVous,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getRendezVous = getRendezVous;
const getRendezVousById = async (req, res) => {
    try {
        const { id } = req.params;
        const rendezVous = await (0, connection_1.db)('rendez_vous').where({ id }).first();
        if (!rendezVous) {
            res.status(404).json({
                success: false,
                error: 'Rendez-vous non trouvé'
            });
            return;
        }
        const response = {
            success: true,
            data: rendezVous
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getRendezVousById = getRendezVousById;
const createRendezVous = async (req, res) => {
    try {
        const rendezVousData = req.body;
        const [rendezVous] = await (0, connection_1.db)('rendez_vous').insert(rendezVousData).returning('*');
        const response = {
            success: true,
            data: rendezVous
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.createRendezVous = createRendezVous;
const updateRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const [rendezVous] = await (0, connection_1.db)('rendez_vous')
            .where({ id })
            .update(updateData)
            .returning('*');
        if (!rendezVous) {
            res.status(404).json({
                success: false,
                error: 'Rendez-vous non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            data: rendezVous
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du rendez-vous:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.updateRendezVous = updateRendezVous;
const deleteRendezVous = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, connection_1.db)('rendez_vous').where({ id }).del();
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: 'Rendez-vous non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Rendez-vous supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du rendez-vous:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.deleteRendezVous = deleteRendezVous;
//# sourceMappingURL=rendezVousController.js.map