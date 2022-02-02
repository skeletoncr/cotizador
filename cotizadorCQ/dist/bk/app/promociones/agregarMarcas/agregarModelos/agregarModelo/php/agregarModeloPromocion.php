<?php
  require_once(dirname(__FILE__) . '../../../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_promocion; // to access id_promocion
  $data->id_marca; // to access id_marca
  $data->modelo; // to access modelo

  $m_db;
  $output = null; // Json Array
  try {
    $modeloPromocion = array(
      "id_promocion" => $data->id_promocion,
      "id_marca" => $data->id_marca,
      "modelo" => $data->modelo,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_promociones_marcas_modelos3',$modeloPromocion); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("ModelosPromocion::insert_: Exception=" . $e->getMessage());
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
