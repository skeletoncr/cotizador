<?php
  require_once('../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idMarca; // to access id
  $data->idPromocion; // to access id

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT  t1.*,t3.descripcion as descpromocion, t4.descripcion as marca
              FROM d_promociones_marcas_modelos3  as t1
              LEFT JOIN d_promociones as t3 ON t3.id = t1.id_promocion
              LEFT JOIN d_marcas as t4 ON t4.id = t1.id_marca
              WHERE t1.id_promocion = " . $data->idPromocion . "
              AND t1.id_marca = " . $data->idMarca ;
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("ModelosByPromocion::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
