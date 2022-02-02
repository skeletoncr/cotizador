<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idCaso; // to access idCaso
  $data->id_tipo_prestamo; // to access id_tipo_prestamo

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t4.id as idPromocion,t4.descripcion as promocion,t7.descripcion as tipovehiculo,t8.descripcion,t9.*
              FROM d_bandejatrabajo as t1
              LEFT JOIN d_marcas_modelos as t2 ON trim(t2.modelo) = trim(t1.id_marca_modelo)
              LEFT JOIN d_promociones_marcas_modelos3 as t3 ON trim(t3.modelo) = trim(t1.id_marca_modelo)
              LEFT JOIN d_promociones as t4 ON t4.id = t3.id_promocion AND t4.id_tipo_prestamo = '".$data->id_tipo_prestamo."' AND t4.fecha_activacion <= curdate() AND t4.fecha_vencimiento >= curdate()
              LEFT JOIN d_promociones_detalles as t6 ON t6.id_promocion = t4.id
              LEFT JOIN d_tipovehiculo as t7 ON t6.id_tipovehiculo = t7.id
              LEFT JOIN d_monedas as t8 ON t6.id_moneda = t8.id
              LEFT JOIN d_seccion as t9 ON t6.id_seccion = t9.id
              WHERE t1.id = '".$data->idCaso."'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("PromocionesByCaso::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
