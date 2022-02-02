<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_bandeja; // to access id_bandeja
  $data->id_extra; // to access id_extra

  $m_db;
  $output = null; // Json Array
  try {
    $cotizacion = array(
      "id_bandeja" => $data->id_bandeja,
      "id_extra" => $data->id_extra,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_bandeja_extras',$cotizacion); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = array(
      "jsonSuccess" => true
    );
  }catch(Exception $e) {
    error_log("Cotizacion::insert_: Exception=" . $e->getMessage());
    //die( print_r( $e->getMessage() ) );
    $output = array(
      "error" => $e->getMessage(),
      "jsonSuccess" => false
    );
  }
  $strResult = json_encode( $output ); // Get json_encode
  echo $strResult;
?>
