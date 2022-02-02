<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idUsuario; // to access idUsuario

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t2.*
              FROM d_usuarios_agencias as t1
              LEFT JOIN d_agencias as t2 ON t2.id = t1.id_agencia
              WHERE t1.id_usuario ='" . $data->idUsuario . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("AgenciasByUsuario::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
