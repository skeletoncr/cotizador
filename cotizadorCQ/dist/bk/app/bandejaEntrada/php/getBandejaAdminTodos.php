<?php
  require_once('../../php/database.php');

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*,t2.descripcion as descripcionmoneda,t3.valor as valoranno,t4.login_
              FROM d_bandejatrabajo as t1
              LEFT JOIN d_monedas as t2 ON t2.id = t1.id_moneda
              LEFT JOIN d_annos as t3 ON t3.id = t1.anno
              LEFT JOIN d_usuarios as t4 ON t4.id = t1.id_usuario
              WHERE t1.id_estado != 4
              ORDER BY id DESC";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("Bandeja::Get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
