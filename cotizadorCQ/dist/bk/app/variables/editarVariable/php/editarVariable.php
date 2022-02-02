<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id; // to access id
  $data->cambio_dolar; // to access cambio_dolar
  $data->cambio_dolar_seguros; // to access cambio_dolar_seguros
  $data->tasa1; // to access tasa1
  $data->tasa2; // to access tasa2
  $data->prima; // to access prima
  $data->comision; // to access comision
  $data->plazo1; // to access plazo1
  $data->plazo2; // to access plazo2
  $data->factorSeguro; // to access factorSeguro
  $data->rci; // to access rci

  $m_db;
  $output = null; // Json Array
  try {
    $variable = array(
      "cambio_dolar" => $data->cambio_dolar,
      "cambio_dolar_seguros" => $data->cambio_dolar_seguros,
      "tasa1" => $data->tasa1,
      "tasa2" => $data->tasa2,
      "prima" => $data->prima,
      "comision" => $data->comision,
      "plazo1" => $data->plazo1,
      "plazo2" => $data->plazo2,
      "factorSeguro" => $data->factorSeguro,
      "rci" => $data->rci,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->update('d_variables',$variable);  // Execute the query
    $m_db->where(); // Where the query
    $m_db->AddCondicion(" id = " . $data->id,""); // Condition
    //echo $this->m_db->getQuery();
    $m_db->execute();
    $getData = $m_db->getResult();
    //var_dump($getData);
    $m_db->Close(); // Close  Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Variables::modify_: Exception=" . $e->getMessage());
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
