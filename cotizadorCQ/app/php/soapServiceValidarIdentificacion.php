<?php

  $data = json_decode(file_get_contents("php://input"));
  $data->url; // to access url
  $data->numeroIdentificacion; // to access numeroIdentificacion

  $client = new SoapClient($data->url);

  $atributos = array(
    'numeroIdentificacion' => $data->numeroIdentificacion
	);

	$response = $client->validarIdentificacion($atributos);

  echo json_encode($response);

?>
