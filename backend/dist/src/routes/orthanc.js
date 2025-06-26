"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.get('/system', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/system`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Erreur Orthanc", details: err.message });
    }
});
router.get('/studies', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/studies`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Erreur Orthanc", details: err.message });
    }
});
router.get('/studies/:id', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/studies/${req.params.id}`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Erreur Orthanc", details: err.message });
    }
});
router.get('/instances/:id/preview', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/instances/${req.params.id}/preview`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
            responseType: 'arraybuffer'
        });
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Erreur Orthanc", details: err.message });
    }
});
router.get('/studies/:id/series', async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/studies/${req.params.id}/series`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: "Erreur Orthanc", details: err.message });
    }
});
router.get('/series/:id/instances', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios_1.default.get(`${process.env.ORTHANC_URL}/series/${id}/instances`, {
            auth: {
                username: process.env.ORTHANC_USER || 'orthanc',
                password: process.env.ORTHANC_PASS || 'orthanc',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(404).json({ success: false, error: "Instances non trouvées" });
    }
});
exports.default = router;
//# sourceMappingURL=orthanc.js.map