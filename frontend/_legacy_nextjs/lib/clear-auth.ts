// Utilidad para limpiar completamente el almacenamiento de autenticación
// Ejecuta este script en la consola del navegador si tienes problemas con tokens

export function clearAllAuthStorage() {
  console.log('🧹 Limpiando todo el almacenamiento de autenticación...');
  
  // Limpiar localStorage
  localStorage.removeItem('auth-storage');
  
  // Limpiar sessionStorage
  sessionStorage.removeItem('auth-storage');
  
  // Limpiar todas las cookies relacionadas con auth
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('✅ Almacenamiento limpiado completamente');
  console.log('🔄 Recarga la página para aplicar los cambios');
}

// Para usar en la consola del navegador:
// clearAllAuthStorage(); location.reload();
