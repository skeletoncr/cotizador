<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id;  // to access id
  $data->valor;  // to access annio

  $m_db;
  $output = null; // Json Array
  try {
        $annio = array(
          "valor" => $data->valor,
          "modifydate" => 'NOW()'
        );
        $m_db = new db(); // Create Object
        $m_db->Connect(); // Connect
        $m_db->update('d_annos',$annio);  // Execute the query
        $m_db->where(); // Where the query
        $m_db->AddCondicion(" id = " . $data->id,""); // Condition
        //echo $this->m_db->getQuery();
        $m_db->execute();
        $getData = $m_db->getResult();
        //var_dump($getData);
        $m_db->Close(); // Close  Conexion
        $output = $getData;
      }catch(Exception $e) {
        error_log($m_strNameClass . "::modify_: Exception=" . $e->getMessage());
        //die( print_r( $e->getMessage() ) );
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
