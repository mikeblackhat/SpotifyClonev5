const { signIn } = require('next-auth/react');

async function testLogin() {
  try {
    console.log('Iniciando prueba de inicio de sesión...');
    
    const result = await signIn('credentials', {
      redirect: false,
      email: 'prueba@example.com',
      password: 'Prueba123',
      callbackUrl: '/',
    });

    console.log('Resultado del inicio de sesión:');
    console.log(result);
    
    if (result?.error) {
      console.error('Error al iniciar sesión:', result.error);
    } else {
      console.log('¡Inicio de sesión exitoso!');
      console.log('Redirigiendo a:', result?.url);
    }
  } catch (error) {
    console.error('Error en la prueba de inicio de sesión:', error);
  }
}

testLogin();
