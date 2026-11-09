HABILITACIÓN DE ROLES MEDIANTE TOKEN

FLUJO DE LAS PROPS HACIA ABAJO

App.jsx
  │ pasa visible_del_padre como prop
  ↓
Header.jsx                     PagesRoutes.jsx
                                   │ pasa visible_del_padre como prop
                                   ↓
                                Protected
                                   │ si el rol está autorizado
                                   ↓
                                Outlet
                                   ↓
                         Página hija correspondiente


FLUJO DE ACTUALIZACIÓN DEL ROL HACIA ARRIBA

App.jsx
  │ pasa setVisible_del_padre como prop
  ↓
PagesRoutes.jsx
  │ pasa la función a LogIn.jsx
  ↓
LogIn.jsx
  │ llama setVisible_del_padre(rol) después de iniciar sesión
  └──────────────────────────────────────────────→ App.jsx actualiza el estado

App.jsx también pasa setVisible_del_padre a PagesRoutes.jsx.
PagesRoutes.jsx lo pasa a LogIn.jsx y Detokenizador.jsx. Cuando Detokenizador
llama setVisible_del_padre(rol), actualiza el estado que pertenece a App.jsx.

La función setter viaja como prop hacia abajo; al llamarla, permite actualizar
el estado de App.jsx. El rol no se pasa directamente hacia arriba.


PERMISOS DE INTERFAZ

Rol             Tienda y compra    ABM productos    ABM usuarios
Cliente         Sí                 No               No
Vendedor        No                 Sí               No
Administrador   No                 No               Sí

Las rutas de login y creación de cuenta son públicas. Protected comprueba el rol
requerido: si no hay sesión, redirige al login; si el rol no corresponde,
redirige a la página asignada a ese rol; si corresponde, Outlet muestra la ruta
hija.


SECUENCIA DE LAS PETICIONES

AL INICIAR O RECARGAR LA APLICACIÓN

1. App.jsx comprueba si hay un token guardado en localStorage.
2. Si hay token, App.jsx llama a obtenerUsuarioActual().
3. obtenerUsuarioActual() envía una petición GET a /api/auth/me con el token.
4. El backend valida el token e identifica al usuario.
5. El backend devuelve los datos del usuario, incluido su rol.
6. App.jsx llama a obtenerRol(usuario) y guarda el rol en su estado.
7. App.jsx pasa el rol actualizado a Header.jsx y PagesRoutes.jsx.
8. Protected usa el rol para permitir el acceso o redirigir.


AL INICIAR SESIÓN

1. LogIn.jsx envía el email y la contraseña al backend.
2. El backend valida las credenciales y devuelve un token.
3. El frontend guarda el token en localStorage.
4. LogIn.jsx llama a obtenerUsuarioActual(), que consulta GET /api/auth/me.
5. El backend valida el token y devuelve los datos del usuario y su rol.
6. LogIn.jsx obtiene el rol con obtenerRol(usuario).
7. LogIn.jsx llama a setVisible_del_padre(rol), actualizando el estado de App.jsx.
8. LogIn.jsx navega a la página correspondiente al rol.


NOTA

Detokenizador.jsx también consulta /me y puede actualizar el rol mediante
setVisible_del_padre. App.jsx ya consulta /me al iniciar la aplicación, por lo
que, en el código actual, puede haber consultas duplicadas cuando Detokenizador
está montado. Detokenizador no decodifica directamente el token: envía el token
al backend y usa los datos que devuelve /me.
