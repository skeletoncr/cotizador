<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idProductoBanco;  // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*
              FROM d_productobanco  as t1
              WHERE t1.id  ='" . $data->idProductoBanco . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("ProductoBanco::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
