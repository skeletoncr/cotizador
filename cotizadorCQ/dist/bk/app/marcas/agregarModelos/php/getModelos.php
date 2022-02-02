<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->descripcionMarca; // to access descripcionMarca

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*
              FROM d_marcas_modelos  as t1
              WHERE t1.descripcion  = '" . $data->descripcionMarca . "'
              ORDER BY t1.modelo";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("Modelos::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
