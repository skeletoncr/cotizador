<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idPromocion;  // to access idPromocion

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t2.*
              FROM d_promociones_tecnologias as t1
              LEFT JOIN d_tecnologias as t2 ON t2.id = t1.id_tecnologia
              WHERE t1.id_promocion ='" . $data->idPromocion . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("ExtrasByPromocion::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
