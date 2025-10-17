// Script de prueba para verificar la API
const axios = require('axios');

const baseURL = 'http://localhost:8080/api/v1';

async function testAPI() {
  console.log('🔄 Probando conectividad con la API...');
  
  try {
    // Probar registro
    console.log('\n📝 Probando registro...');
    const registerResponse = await axios.post(`${baseURL}/auth/register`, {
      name: 'Usuario Test',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('✅ Registro exitoso:', registerResponse.data);
    
    // Probar login
    console.log('\n🔐 Probando login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: registerResponse.data.email,
      password: 'password123'
    });
    console.log('✅ Login exitoso:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
