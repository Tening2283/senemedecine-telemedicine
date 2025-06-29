"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const hopitaux_1 = __importDefault(require("./routes/hopitaux"));
const patients_1 = __importDefault(require("./routes/patients"));
const consultations_1 = __importDefault(require("./routes/consultations"));
const rendez_vous_1 = __importDefault(require("./routes/rendez-vous"));
const medicaments_1 = __importDefault(require("./routes/medicaments"));
const orthanc_1 = __importDefault(require("./routes/orthanc"));
const users_1 = __importDefault(require("./routes/users"));
const consultation_dicom_1 = __importDefault(require("./routes/consultation-dicom"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        error: 'Trop de requêtes, veuillez réessayer plus tard'
    }
});
app.use(limiter);
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', auth_1.default);
app.use('/api/hopitaux', hopitaux_1.default);
app.use('/api/patients', patients_1.default);
app.use('/api/consultations', consultations_1.default);
app.use('/api/rendez-vous', rendez_vous_1.default);
app.use('/api/medicaments', medicaments_1.default);
app.use('/api/orthanc', orthanc_1.default);
app.use('/api/users', users_1.default);
app.use('/api/consultation-dicom', consultation_dicom_1.default);
app.use('/api/ai', ai_1.default);
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API SeneMedecine opérationnelle',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});
app.use((error, req, res, next) => {
    console.error('Erreur non gérée:', error);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Erreur interne du serveur'
            : error.message
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Serveur SeneMedecine démarré sur le port ${PORT}`);
    console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🏥 API Health: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map