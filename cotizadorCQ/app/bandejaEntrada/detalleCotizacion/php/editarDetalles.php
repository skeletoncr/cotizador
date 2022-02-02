<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idCaso; // to access idCaso
  $data->id_estado; // to access id_estado
  $data->tipo_vehiculo_a_comprar; // to access tipo_vehiculo_a_comprar
  $data->placa; // to access placa
  $data->id_marca_modelo; // to access id_marca_modelo
  $data->anno; // to access anno
  $data->ingresobruto; // to access ingresobruto
  $data->ingreso; // to access ingreso
  $data->gastos; // to access gastos
  $data->costovehiculo; // to access costovehiculo
  $data->id_bonificacion; // to access id_bonificacion
  $data->id_moneda; // to access id_moneda
  $data->vehiculoParaInscribir; // to access vehiculoParaInscribir
  $data->id_firmaexterna; // to access id_firmaexterna
  $data->gastosvehiculo; // to access gastosvehiculo
  $data->preciocongastos; // to access preciocongastos
  $data->prima; // to access prima
  $data->plazo; // to access plazo
  $data->libre; // to access libre
  $data->id_cedula; // to access id_cedula
  $data->nombre; // to access nombre
  $data->apellido1; // to access apellido1
  $data->apellido2; // to access apellido2
  $data->fecha_nacimiento; // to access fecha_nacimiento
  $data->antiguedad_laboral; // to access antiguedad_laboral
  $data->email; // to access email
  $data->id_tipopersona; // to access id_tipopersona
  $data->telefono; // to access telefono
  $data->propietario; // to access propietario
  $data->id_tipopersonainscribe; // to access id_tipopersonainscribe
  $data->asegurado; // to access asegurado
  $data->id_uso; // to access id_uso
  $data->id_promocion; // to access id_promocion
  $data->id_tecnologico; // to access id_tecnologico

  $m_db;
  $output = null; // Json Array
  try {
    $detalle = array(
      "id_estado" => $data->id_estado,
      "tipo_vehiculo_a_comprar" => $data->tipo_vehiculo_a_comprar,
      "placa" => $data->placa,
      "id_marca_modelo" => $data->id_marca_modelo,
      "anno" => $data->anno,
      "ingresobruto" => $data->ingresobruto,
      "ingreso" => $data->ingreso,
      "gastos" => $data->gastos,
      "costovehiculo" => $data->costovehiculo,
      "id_bonificacion" => $data->id_bonificacion,
      "id_moneda" => $data->id_moneda,
      "vehiculoParaInscribir" => $data->vehiculoParaInscribir,
      "id_firmaexterna" => $data->id_firmaexterna,
      "gastosvehiculo" => $data->gastosvehiculo,
      "preciocongastos" => $data->preciocongastos,
      "prima" => $data->prima,
      "plazo" => $data->plazo,
      "libre" => $data->libre,
      "id_cedula" => $data->id_cedula,
      "nombre" => $data->nombre,
      "apellido1" => $data->apellido1,
      "apellido2" => $data->apellido2,
      "fecha_nacimiento" => $data->fecha_nacimiento,
      "antiguedad_laboral" => $data->antiguedad_laboral,
      "email" => $data->email,
      "id_tipopersona" => $data->id_tipopersona,
      "telefono" => $data->telefono,
      "propietario" => $data->propietario,
      "id_tipopersonainscribe" => $data->id_tipopersonainscribe,
      "asegurado" => $data->asegurado,
      "id_uso" => $data->id_uso,
      "id_promocion" => $data->id_promocion,
      "id_tecnologico" => $data->id_tecnologico,
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
