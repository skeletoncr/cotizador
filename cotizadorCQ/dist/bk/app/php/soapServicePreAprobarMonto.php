<?php

  $data = json_decode(file_get_contents("php://input"));
  $data->url; // to access url
  $data->primerNombreCliente; // to access primerNombreCliente
  $data->segundoNombreCliente; // to access segundoNombreCliente
  $data->primerApellidoCliente; // to access primerApellidoCliente
  $data->segundoApellidoCliente; // to access segundoApellidoCliente
  $data->nombreEmpresa; // to access nombreEmpresa
  $data->tipoIdentificacion; // to access tipoIdentificacion
  $data->numeroIdentificacion; // to access numeroIdentificacion
  $data->fechaNacimiento; // to access fechaNacimiento
  $data->segmentoCotizador; // to access segmentoCotizador
  $data->antiguedadLaboral; // to access antiguedadLaboral
  $data->ingresoActual; // to access ingresoActual
  $data->gastos; // to access gastos
  $data->tipoVehiculo; // to access tipoVehiculo
  $data->cuotaSolicitada; // to access cuotaSolicitada
  $data->montoSolicitado; // to access montoSolicitado
  $data->precioVehiculo; // to access precioVehiculo

  $client = new SoapClient($data->url);

  $atributos = array(
    'primerNombreCliente' => $data->primerNombreCliente,
    'segundoNombreCliente' => $data->segundoNombreCliente,
    'primerApellidoCliente' => $data->primerApellidoCliente,
    'segundoApellidoCliente' => $data->segundoApellidoCliente,
    'nombreEmpresa' => $data->nombreEmpresa,
    'tipoIdentificacion' => $data->tipoIdentificacion,
    'numeroIdentificacion' => $data->numeroIdentificacion,
    'fechaNacimiento' => $data->fechaNacimiento,
    'segmentoCotizador' => $data->segmentoCotizador,
    'antiguedadLaboral' => $data->antiguedadLaboral,
    'ingresoActual' => $data->ingresoActual,
    'gastos' => $data->gastos,
    'tipoVehiculo' => $data->tipoVehiculo,
    'cuotaSolicitada' => $data->cuotaSolicitada,
    'montoSolicitado' => $data->montoSolicitado,
    'precioVehiculo' => $data->precioVehiculo
	);

	$response = $client->preaprobarMonto($atributos);

  echo json_encode($response);

?>
