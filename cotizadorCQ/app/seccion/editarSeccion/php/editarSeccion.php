<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id; // to access id
  $data->codigo; // to access codigo
  $data->descripcion; // to access descripcion
  $data->tasa1; // to access tasa1
  $data->tasa2; // to access tasa2
  $data->tasa3; // to access tasa3
  $data->plazo1; // to access plazo1
  $data->plazo2; // to access plazo2
  $data->plazo3; // to access plazo3
  $data->porcentaje; // to access porcentaje
  $data->balloonSaldoFinanciar; // to access balloonSaldoFinanciar
  $data->balloonPrecioGastos; // to access balloonPrecioGastos

  $m_db;
  $output = null; // Json Array
  try {
    $seccion = array(
      "codigo" => $data->codigo,
      "descripcion" => $data->descripcion,
      "tasa1" => $data->tasa1,
      "tasa2" => $data->tasa2,
      "tasa3" => $data->tasa3,
      "plazo1" => $data->plazo1,
      "plazo2" => $data->plazo2,
      "plazo3" => $data->plazo3,
      "porcentaje" => $data->porcentaje,
      "balloonSaldoFinanciar" => $data->balloonSaldoFinanciar,
      "balloonPrecioGastos" => $data->balloonPrecioGastos,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_seccion',$seccion); // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->id,""); // Condition
    //echo $this->m_db->getQuery();
    $m_db->execute();
    $getData = $m_db->getResult();
    //var_dump($getData);
    $m_db->Close(); // Close  Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Seccion::modify_: Exception=" . $e->getMessage());
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
