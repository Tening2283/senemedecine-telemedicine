const knex = require('knex');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    console.log('Configuration:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
    
    const db = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'senemedecine',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'azerty',
      }
    });
    
    // Test de connexion
    const result = await db.raw('SELECT 1 as test');
    console.log('✅ Connexion réussie:', result.rows[0]);
    
    // Test des tables
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tables disponibles:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Test des utilisateurs
    const users = await db('users').select('email', 'role').limit(3);
    console.log('👥 Utilisateurs de test:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    await db.destroy();
    console.log('✅ Test terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Détails:', error);
  }
}

testConnection(); 