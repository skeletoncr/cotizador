angular.module("Cotizador")

.factory("impresionPreAprobacionService", function(crediq, calcularFormulasService) {
  var factory = {};
  var datos = {};

	factory.impresionPreAprobacionPDF = function(detalle, extrasCotizacion, extrasPromocion) {
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
          text: 'Le informamos que de acuerdo con la revisión previa efectuada,' 
          + ' usted cuenta con una pre-aprobación de crédito para la compra de su '
          + detalle.nombreTipoVehiculo+' Marca: '+datos.nuevaMarca + detalle.modelo+', Año: '+detalle.anno
          + '. Le invitamos a completar  la solicitud de crédito de nuestra financiera.',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: 'Ésta pre-aprobación queda sujeta a la presentación y' 
          + ' revisión de los documentos que solicitamos a continuación: ',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: '\t\t\t\t\t Persona Física:',
          fontSize: 10, bold: true
        },
        {
          text: '\t\t\t\t\t 1. Solicitud de crédito completa y firmada.'
          + '',
          fontSize: 10
        },
        {
          text: '\t\t\t\t\t 2. Copia de cédula o documento de identidad vigente.',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: '\t\t\t\t\t Para Asalariados:',
          fontSize: 10, bold: true
        },
        {
          text: '\t\t\t\t\t * Constancia salarial con menos de un mes de emitida.' 
          + '',
          fontSize: 10
        },
        {
          text: '\t\t\t\t\t * Copia de la última orden patronal vigente.',
          fontSize: 10
        },
        {
          text: ' '
        },
        {
          text: '\t\t\t\t\t Para NO Asalariados (Independientes):',
          fontSize: 10, bold: true
        },
        {
          text: '\t\t\t\t\t * Certificación de Ingresos CPA dirigido a CrediQ Inversiones CR S.A.' 
          + '',
          fontSize: 10
        },
        {
          text: '\t\t\t\t\t * Documentos probatorios (estados de cuenta, facturas timbradas de los últimos 3 meses).',
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
          text: 'Nota: La presente pre-aprobación se realiza con fines informativos únicamente, no podrá considerarse como derecho adquirido, ya que es un trámite previo a la aprobación definitiva, no delega derecho alguno al consumidor más que una expectativa de la aprobación definitiva que puede darse o no, ya que está supeditada a diferentes elementos como pueden ser verificación de datos, el no cambio en la condición crediticia del interesado o sus garantías (personales o reales), la necesidad de información adicional o actualización de la suministrada y su cumplimiento o bien por decisión unilateral de la empresa. Además, las primas mínimas solicitadas podrían variar dependiendo de la marca y modelo escogidos por el cliente.',
          fontSize: 8
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
