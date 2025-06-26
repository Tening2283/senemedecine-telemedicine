"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHopital = exports.updateHopital = exports.createHopital = exports.getHopitalById = exports.getAllHopitaux = void 0;
const connection_1 = require("../database/connection");
const getAllHopitaux = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const [hopitaux, total] = await Promise.all([
            (0, connection_1.db)('hopitaux')
                .select('*')
                .orderBy('nom')
                .limit(limit)
                .offset(offset),
            (0, connection_1.db)('hopitaux').count('* as count').first()
        ]);
        const totalCount = total.count;
        const totalPages = Math.ceil(totalCount / limit);
        const response = {
            success: true,
            data: {
                data: hopitaux,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages
                }
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des hôpitaux:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getAllHopitaux = getAllHopitaux;
const getHopitalById = async (req, res) => {
    try {
        const { id } = req.params;
        const hopital = await (0, connection_1.db)('hopitaux')
            .where({ id, actif: true })
            .first();
        if (!hopital) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            data: hopital
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'hôpital:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getHopitalById = getHopitalById;
const createHopital = async (req, res) => {
    try {
        const hopitalData = req.body;
        if (!hopitalData.nom || !hopitalData.adresse || !hopitalData.telephone || !hopitalData.email || !hopitalData.ville) {
            res.status(400).json({
                success: false,
                error: 'Tous les champs obligatoires doivent être remplis'
            });
            return;
        }
        const existingHopital = await (0, connection_1.db)('hopitaux')
            .where({ email: hopitalData.email })
            .first();
        if (existingHopital) {
            res.status(400).json({
                success: false,
                error: 'Un hôpital avec cet email existe déjà'
            });
            return;
        }
        const [newHopital] = await (0, connection_1.db)('hopitaux')
            .insert(hopitalData)
            .returning('*');
        res.status(201).json({
            success: true,
            data: newHopital,
            message: 'Hôpital créé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'hôpital:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.createHopital = createHopital;
const updateHopital = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const existingHopital = await (0, connection_1.db)('hopitaux')
            .where({ id })
            .first();
        if (!existingHopital) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé'
            });
            return;
        }
        if (updateData.email && updateData.email !== existingHopital.email) {
            const emailExists = await (0, connection_1.db)('hopitaux')
                .where({ email: updateData.email })
                .whereNot({ id })
                .first();
            if (emailExists) {
                res.status(400).json({
                    success: false,
                    error: 'Un hôpital avec cet email existe déjà'
                });
                return;
            }
        }
        const [updatedHopital] = await (0, connection_1.db)('hopitaux')
            .where({ id })
            .update({
            ...updateData,
            updated_at: new Date()
        })
            .returning('*');
        if (!updatedHopital) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            data: updatedHopital,
            message: 'Hôpital mis à jour avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'hôpital:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.updateHopital = updateHopital;
const deleteHopital = async (req, res) => {
    try {
        const { id } = req.params;
        const existingHopital = await (0, connection_1.db)('hopitaux')
            .where({ id })
            .first();
        if (!existingHopital) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé'
            });
            return;
        }
        const [usersCount, patientsCount] = await Promise.all([
            (0, connection_1.db)('users').where({ hopital_id: id }).count('* as count').first(),
            (0, connection_1.db)('patients').where({ hopital_id: id }).count('* as count').first()
        ]);
        if (usersCount.count > 0 || patientsCount.count > 0) {
            res.status(400).json({
                success: false,
                error: 'Impossible de supprimer l\'hôpital car il a des utilisateurs ou patients associés'
            });
            return;
        }
        const deletedCount = await (0, connection_1.db)('hopitaux')
            .where({ id })
            .update({ actif: false });
        if (deletedCount === 0) {
            res.status(404).json({
                success: false,
                error: 'Hôpital non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Hôpital supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'hôpital:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.deleteHopital = deleteHopital;
//# sourceMappingURL=hopitauxController.js.map