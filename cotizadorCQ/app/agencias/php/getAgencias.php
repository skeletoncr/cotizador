<?php
  require_once('../../php/database.php');

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*
              FROM d_agencias as t1
              ORDER BY nombre";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("Agencias::Get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
