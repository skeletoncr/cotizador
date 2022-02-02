<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->descripcion; // to access descripcion
  $data->moneda; // to access moneda
  $data->monto; // to access monto
  $data->cuota; // to access cuota

  $m_db;
  $output = null; // Json Array
  try {
    $extra = array(
      "descripcion" => $data->descripcion,
      "moneda" => $data->moneda,
      "cuota" => $data->cuota,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_tecnologias',$extra); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Extras::insert_: Exception=" . $e->getMessage());
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
