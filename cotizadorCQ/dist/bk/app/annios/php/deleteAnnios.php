<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->valor;  // to access annio

  $m_db;
  $output = null; // Json Array
  try {
    //print_r($p_source);
    $tsql = " DELETE FROM d_annos WHERE valor = " . $data->valor;
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->setQuery($tsql); // Connect
    $m_db->delete(); // Execute the query
    $getData = $m_db->getResult();
    //var_dump($getData);
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Annios::delete_: Exception=" . $e->getMessage());
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