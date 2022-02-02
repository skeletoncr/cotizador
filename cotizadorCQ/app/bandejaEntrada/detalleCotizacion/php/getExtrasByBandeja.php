<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idBandeja;  // to access idBandeja

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t2.*
              FROM d_bandeja_extras as t1
              LEFT JOIN d_tecnologias as t2 ON t2.id = t1.id_extra
              WHERE t1.id_bandeja ='" . $data->idBandeja . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("ExtrasByBandeja::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
