<?php
  require_once('../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id; // to access id
  $data->password_; // to access password_

  $m_db;
  $output = null; // Json Array
  try {
    $usuario = array(
      "password_" => $data->password_,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_usuarios',$usuario);  // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->id,""); // Condition
    $m_db->execute();
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Extras::modify_: Exception=" . $e->getMessage());
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
