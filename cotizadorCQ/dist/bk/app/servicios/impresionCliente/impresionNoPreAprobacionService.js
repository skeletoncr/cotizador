angular.module("Cotizador")

.factory("impresionNoPreAprobacionService", function(crediq, calcularFormulasService) {
  var factory = {};
  var datos = {};

	factory.impresionNoPreAprobacionPDF = function(detalle, extrasCotizacion, extrasPromocion) {
    today = new Date();
    if(detalle.descripcion == 'CREDIAUTOS' || detalle.descripcion == 'NOVACIONES'){
      datos.nuevaMarca = '';
    }else{
      datos.nuevaMarca = detalle.descripcion + ', ';
    }
    var docDefinition = {
      content: [
        {
          image: crediq.img,
			    width: 200
        },
        {
          text: ' '
        },
        {
          text: ' '
        },
        {
          text: ' '
        },
        {
          text: nombreDia(today.getDay()) + ' ' 
          +today.getDate() + ' de ' 
          + nombreMes(today.getMonth()) + ' de ' 
          + today.getFullYear(),
          fontSize: 10, bold: true
        },
        {
		      text: ' '
		    },
        {
          text: ' '
        },
        {
          text: 'Estimado cliente: ' + detalle.nombre + ' ' + detalle.apellido1 + ' ' + detalle.apellido2,
          fontSize: 10, bold: true
        },
        {
          text: ' '
        },
        {
          text: 'Reciba un afectuoso saludo de parte de CrediQ Inversiones,' 
          + ' CR S.A., especializada en el financiamiento de vehículos y otros afines.',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: 'Le informamos que después del análisis previo realizado,' 
          + '  su solicitud de crédito requiere de algunos elementos adicionales para su aprobación '
           + '  y posterior compra de su '
          + detalle.nombreTipoVehiculo+' Marca: '+datos.nuevaMarca + detalle.modelo+', Año: '+detalle.anno
          + '.',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: 'Le invitamos a comunicarse con el ejecutivo de negocios de CREDIQ,' 
          + ' ubicado en la sala de ventas correspondiente, esto con el fin de brindar mayor detalle en cuanto a su solicitud. ',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: ' '
        },
        {
          text: 'Quedando a sus órdenes se despide muy atentamente,' 
          + '',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: 'Departamento de Ánalisis',
          fontSize: 10, bold: true
        },
        {
          text: 'CrediQ Inversiones Costa Rica, S.A.',
          fontSize: 10, bold: true
        },
        {
          text: ' '
        },
        {
          text: ' '
        },
        {
          text: '',
          fontSize: 10
        },
      ],
      styles: {
        table: {
          fontSize: 7,
			    margin: [100, -10, 0, 15]
		    },
        tableRequisitos: {
          fontSize: 7,
			    margin: [50, -10, 0, 15]
		    },
		    tableHeader: {
			    bold: true,
			    fontSize: 7,
			    color: 'black'
		    }
      }
    };
    return docDefinition;
	};

  //funcion para el nombre del dia
  function nombreDia(numDia) {
    switch(numDia) {
      case 0:
        return "Domingo";
      case 1:
        return "Lunes";
      case 2:
        return "Martes";
      case 3:
        return "Miercoles";
      case 4:
        return "Jueves";
      case 5:
        return "Viernes";
      case 6:
        return "Sabado";
    }
  };

  //funcion para el nombre del mes
  function nombreMes(numMes) {
    switch(numMes) {
      case 0:
        return "Enero";
      case 1:
        return "Febrero";
      case 2:
        return "Marzo";
      case 3:
        return "Abril";
      case 4:
        return "Mayo";
      case 5:
        return "Junio";
      case 6:
        return "Julio";
      case 7:
        return "Agosto";
      case 8:
        return "Setiembre";
      case 9:
        return "Octubre";
      case 10:
        return "Noviembre";
      case 11:
        return "Diciembre";
    }
  };

	return factory;
});
