<?php
  require_once(dirname(__FILE__) . '../../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idDetalle;  // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*
              FROM d_tipoventas_detalles  as t1
              WHERE t1.id  ='" . $data->idDetalle . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("Detalle::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
