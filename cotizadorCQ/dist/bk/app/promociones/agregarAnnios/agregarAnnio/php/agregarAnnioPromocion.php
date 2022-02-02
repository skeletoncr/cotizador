<?php
  require_once(dirname(__FILE__) . '../../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_promocion; // to access id_promocion
  $data->anno; // to access anno

  $m_db;
  $output = null; // Json Array
  try {
    $annioPromocion = array(
      "id_promocion" => $data->id_promocion,
      "anno" => $data->anno,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_promociones_annos',$annioPromocion); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("AnniosPromocion::insert_: Exception=" . $e->getMessage());
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
