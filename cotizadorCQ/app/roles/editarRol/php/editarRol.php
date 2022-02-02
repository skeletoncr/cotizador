<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id; // to access id
  $data->descripcion; // to access descripcion
  $data->id_marca; // to access id_marca
  $data->id_tipoventas; // to access id_tipoventas
  $data->admin; // to access admin
  $data->activo; // to access activo

  $m_db;
  $output = null; // Json Array
  try {
    $usuario = array(
      "descripcion" => $data->descripcion,
      "id_marca" => $data->id_marca,
      "id_tipoventas" => $data->id_tipoventas,
      "admin" => $data->admin,
      "activo" => $data->activo,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_roles',$usuario);  // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->id,""); // Condition
    $m_db->execute();
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Roles::modify_: Exception=" . $e->getMessage());
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
