<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->marca; // to access marca
  $data->modelo; // to access modelo
  $data->id_tipo_prestamo; // to access id_tipo_prestamo

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t3.id as idPromocion,t3.descripcion as promocion,t5.descripcion as tipovehiculo,t6.descripcion,t7.*
              FROM 	d_promociones_marcas_modelos3 as t1
              LEFT JOIN d_marcas as t2 ON t2.descripcion = '".$data->marca."'
              LEFT JOIN d_promociones as t3 ON t3.id = t1.id_promocion AND t3.activo = 1 AND t3.id_tipo_prestamo = '".$data->id_tipo_prestamo."' AND t3.fecha_activacion <= curdate() AND t3.fecha_vencimiento >= curdate()
              LEFT JOIN d_promociones_detalles as t4 ON t4.id_promocion = t3.id
              LEFT JOIN d_tipovehiculo as t5 ON t4.id_tipovehiculo = t5.id
              LEFT JOIN d_monedas as t6 ON t4.id_moneda = t6.id
              LEFT JOIN d_seccion as t7 ON t4.id_seccion = t7.id
              WHERE trim(t1.modelo) = trim('".$data->modelo."') AND t1.id_marca = t2.id
              ORDER BY t3.descripcion";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("PromocionesByMarcaModelo::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
