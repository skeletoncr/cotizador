<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idRol;  // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*,t2.descripcion
              FROM d_roles_pantallas  as t1
              LEFT JOIN d_roles as t2 ON t1.id_roles = t2.id
              WHERE t1.id_roles  ='" . $data->idRol . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("PantallasByRol::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
