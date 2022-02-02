<?php
  require_once(dirname(__FILE__) . '../../../../php/database.php');

  $data = json_decode(file_get_contents("php://input"));
  $data->id_promocion;  // to access id_promocion
  $data->id_moneda;  // to access id_moneda
  $data->id_linea_financiera;  // to access id_linea_financiera
  $data->id_producto_bancario;  // to access id_producto_bancario
  $data->id_seccion;  // to access id_seccion
  $data->id_sub_aplicacion;  // to access id_sub_aplicacion
  $data->id_factor_seguro_vida;  // to access id_factor_seguro_vida
  $data->solicitudes;  // to access solicitudes
  $data->comision_agencia;  // to access comision_agencia
  $data->precio_gracia;  // to access precio_gracia
  $data->meses_tasafija;  // to access meses_tasafija
  $data->gastos;  // to access gastos
  $data->rcimaximo;  // to access rcimaximo
  $data->subsidio_tasa; // to access subsidio_tasa
  $data->compra_tasa; // to access subsidio_tasa
  $data->subsidio_seguro; // to access subsidio_seguro

  $m_db;
  $output = null; // Json Array
  try {
    $detalle = array(
      "id_promocion" => $data->id_promocion,
      "id_moneda" => $data->id_moneda,
      "id_linea_financiera" => $data->id_linea_financiera,
      "id_producto_bancario" => $data->id_producto_bancario,
      "id_seccion" => $data->id_seccion,
      "id_sub_aplicacion" => $data->id_sub_aplicacion,
      "id_factor_seguro_vida" => $data->id_factor_seguro_vida,
      "solicitudes" => $data->solicitudes,
      "comision_agencia" => $data->comision_agencia,
      "precio_gracia" => $data->precio_gracia,
      "meses_tasafija" => $data->meses_tasafija,
      "gastos" => $data->gastos,
      "rcimaximo" => $data->rcimaximo,
      "subsidio_tasa" => $data->subsidio_tasa,
      "compra_tasa" => $data->compra_tasa,
      "subsidio_seguro" => $data->subsidio_seguro,
      "modifydate" => 'NOW()'
    );
    $m_db = new db(); // Create Object
    $m_db->Connect(); // Connect
    $m_db->insert('d_promociones_detalles',$detalle); // Execute the query
    $getData = $m_db->getResult();
    $m_db->Close(); // Close Conexion
    $output = $getData;
  }catch(Exception $e) {
    error_log("DetallesPromocion::insert_: Exception=" . $e->getMessage());
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
