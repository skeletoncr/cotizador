<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idUsuario; // to access idUsuario

  $m_db;
  $output = null; // Json Array
  try {
    $tsql = " DELETE FROM d_usuarios_agencias WHERE id_usuario = " . $data->idUsuario;
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->setQuery($tsql); // Connect
    $m_db->delete(); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("UsuariosAgencias::delete_: Exception=" . $e->getMessage());
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
