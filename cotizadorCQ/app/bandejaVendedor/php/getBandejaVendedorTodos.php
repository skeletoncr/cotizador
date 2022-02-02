<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idUser; // to access idUser

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.id,t1.password_,t1.nombre,t1.apellido1,t1.apellido2,t1.email,t1.id_genero,t1.idtipo_usuario,t1.telefono, t2.*
              FROM d_usuarios  as t1
              LEFT JOIN d_bandejatrabajo as t2 ON t2.id_usuario = t1.id AND t2.id_estado != 4
              WHERE t1.id  = '" . $data->idUser . "'
              ORDER BY t2.id DESC";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("BandejaVendedor::Get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
