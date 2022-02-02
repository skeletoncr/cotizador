<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id; // to access id
  $data->descripcion; // to access descripcion
  $data->fecha_activacion; // to access fecha_activacion
  $data->fecha_vencimiento; // to access fecha_vencimiento
  $data->activo; // to access activo

  $m_db;
  $output = null; // Json Array
  try {
    $promocion = array(
      "descripcion" => $data->descripcion,
      "fecha_activacion" => $data->fecha_activacion,
      "fecha_vencimiento" => $data->fecha_vencimiento,
      "activo" => $data->activo,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_promociones',$promocion);  // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->id,""); // Condition
    $m_db->execute();
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Promociones::modify_: Exception=" . $e->getMessage());
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
