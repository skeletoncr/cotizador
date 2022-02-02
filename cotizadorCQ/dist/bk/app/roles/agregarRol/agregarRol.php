<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->descripcion; // to access descripcion
  $data->id_marca; // to access id_marca
  $data->id_tipoventas; // to access id_tipoventas
  $data->admin; // to access admin
  $data->activo; // to access activo

  $m_db;
  $output = null; // Json Array
  try {
    $rol = array(
      "descripcion" => $data->descripcion,
      "id_marca" => $data->id_marca,
      "id_tipoventas" => $data->id_tipoventas,
      "admin" => $data->admin,
      "activo" => $data->activo,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_roles',$rol); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Roles::insert_: Exception=" . $e->getMessage());
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
