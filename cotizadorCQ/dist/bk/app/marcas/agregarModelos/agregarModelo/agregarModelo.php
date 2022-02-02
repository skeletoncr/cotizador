<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->descripcion; // to access descripcion
  $data->modelo; // to access modelo
  $data->tipovehiculo; // to access tipovehiculo
  $data->tipofinanciamiento; // to access tipofinanciamiento

  $m_db;
  $output = null; // Json Array
  try {
    $modelo = array(
      "descripcion" => $data->descripcion,
      "modelo" => $data->modelo,
      "tipovehiculo" => $data->tipovehiculo,
      "tipofinanciamiento" => $data->tipofinanciamiento,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_marcas_modelos',$modelo); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Modelos::insert_: Exception=" . $e->getMessage());
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
