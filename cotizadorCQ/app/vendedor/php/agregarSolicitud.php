<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_bandeja; // to access id_bandeja
  $data->id_cedula; // to access id_cedula
  $data->nombre; // to access nombre
  $data->apellido1; // to access apellido1
  $data->apellido2; // to access apellido2

  $m_db;
  $output = null; // Json Array
  try {
    $solicitud = array(
      "id_bandeja" => $data->id_bandeja,
      "deudor_nombre" => $data->nombre,
      "deudor_apellido1" => $data->apellido1,
      "deudor_apellido2" => $data->apellido2,
      "deudor_identificacion" => $data->id_cedula,
      "inscribe_nombre" => $data->nombre,
      "inscribe_apellido1" => $data->apellido1,
      "inscribe_apellido2" => $data->apellido2,
      "inscribe_cedula" => $data->id_cedula,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_solicitudcredito',$solicitud); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Solicitud::insert_: Exception=" . $e->getMessage());
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
