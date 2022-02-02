<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->seguro;  // to access seguro
  $data->adicional;  // to access adicional

  $m_db;
  $output = null; // Json Array
  try {
    $bonificacion = array(
      "seguro" => $data->seguro,
      "adicional" => $data->adicional,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_bonificacion_seguro',$bonificacion); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Bonificacion::insert_: Exception=" . $e->getMessage());
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
