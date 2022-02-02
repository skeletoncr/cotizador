<?php
  require_once('Mailer/class.phpmailer.php'); // phpmailer
  require_once('Mailer/class.smtp.php'); // phpmailer

  $data = json_decode(file_get_contents("php://input"));
  $data->email;  // to access email
  $data->subject;  // to access email
  $data->message;  // to access email
  $data->data;  // to access dataUrl
  $nombrearch = 'cotizacion.pdf';

  $bReturn = false;
  $mail = new PHPMailer(true);
  $mail->IsSMTP();
  $mail->Host = "ssl://smtp.gmail.com"; //usar el servidor SMTP
  $mail->SMTPDebug = 1;
  $mail->SMTPAuth = true;
  $mail->Port = 465;
  $mail->Username = "crediqcr@crediq.com"; // usar el usuario de autentificacion del SMTP
  $mail->Password = "SeRviSaC17"; // Usar la clave a la cuenta de correo que se va a usar para enviar el correo.
  $mail->AddAddress($data->email, 'CrediQ'); //Remitente del formulario
  $mail->SetFrom('crediqcr@crediq.com', 'CrediQ'); //Correo electronico de quien envia el formulario
  $mail->Subject = $data->subject;
  $descodificado = base64_decode($data->data);
  $mail->AddStringAttachment($descodificado,$nombrearch,'base64');
  $mail->AltBody = 'To view the message, please use an HTML compatible email viewer!'; // optional - MsgHTML will create an alternate automatically
  $mail->MsgHTML($data->message);
  if($mail != null && !$mail->send()) {
    echo 'Message could not be sent. # Mailer Error: ' . $mail->ErrorInfo;
  }else {
    $bReturn = true;
  }
  //print_r($message);
  return $bReturn;
?>
