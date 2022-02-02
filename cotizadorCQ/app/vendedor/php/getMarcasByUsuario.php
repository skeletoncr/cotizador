<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idUsuario; // to access idPromocion

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t4.*
              FROM d_usuarios  as t1
              LEFT JOIN d_usuarios_roles as t2 ON t2.id_usuario = t1.id
              LEFT JOIN d_roles as t3 ON t3.id = t2.id_roles
              LEFT JOIN d_marcas as t4 ON t3.id_marca = t4.id
              WHERE t1.id = '".$data->idUsuario."'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("marcasByUsuario::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
