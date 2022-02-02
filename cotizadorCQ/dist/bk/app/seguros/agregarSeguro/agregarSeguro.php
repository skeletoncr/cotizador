<?php
  require_once(dirname(__FILE__) . '../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->tipo_seguro; // to access tipo_seguro
  $data->id_tipovehiculo; // to access id_tipovehiculo
  $data->id_usoseguro; // to access id_usoseguro
  $data->rango_inferior; // to access rango_inferior
  $data->rango_superior; // to access rango_superior
  $data->a; // to access a
  $data->b; // to access b
  $data->c; // to access c
  $data->d; // to access d
  $data->f; // to access f
  $data->g; // to access g
  $data->h; // to access h

  $m_db;
  $output = null; // Json Array
  try {
    $seguro = array(
      "tipo_seguro" => $data->tipo_seguro,
      "id_tipovehiculo" => $data->id_tipovehiculo,
      "id_usoseguro" => $data->id_usoseguro,
      "rango_inferior" => $data->rango_inferior,
      "rango_superior" => $data->rango_superior,
      "a" => $data->a,
      "b" => $data->b,
      "c" => $data->c,
      "d" => $data->d,
      "f" => $data->f,
      "g" => $data->g,
      "h" => $data->h,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_seguros',$seguro); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("Seguros::insert_: Exception=" . $e->getMessage());
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
