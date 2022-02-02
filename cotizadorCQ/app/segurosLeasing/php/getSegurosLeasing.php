<?php
  require_once('../../php/database.php');

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t2.descripcion as tipoVehiculo,t3.descripcion as usoSeguro,t1.*
              FROM d_seguros_leasing as t1
              LEFT JOIN d_tipovehiculo as t2 ON t2.id = t1.id_tipovehiculo
              LEFT JOIN d_uso_seguro as t3 ON t3.codigo = t1.id_usoseguro";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("SegurosLeasing::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
