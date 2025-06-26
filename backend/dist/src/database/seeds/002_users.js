"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seed(knex) {
    await knex('users').del();
    const passwordHash = await bcryptjs_1.default.hash('password123', 12);
    await knex('users').insert([
        {
            id: '550e8400-e29b-41d4-a716-446655440101',
            email: 'admin@senemedecine.sn',
            nom: 'Diop',
            prenom: 'Aminata',
            role: 'ADMIN',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            telephone: '+221 77 123 45 67',
            password_hash: passwordHash
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440102',
            email: 'dr.fall@hopital-dakar.sn',
            nom: 'Fall',
            prenom: 'Mamadou',
            role: 'MEDECIN',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            telephone: '+221 76 987 65 43',
            specialite: 'Cardiologie',
            password_hash: passwordHash
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440103',
            email: 'sec.ndiaye@hopital-dakar.sn',
            nom: 'Ndiaye',
            prenom: 'Fatou',
            role: 'SECRETAIRE',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            telephone: '+221 78 456 78 90',
            password_hash: passwordHash
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440104',
            email: 'patient.sow@email.sn',
            nom: 'Sow',
            prenom: 'Ibrahima',
            role: 'PATIENT',
            hopital_id: '550e8400-e29b-41d4-a716-446655440001',
            telephone: '+221 77 654 32 10',
            password_hash: passwordHash
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440105',
            email: 'dr.ba@ch-stlouis.sn',
            nom: 'Ba',
            prenom: 'Aïssatou',
            role: 'MEDECIN',
            hopital_id: '550e8400-e29b-41d4-a716-446655440002',
            telephone: '+221 76 111 22 33',
            specialite: 'Radiologie',
            password_hash: passwordHash
        }
    ]);
}
//# sourceMappingURL=002_users.js.map