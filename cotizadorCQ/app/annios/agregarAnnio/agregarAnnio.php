<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->annio;  // to access annio

  $m_db;
  $output = null; // Json Array
  try {
    $data = array(
      "valor" => $data->annio,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_annos',$data); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Annios::insert_: Exception=" . $e->getMessage());
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
