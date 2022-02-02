<?php 
  require_once('../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id;  // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t2.*,t3.id_marca,t3.id_tipoventas,t3.admin,t3.activo,t2.id_roles FROM d_usuarios_roles  as t1 "
                  . " RIGHT JOIN d_roles_pantallas as t2 ON t1.id_roles = t2.id_roles "
                  . " LEFT JOIN d_roles as t3 ON t3.id = t1.id_roles"
                  . " WHERE" . " t1.id_usuario =" . $data->id;
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("Login::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
