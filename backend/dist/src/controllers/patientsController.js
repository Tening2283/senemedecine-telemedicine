"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientById = exports.getPatients = void 0;
const connection_1 = require("../database/connection");
const getPatients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const hopitalId = req.query.hopital_id;
        const offset = (page - 1) * limit;
        let query = (0, connection_1.db)('patients').select('*');
        if (hopitalId) {
            query = query.where({ hopital_id: hopitalId });
        }
        const patients = await query.limit(limit).offset(offset);
        const total = await (0, connection_1.db)('patients').count('* as count').first();
        const totalCount = total ? parseInt(total.count) : 0;
        const response = {
            success: true,
            data: {
                data: patients,
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
        console.error('Erreur lors de la récupération des patients:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getPatients = getPatients;
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await (0, connection_1.db)('patients').where({ id }).first();
        if (!patient) {
            res.status(404).json({
                success: false,
                error: 'Patient non trouvé'
            });
            return;
        }
        const response = {
            success: true,
            data: patient
        };
        res.json(response);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du patient:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.getPatientById = getPatientById;
const createPatient = async (req, res) => {
    try {
        const patientData = req.body;
        const [newPatient] = await (0, connection_1.db)('patients').insert(patientData).returning('*');
        res.status(201).json({
            success: true,
            data: newPatient
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du patient:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const [patient] = await (0, connection_1.db)('patients')
            .where({ id })
            .update(updateData)
            .returning('*');
        if (!patient) {
            res.status(404).json({
                success: false,
                error: 'Patient non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            data: patient
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du patient:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, connection_1.db)('patients').where({ id }).del();
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: 'Patient non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Patient supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
};
exports.deletePatient = deletePatient;
//# sourceMappingURL=patientsController.js.map