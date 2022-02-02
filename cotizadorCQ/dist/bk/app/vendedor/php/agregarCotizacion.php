<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->agencia; // to access agencia
  $data->id_tipo_prestamo; // to access id_tipo_prestamo
  $data->id_cedula; // to access id_cedula
  $data->nombre; // to access nombre
  $data->apellido1; // to access apellido1
  $data->apellido2; // to access apellido2
  $data->fecha_nacimiento; // to access fecha_nacimiento
  $data->antiguedad_laboral; // to access antiguedad_laboral
  $data->email; // to access email
  $data->telefono; // to access telefono
  $data->id_estado; // to access id_estado
  $data->anno; // to access anno
  $data->ingresobruto; // to access ingresobruto
  $data->ingreso; // to access ingreso
  $data->gastos; // to access gastos
  $data->costovehiculo; // to access costovehiculo
  $data->preciocongastos; // to access preciocongastos
  $data->gastosvehiculo; // to access gastosvehiculo
  $data->tipo_vehiculo_a_comprar; // to access tipo_vehiculo_a_comprar
  $data->prima; // to access prima
  $data->libre; // to access libre
  $data->plazo; // to access plazo
  $data->id_promocion; // to access id_promocion
  $data->id_marca; // to access id_marca
  $data->id_marca_modelo; // to access id_marca_modelo
  $data->placa; // to access placa
  $data->id_usuario; // to access id_usuario

  $m_db;
  $output = null; // Json Array
  try {
    $cotizacion = array(
      "agencia" => $data->agencia,
      "id_tipo_prestamo" => $data->id_tipo_prestamo,
      "id_cedula" => $data->id_cedula,
      "nombre" => $data->nombre,
      "apellido1" => $data->apellido1,
      "apellido2" => $data->apellido2,
      "fecha_nacimiento" => $data->fecha_nacimiento,
      "antiguedad_laboral" => $data->antiguedad_laboral,
      "email" => $data->email,
      "telefono" => $data->telefono,
      "id_estado" => $data->id_estado,
      "anno" => $data->anno,
      "ingresobruto" => $data->ingresobruto,
      "ingreso" => $data->ingreso,
      "gastos" => $data->gastos,
      "costovehiculo" => $data->costovehiculo,
      "preciocongastos" => $data->preciocongastos,
      "gastosvehiculo" => $data->gastosvehiculo,
      "tipo_vehiculo_a_comprar" => $data->tipo_vehiculo_a_comprar,
      "prima" => $data->prima,
      "libre" => $data->libre,
      "plazo" => $data->plazo,
      "id_promocion" => $data->id_promocion,
      "id_marca" => $data->id_marca,
      "id_marca_modelo" => $data->id_marca_modelo,
      "placa" => $data->placa,
      "id_usuario" => $data->id_usuario,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_bandejatrabajo',$cotizacion); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Cotizacion::insert_: Exception=" . $e->getMessage());
    //die( print_r( $e->getMessage() ) );
    $output = array(
      "error" => $e->getMessage(),
      "jsonSuccess" => false
    );
  }
  $strResult = json_encode( $output ); // Get json_encode
  $getResult = null;
  $results = null;
  echo $strResult;
?>
