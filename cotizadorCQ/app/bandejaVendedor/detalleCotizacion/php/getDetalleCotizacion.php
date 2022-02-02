<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idCaso; // to access idCaso

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*, t2.descripcion as nombreMarca
              FROM d_bandejatrabajo as t1
              LEFT JOIN d_marcas as t2 ON t2.id = t1.id_marca
              WHERE t1.id  ='" . $data->idCaso . "'";
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
