angular.module("Cotizador")

.factory("correoService", function($crypto) {
  var factory = {}; 

	factory.mensaje = function(idSolicitud, nombre, cedula, email) {
    var encrypted = $crypto.encrypt(idSolicitud.toString());
    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    };
    var sustituir = encrypted.replaceAll("/", "-");
    message = 'Correo de cotización vehículo ' + '<br><br>';
    message += 'Estimado :' + nombre + '<br><br>';
    message += ' Es para CrediQ Costa Rica un gusto saludarle y agradecerle su preferencia. ';
    message += ' Es nuestro deseo poder servirle y llenar sus expectativas. ';
    message += 'A continuación presentamos la cotización para su financiamiento de vehículo, ';
    message += 'esperando que usted nos permita servirle, ';
    message += 'convirtiéndose en nuestro cliente y próximamente disfrute de nuestros servicios.';
    message += 'Si desea avanzar en el proceso,' + "<br><br>";
    message += "Por favor, ingrese a <a href = 'http://crediqweb.com/solicitudCredito/#/solicitudCredito/" + sustituir + "'>este link</a> <br><br>";
    return message;
	}

  factory.mensajeNoPreAprobacion = function(idSolicitud, nombre, cedula, email) {
    var encrypted = $crypto.encrypt(idSolicitud.toString());
    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
    };
    var sustituir = encrypted.replaceAll("/", "-");
    message = 'Correo de cotización vehículo ' + '<br><br>';
    message += 'Estimado :' + nombre + '<br><br>';
    message += ' Es para CrediQ Costa Rica un gusto saludarle y agradecerle su preferencia. ';
    message += ' Es nuestro deseo poder servirle y llenar sus expectativas. ';
    //message += "Por favor, ingrese a <a href = 'http://crediqweb.com/solicitudCredito/#/solicitudCredito/" + sustituir + "'>este link</a> <br><br>";
    return message;
	}

	return factory;
});
