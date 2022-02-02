<?php
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idUser; // to access idUser

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.id,t1.password_,t1.nombre,t1.apellido1,t1.apellido2,t1.email,t1.id_genero,t1.idtipo_usuario,t1.telefono,t4.*, t3.login_
              FROM d_usuarios  as t1
              LEFT JOIN d_usuarios_agencias as t2 ON t2.id_usuario = t1.id
              LEFT JOIN d_bandejatrabajo as t4 ON t4.agencia = t2.id_agencia AND t4.id_estado != 4
              LEFT JOIN d_usuarios as t3 ON t3.id = t4.id_usuario
              WHERE t1.id  = '" . $data->idUser . "'
              ORDER BY t4.id DESC";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("BandejaUser::Get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
