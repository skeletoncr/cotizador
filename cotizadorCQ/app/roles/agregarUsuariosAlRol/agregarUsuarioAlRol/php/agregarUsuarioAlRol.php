<?php
  require_once(dirname(__FILE__) . '../../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_roles; // to access id_roles
  $data->id_usuario; // to access id_usuario

  $m_db;
  $output = null; // Json Array
  try {
    $usuario = array(
      "id_roles" => $data->id_roles,
      "id_usuario" => $data->id_usuario,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_usuarios_roles',$usuario); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("UsuarioAlRol::insert_: Exception=" . $e->getMessage());
    $output = array(
      "error" => $e->getMessage(),
      "jsonSuccess" => false
    );
  }
  $strResult = json_encode( $output ); // Get json_encode
  $getResult = null;
  $results = null;
  echo $strResult;
?>
