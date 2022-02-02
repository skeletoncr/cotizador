<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_tipoventas; // to access id_tipoventas
  $data->descripcion; // to access descripcion
  $data->moneda; // to access moneda
  $data->monto; // to access monto
  $data->porcentaje; // to access porcentaje
  $data->tipocalculo; // to access tipocalculo
  $data->tipocampo; // to access tipocampo

  $m_db;
  $output = null; // Json Array
  try {
    $detalle = array(
      "id_tipoventas" => $data->id_tipoventas,
      "descripcion" => $data->descripcion,
      "moneda" => $data->moneda,
      "monto" => $data->monto,
      "porcentaje" => $data->porcentaje,
      "tipocalculo" => $data->tipocalculo,
      "tipocampo" => $data->tipocampo,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_tipoventas_detalles',$detalle); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Detalles::insert_: Exception=" . $e->getMessage());
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
