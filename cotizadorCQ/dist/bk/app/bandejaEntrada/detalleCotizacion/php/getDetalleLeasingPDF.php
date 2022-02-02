<?php
  require_once('../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->idCaso; // to access idCaso

  $m_db;
  $output = null; // Json Array
  try {
    /* Get Query.*/
    $tsql = "SELECT t1.*,t2.*,t4.descripcion as nombreTipoVehiculo,t3.descripcion as nombrePromocion,t5.descripcion as nombreMoneda,
						      t6.cambio_dolar, t6.cambio_dolar_seguros,
                  t7.id_factor_seguro_vida as factorSeguro, t7.comision_agencia as comisionBancaria, t7.precio_gracia as periodosGracia, 
						      t7.subsidio_tasa as subsidioTasa, t7.compra_tasa as compraTasa, t7.subsidio_seguro as subsidioSeguro, t7.rcimaximo,
                  t8.tasa1,t8.tasa2,t8.tasa3,t8.plazo1,t8.plazo2,t8.plazo3,t8.balloonsaldofinanciar,t8.balloonpreciogastos,
                  t9.seguro as bonificacionSeguro, t9.adicional as bonificacionAdicional,
                  t10.codigo as lineaCodigo, t10.descripcion as lineaDescripcion,
                  t11.codigo as subAplicacionCodigo, t11.descripcion as subAplicacionDescripcion,
                  t12.codigo as productoCodigo, t12.descripcion as productoDescripcion,
                  t8.codigo as seccionCodigo, t8.descripcion as seccionDescripcion,
                  t13.a, t13.b, t13.c, t13.d, t13.f, t13.g, t13.h
              FROM d_bandejatrabajo as t1
              LEFT JOIN d_marcas_modelos as t2 ON trim(t2.modelo) = trim(t1.id_marca_modelo)
              LEFT JOIN d_promociones as t3 ON t3.id = t1.id_promocion
              LEFT JOIN d_tipovehiculo as t4 ON t4.id = t2.tipovehiculo
              LEFT JOIN d_monedas as t5 ON t5.id = t1.id_moneda
              LEFT JOIN d_variables as t6 ON t6.id = 1
              LEFT JOIN d_promociones_detalles as t7 ON t7.id_promocion = t1.id_promocion
              LEFT JOIN d_seccion as t8 ON t8.id = t7.id_seccion
              LEFT JOIN d_bonificacion_seguro as t9 ON t9.id = t1.id_bonificacion
              LEFT JOIN d_lineafinanciera as t10 ON t10.id = t7.id_linea_financiera
              LEFT JOIN d_subaplicacion as t11 ON t11.id = t7.id_sub_aplicacion
              LEFT JOIN d_productobanco as t12 ON t12.id = t7.id_producto_bancario
              LEFT JOIN d_seguros_leasing as t13 ON t13.id_tipovehiculo = t2.tipovehiculo AND t13.id_usoseguro = t1.id_uso
              WHERE t1.id ='" . $data->idCaso . "'";
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->query($tsql); // Execute the query
    $results = $m_db->getResult(); // Result
    $m_db->Close(); // Close Conexion
    echo json_encode($results);
  }catch(Exception $e) {
    error_log("DetalleLeasingPDF::get: Exception=" . $e->getMessage());
    $output['error'] = $e->getMessage();
  }
?>
