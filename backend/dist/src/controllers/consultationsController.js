"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConsultation = exports.updateConsultation = exports.createConsultation = exports.getConsultationById = exports.getConsultations = void 0;
const connection_1 = require("../database/connection");
const getConsultations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const hopitalId = req.query.hopital_id;
        const offset = (page - 1) * limit;
        let query = (0, connection_1.db)('consultations').select('*');
        if (hopitalId) {
            query = query.where({ hopital_id: hopitalId });
        }
        const consultations = await query.limit(limit).offset(offset);
        const total = await (0, connection_1.db)('consultations').count('* as count').first();
        const totalCount = total ? parseInt(total.count) : 0;
        const response = {
            success: true,
            data: {
                data: consultations,
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
        console.error('Erreur lors de la récupération des consultations:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getConsultations = getConsultations;
const getConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await (0, connection_1.db)('consultations').where({ id }).first();
        if (!consultation) {
            res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
            return;
        }
        const response = {
            success: true,
            data: consultation
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getConsultationById = getConsultationById;
const createConsultation = async (req, res) => {
    try {
        const consultationData = req.body;
        const [newConsultation] = await (0, connection_1.db)('consultations')
            .insert(consultationData)
            .returning('*');
        res.status(201).json({
            success: true,
            data: newConsultation
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.createConsultation = createConsultation;
const updateConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const [consultation] = await (0, connection_1.db)('consultations')
            .where({ id })
            .update(updateData)
            .returning('*');
        if (!consultation) {
            res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
            return;
        }
        res.json({
            success: true,
            data: consultation
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.updateConsultation = updateConsultation;
const deleteConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, connection_1.db)('consultations').where({ id }).del();
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: 'Consultation non trouvée'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Consultation supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.deleteConsultation = deleteConsultation;
//# sourceMappingURL=consultationsController.js.map