<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idAreaCredito;  // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*,t2.descripcion as areacredito
              FROM d_tipoventas_detalles as t1
              LEFT JOIN d_tipoventas as t2 ON t1.id_tipoventas = t2.id
              WHERE t1.id_tipoventas ='" . $data->idAreaCredito . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("DetallesByRol::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>