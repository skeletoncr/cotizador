angular.module("Cotizador", ["ui.bootstrap", "720kb.tooltips","ngRoute", "LocalStorageModule", "mdo-angular-cryptography", "ngMask"])
.config(function($routeProvider, localStorageServiceProvider, $cryptoProvider){
  $routeProvider
    .when("/", {
      controller: "LoginController",
      templateUrl: "app/login/login.html"
    })
    .when("/home", {
      controller: "HomeController",
      templateUrl: "app/home/home.html"
    })
    //ruta de password
    .when("/password", {
      controller: "PasswordController",
      templateUrl: "app/password/password.html"
    })
    //rutas de agencias
    .when("/agencias", {
      controller: "AgenciasController",
      templateUrl: "app/agencias/agencias.html",
      activetab: 'agencias'
    })
    .when("/agregar-agencia", {
      controller: "AgregarAgenciaController",
      templateUrl: "app/agencias/agregarAgencia/agregarAgencia.html",
      activetab: 'agencias'
    })
    .when("/editar-agencia/:idAgencia", {
      controller: "EditarAgenciaController",
      templateUrl: "app/agencias/editarAgencia/editarAgencia.html",
      activetab: 'agencias'
    })
    //rutas de años
    .when("/annos", {
      controller: "AnniosController",
      templateUrl: "app/annios/annios.html",
      activetab: 'annos'
    })
    .when("/agregar-annios", {
      controller: "AgregarAnnioController",
      templateUrl: "app/annios/agregarAnnio/agregarAnnio.html",
      activetab: 'annos'
    })
    .when("/editar-annio/:idAnnio", {
      controller: "EditarAnnioController",
      templateUrl: "app/annios/editarAnnio/editarAnnio.html",
      activetab: 'annos'
    })
    //rutas de bandeja de entrada
    .when("/bandejaentrada", {
      controller: "BandejaController",
      templateUrl: "app/bandejaEntrada/bandeja.html",
      activetab: 'bandejaentrada'
    })
    .when("/detalle-cotizacion/:idCaso", {
      controller: "DetalleController",
      templateUrl: "app/bandejaEntrada/detalleCotizacion/detalle.html",
      activetab: 'bandejaentrada'
    })
    //rutas de bandeja de administrador
    .when("/bandejaadministrador", {
      controller: "BandejaAdministradorController",
      templateUrl: "app/bandejaAdministrador/bandejaAdministrador.html",
      activetab: 'bandejaadministrador'
    })
    .when("/detalle-cotizacion-administrador/:idCaso", {
      controller: "DetalleAdministradorController",
      templateUrl: "app/bandejaAdministrador/detalleCotizacion/detalleAdministrador.html",
      activetab: 'bandejaadministrador'
    })
    //rutas de bandeja de leads
    .when("/bandejaleads", {
      controller: "BandejaLeadsController",
      templateUrl: "app/bandejaLeads/bandejaLeads.html",
      activetab: 'bandejaleads'
    })
    .when("/detalle-cotizacion-leads/:idCaso", {
      controller: "DetalleLeadsController",
      templateUrl: "app/bandejaLeads/detalleCotizacion/detalleLeads.html",
      activetab: 'bandejaleads'
    })
    //rutas de bandeja de vendedor
    .when("/bandejavendedor", {
      controller: "BandejaVendedorController",
      templateUrl: "app/bandejaVendedor/bandejaVendedor.html",
      activetab: 'bandejavendedor'
    })
    .when("/detalle-cotizacion-vendedor/:idCaso", {
      controller: "DetalleVendedorController",
      templateUrl: "app/bandejaVendedor/detalleCotizacion/detalleVendedor.html",
      activetab: 'bandejavendedor'
    })
    //rutas de bonificaciones
    .when("/bonificaciones", {
      controller: "BonificacionesController",
      templateUrl: "app/bonificaciones/bonificaciones.html",
      activetab: 'bonificaciones'
    })
    .when("/agregar-bonificacion", {
      controller: "AgregarBonificacionController",
      templateUrl: "app/bonificaciones/agregarBonificacion/agregarBonificacion.html",
      activetab: 'bonificaciones'
    })
    .when("/editar-bonificacion/:idBonificacion", {
      controller: "EditarBonificacionController",
      templateUrl: "app/bonificaciones/editarBonificacion/editarBonificacion.html",
      activetab: 'bonificaciones'
    })
    //rutas de linea financiera
    .when("/lineafinanciera", {
      controller: "LineaFinancieraController",
      templateUrl: "app/lineaFinanciera/lineaFinanciera.html",
      activetab: 'lineafinanciera'
    })
    .when("/agregar-lineafinanciera", {
      controller: "AgregarLineaFinancieraController",
      templateUrl: "app/lineaFinanciera/agregarLineaFinanciera/agregarLineaFinanciera.html",
      activetab: 'lineafinanciera'
    })
    .when("/editar-lineafinanciera/:idLineaFinanciera", {
      controller: "EditarLineaFinancieraController",
      templateUrl: "app/lineaFinanciera/editarLineaFinanciera/editarLineaFinanciera.html",
      activetab: 'lineafinanciera'
    })
    //rutas de monedas
    .when("/monedas", {
      controller: "MonedasController",
      templateUrl: "app/monedas/monedas.html",
      activetab: 'monedas'
    })
    .when("/agregar-moneda", {
      controller: "AgregarMonedaController",
      templateUrl: "app/monedas/agregarMoneda/agregarMoneda.html",
      activetab: 'monedas'
    })
    .when("/editar-moneda/:idMoneda", {
      controller: "EditarMonedaController",
      templateUrl: "app/monedas/editarMoneda/editarMoneda.html",
      activetab: 'monedas'
    })
    //rutas de producto banco
    .when("/productobanco", {
      controller: "ProductoBancoController",
      templateUrl: "app/productoBanco/productoBanco.html",
      activetab: 'productobanco'
    })
    .when("/agregar-productobanco", {
      controller: "AgregarProductoBancoController",
      templateUrl: "app/productoBanco/agregarProductoBanco/agregarProductoBanco.html",
      activetab: 'productobanco'
    })
    .when("/editar-productobanco/:idProductoBanco", {
      controller: "EditarProductoBancoController",
      templateUrl: "app/productoBanco/editarProductoBanco/editarProductoBanco.html",
      activetab: 'productobanco'
    })
    //rutas de seccion
    .when("/seccion", {
      controller: "SeccionController",
      templateUrl: "app/seccion/seccion.html",
      activetab: 'seccion'
    })
    .when("/agregar-seccion", {
      controller: "AgregarSeccionController",
      templateUrl: "app/seccion/agregarSeccion/agregarSeccion.html",
      activetab: 'seccion'
    })
    .when("/editar-seccion/:idSeccion", {
      controller: "EditarSeccionController",
      templateUrl: "app/seccion/editarSeccion/editarSeccion.html",
      activetab: 'seccion'
    })
    //rutas de seguros
    .when("/seguros", {
      controller: "SegurosController",
      templateUrl: "app/seguros/seguros.html",
      activetab: 'seguros'
    })
    .when("/agregar-seguro", {
      controller: "AgregarSeguroController",
      templateUrl: "app/seguros/agregarSeguro/agregarSeguro.html",
      activetab: 'seguros'
    })
    .when("/editar-seguro/:idSeguro", {
      controller: "EditarSeguroController",
      templateUrl: "app/seguros/editarSeguro/editarSeguro.html",
      activetab: 'seguros'
    })
    //rutas de seguros Leasing
    .when("/segurosLeasing", {
      controller: "SegurosLeasingController",
      templateUrl: "app/segurosLeasing/segurosLeasing.html",
      activetab: 'segurosLeasing'
    })
    .when("/agregar-seguroLeasing", {
      controller: "AgregarSeguroLeasingController",
      templateUrl: "app/segurosLeasing/agregarSeguroLeasing/agregarSeguroLeasing.html",
      activetab: 'segurosLeasing'
    })
    .when("/editar-seguroLeasing/:idSeguroLeasing", {
      controller: "EditarSeguroLeasingController",
      templateUrl: "app/segurosLeasing/editarSeguroLeasing/editarSeguroLeasing.html",
      activetab: 'segurosLeasing'
    })
    //rutas de Sub Aplicacion
    .when("/subaplicacion", {
      controller: "SubAplicacionController",
      templateUrl: "app/subAplicacion/subAplicacion.html",
      activetab: 'subaplicacion'
    })
    .when("/agregar-subaplicacion", {
      controller: "AgregarSubAplicacionController",
      templateUrl: "app/subAplicacion/agregarSubAplicacion/agregarSubAplicacion.html",
      activetab: 'subaplicacion'
    })
    .when("/editar-subaplicacion/:idSubAplicacion", {
      controller: "EditarSubAplicacionController",
      templateUrl: "app/subAplicacion/editarSubAplicacion/editarSubAplicacion.html",
      activetab: 'subaplicacion'
    })
    //rutas de extras
    .when("/extras", {
      controller: "ExtrasController",
      templateUrl: "app/extras/extras.html",
      activetab: 'extras'
    })
    .when("/agregar-extra", {
      controller: "AgregarExtraController",
      templateUrl: "app/extras/agregarExtra/agregarExtra.html",
      activetab: 'extras'
    })
    .when("/editar-extra/:idExtra", {
      controller: "EditarExtraController",
      templateUrl: "app/extras/editarExtra/editarExtra.html",
      activetab: 'extras'
    })
    //rutas de usuarios
    .when("/usuarios", {
      controller: "UsuariosController",
      templateUrl: "app/usuarios/usuarios.html",
      activetab: 'usuarios'
    })
    .when("/agregar-usuario", {
      controller: "AgregarUsuarioController",
      templateUrl: "app/usuarios/agregarUsuario/agregarUsuario.html",
      activetab: 'usuarios'
    })
    .when("/editar-usuario/:idUsuario", {
      controller: "EditarUsuarioController",
      templateUrl: "app/usuarios/editarUsuario/editarUsuario.html",
      activetab: 'usuarios'
    })
     //rutas de roles
    .when("/roles", {
      controller: "RolesController",
      templateUrl: "app/roles/roles.html",
      activetab: 'roles'
    })
    .when("/agregar-rol", {
      controller: "AgregarRolController",
      templateUrl: "app/roles/agregarRol/agregarRol.html",
      activetab: 'roles'
    })
    .when("/editar-rol/:idRol", {
      controller: "EditarRolController",
      templateUrl: "app/roles/editarRol/editarRol.html",
      activetab: 'roles'
    })
    .when("/agregar-usuarios-al-rol/:idRol", {
      controller: "AgregarUsuariosAlRolController",
      templateUrl: "app/roles/agregarUsuariosAlRol/agregarUsuariosAlRol.html",
      activetab: 'roles'
    })
    .when("/roles-agregar-usuario/:idRol", {
      controller: "AgregarUsuarioAlRolController",
      templateUrl: "app/roles/agregarUsuariosAlRol/agregarUsuarioAlRol/agregarUsuarioAlRol.html",
      activetab: 'roles'
    })
    .when("/agregar-pantallas-al-rol/:idRol", {
      controller: "AgregarPantallasAlRolController",
      templateUrl: "app/roles/agregarPantallasAlRol/agregarPantallasAlRol.html",
      activetab: 'roles'
    })
    .when("/roles-agregar-pantalla/:idRol", {
      controller: "AgregarPantallaAlRolController",
      templateUrl: "app/roles/agregarPantallasAlRol/agregarPantallaAlRol/agregarPantallaAlRol.html",
      activetab: 'roles'
    })
    //rutas de areas de credito
    .when("/areascredito", {
      controller: "AreasCreditoController",
      templateUrl: "app/areasCredito/areasCredito.html",
      activetab: 'areascredito'
    })
    .when("/agregar-area-credito", {
      controller: "AgregarAreaCreditoController",
      templateUrl: "app/areasCredito/agregarAreaCredito/agregarAreaCredito.html",
      activetab: 'areascredito'
    })
    .when("/editar-area-credito/:idAreaCredito", {
      controller: "EditarAreaCreditoController",
      templateUrl: "app/areasCredito/editarAreaCredito/editarAreaCredito.html",
      activetab: 'areascredito'
    })
    .when("/area-credito-agregar-detalle/:idAreaCredito", {
      controller: "agregarDetallesAlAreaController",
      templateUrl: "app/areasCredito/agregarDetallesAlArea/agregarDetallesAlArea.html",
      activetab: 'areascredito'
    })
    .when("/agregar-detalle-al-area/:idAreaCredito", {
      controller: "AgregarDetalleAlAreaController",
      templateUrl: "app/areasCredito/agregarDetallesAlArea/agregarDetalleAlArea/agregarDetalleAlArea.html",
      activetab: 'areascredito'
    })
    .when("/editar-detalle-area/:idDetalle", {
      controller: "EditarDetalleAlAreaController",
      templateUrl: "app/areasCredito/agregarDetallesAlArea/editarDetalleAlArea/editarDetalleAlArea.html",
      activetab: 'areascredito'
    })
    //rutas de marcas
    .when("/marcas", {
      controller: "MarcasController",
      templateUrl: "app/marcas/marcas.html",
      activetab: 'marcas'
    })
    .when("/agregar-marca", {
      controller: "AgregarMarcaController",
      templateUrl: "app/marcas/agregarMarca/agregarMarca.html",
      activetab: 'marcas'
    })
    .when("/editar-marca/:idMarca", {
      controller: "EditarMarcaController",
      templateUrl: "app/marcas/editarMarca/editarMarca.html",
      activetab: 'marcas'
    })
    .when("/agregar-modelos/:descripcionMarca", {
      controller: "AgregarModelosController",
      templateUrl: "app/marcas/agregarModelos/agregarModelos.html",
      activetab: 'marcas'
    })
    .when("/agregar-modelo/:descripcionMarca", {
      controller: "AgregarModeloController",
      templateUrl: "app/marcas/agregarModelos/agregarModelo/agregarModelo.html",
      activetab: 'marcas'
    })
    .when("/editar-modelo/:idModelo", {
      controller: "EditarModeloController",
      templateUrl: "app/marcas/agregarModelos/editarModelo/editarModelo.html",
      activetab: 'marcas'
    })
    //rutas de promociones
    .when("/promociones", {
      controller: "PromocionesController",
      templateUrl: "app/promociones/promociones.html",
      activetab: 'promociones'
    })
    .when("/agregar-promocion", {
      controller: "AgregarPromocionController",
      templateUrl: "app/promociones/agregarPromocion/agregarPromocion.html",
      activetab: 'promociones'
    })
    .when("/editar-promocion/:idPromocion", {
      controller: "EditarPromocionController",
      templateUrl: "app/promociones/editarPromocion/editarPromocion.html",
      activetab: 'promociones'
    })
    .when("/agregar-annios-en-promocion/:idPromocion", {
      controller: "AgregarAnniosController",
      templateUrl: "app/promociones/agregarAnnios/agregarAnnios.html",
      activetab: 'promociones'
    })
    .when("/agregar-annio-promocion/:idPromocion", {
      controller: "AgregarAnnioPromocionController",
      templateUrl: "app/promociones/agregarAnnios/agregarAnnio/agregarAnnio.html",
      activetab: 'promociones'
    })
    .when("/agregar-areas-credito-en-promocion/:idPromocion", {
      controller: "AgregarAreasCreditoController",
      templateUrl: "app/promociones/agregarAreasCredito/agregarAreasCredito.html",
      activetab: 'promociones'
    })
    .when("/agregar-area-credito-promocion/:idPromocion", {
      controller: "AgregarAreaCreditoPromocionController",
      templateUrl: "app/promociones/agregarAreasCredito/agregarAreaCredito/agregarAreaCredito.html",
      activetab: 'promociones'
    })
    .when("/agregar-marcas-en-promocion/:idPromocion", {
      controller: "AgregarMarcasController",
      templateUrl: "app/promociones/agregarMarcas/agregarMarcas.html",
      activetab: 'promociones'
    })
    .when("/agregar-marca-promocion/:idPromocion", {
      controller: "AgregarMarcaPromocionController",
      templateUrl: "app/promociones/agregarMarcas/agregarMarca/agregarMarca.html",
      activetab: 'promociones'
    })
    .when("/agregar-modelos-en-marca/:idMarca/promocion/:idPromocion", {
      controller: "AgregarMarcasModelosController",
      templateUrl: "app/promociones/agregarMarcas/agregarModelos/agregarModelos.html",
      activetab: 'promociones'
    })
    .when("/agregar-marca/:idMarca/modelo-promocion/:idPromocion", {
      controller: "AgregarModeloPromocionController",
      templateUrl: "app/promociones/agregarMarcas/agregarModelos/agregarModelo/agregarModelo.html",
      activetab: 'promociones'
    })
    .when("/agregar-detalles-en-promocion/:idPromocion", {
      controller: "AgregarDetalleController",
      templateUrl: "app/promociones/agregarDetalle/agregarDetalle.html",
      activetab: 'promociones'
    })
    //rutas de variables
    .when("/variables", {
      controller: "VariablesController",
      templateUrl: "app/variables/variables.html",
      activetab: 'variables'
    })
    .when("/editar-variable/:idVariable", {
      controller: "EditarVariableController",
      templateUrl: "app/variables/editarVariable/editarVariable.html",
      activetab: 'variables'
    })
    //rutas de vendedor
    .when("/vendedor", {
      controller: "VendedorController",
      templateUrl: "app/vendedor/vendedor.html",
      activetab: 'vendedor'
    })
    //rutas de ejecutivo
    .when("/ejecutivo", {
      controller: "EjecutivoController",
      templateUrl: "app/ejecutivo/ejecutivo.html",
      activetab: 'ejecutivo'
    })
    .otherwise({
      redirectTo: '/home'
    });
  localStorageServiceProvider
    .setPrefix('cotizadorCQ')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
  $cryptoProvider
    .setCryptographyKey('ABCD123');
});
