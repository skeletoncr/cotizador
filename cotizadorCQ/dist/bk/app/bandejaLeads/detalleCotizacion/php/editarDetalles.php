<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idCaso; // to access idCaso
  $data->id_estado; // to access id_estado
  $data->agencia; // to access agencia
  $data->tipo_vehiculo_a_comprar; // to access tipo_vehiculo_a_comprar
  $data->id_marca; // to access id_marca
  $data->id_marca_modelo; // to access id_marca_modelo
  $data->ingresobruto; // to access ingresobruto
  $data->ingreso; // to access ingreso
  $data->costovehiculo; // to access costovehiculo
  $data->id_moneda; // to access id_moneda
  $data->gastosvehiculo; // to access gastosvehiculo
  $data->preciocongastos; // to access preciocongastos
  $data->prima; // to access prima
  $data->libre; // to access libre
  $data->id_cedula; // to access id_cedula
  $data->nombre; // to access nombre
  $data->apellido1; // to access apellido1
  $data->apellido2; // to access apellido2
  $data->antiguedad_laboral; // to access antiguedad_laboral
  $data->email; // to access email
  $data->telefono; // to access telefono

  $m_db;
  $output = null; // Json Array
  try {
    $detalle = array(
      "id_estado" => $data->id_estado,
      "agencia" => $data->agencia,
      "tipo_vehiculo_a_comprar" => $data->tipo_vehiculo_a_comprar,
      "id_marca" => $data->id_marca,
      "id_marca_modelo" => $data->id_marca_modelo,
      "ingresobruto" => $data->ingresobruto,
      "ingreso" => $data->ingreso,
      "costovehiculo" => $data->costovehiculo,
      "id_moneda" => $data->id_moneda,
      "gastosvehiculo" => $data->gastosvehiculo,
      "preciocongastos" => $data->preciocongastos,
      "prima" => $data->prima,
      "libre" => $data->libre,
      "id_cedula" => $data->id_cedula,
      "nombre" => $data->nombre,
      "apellido1" => $data->apellido1,
      "apellido2" => $data->apellido2,
      "antiguedad_laboral" => $data->antiguedad_laboral,
      "email" => $data->email,
      "telefono" => $data->telefono,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_bandejatrabajo',$detalle);  // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->idCaso,""); // Condition
    $m_db->execute();
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Detalles::modify_: Exception=" . $e->getMessage());
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
