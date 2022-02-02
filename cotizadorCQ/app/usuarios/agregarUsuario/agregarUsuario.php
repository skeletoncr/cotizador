<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->login_; // to access login_
  $data->password_; // to access password_
  $data->nombre; // to access nombre
  $data->apellido1; // to access apellido1
  $data->apellido2; // to access apellido2
  $data->email; // to access email
  $data->id_genero; // to access id_genero
  $data->idtipo_usuario; // to access idtipo_usuario
  $data->telefono; // to access telefono

  $m_db;
  $output = null; // Json Array
  try {
    $usuario = array(
      "login_" => $data->login_,
      "password_" => $data->password_,
      "nombre" => $data->nombre,
      "apellido1" => $data->apellido1,
      "apellido2" => $data->apellido2,
      "email" => $data->email,
      "id_genero" => $data->id_genero,
      "idtipo_usuario" => $data->idtipo_usuario,
      "telefono" => $data->telefono,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_usuarios',$usuario); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Usuarios::insert_: Exception=" . $e->getMessage());
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
