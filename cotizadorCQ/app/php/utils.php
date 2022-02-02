<?php
	class Utils {

    /**
    * Procedure for limpiarString
    *
    */
    public static function limpiarString($string) { //función para limpiar strings
      $string = strip_tags($string);
      $string = htmlentities($string);
      $string = mysql_real_escape_string($string);
      return stripslashes($string);
    }

    /** proccedure json encode  */
    public static function get_json_encode($p_ObjectValue) {
      try {
        $strResult = json_encode($p_ObjectValue);
        $strResult = str_replace("\\","",$strResult);
        $strResult = str_replace("[\"","",$strResult);
        $strResult = str_replace("\"]","",$strResult);
        $strResult = str_replace("\"]","",$strResult);
        $strResult = str_replace("}]\"","}",$strResult);
        $strResult = str_replace("\"[{","{",$strResult);
        //$strResult = html_entity_decode($strResult);
      }catch(Exception $e) {
        $strResult = $e->getMessage();
      }
      return $strResult;
    }

    /** proccedure json encode  */
    public static function get_json_decode($p_ObjectJsonValue) {
      try {
          $strResult = str_replace("space", " ", $p_ObjectJsonValue);
          $strResult = json_decode($strResult,true);
      }catch(Exception $e) {
        $strResult = $e->getMessage();
      }
      return $strResult;
    }

    /** Quita tildes y ese tipo de caracteres y los convierte en html */
    public static function Remove_SpecialCharacters($p_specialvalue) {
      $strResult = $p_specialvalue;
      //$strResult = Utils::limpiarString($strResult);
      $strResult = htmlentities($p_specialvalue, ENT_QUOTES, "UTF-8");
      //$strResult =htmlspecialchars($p_specialvalue,ENT_QUOTES,'UTF-8',false);
      //$strResult = str_replace("�","",$p_specialvalue);
      //$strResult = str_replace('&uuml;', '�', $strResult );
      //***inicio|$strResult = preg_replace("/[^a-zA-Z0-9\-]/", "space", $p_specialvalue);
      //$strResult = preg_replace("/^[\-]+/", "", $strResult);
      //$strResult = preg_replace("/[\-]+$/", "", $strResult);
      //$strResult = preg_replace("/[\-]{2,}/", "space", $strResult);
      //$strResult = str_replace("space", ' ', $strResult);
      //$strResult = str_replace("\r", " ", $strResult);
      //$strResult = str_replace("\n", " ", $strResult);
      //$strResult = str_replace("\t", " ", $strResult);
      return $strResult;
    }

    /** Quita tildes y ese tipo de caracteres y los convierte en html */
    public static function decode_SpecialCharacters($p_specialvalue) {
      $strResult = $p_specialvalue;
      $strResult = html_entity_decode($p_specialvalue);
      return $strResult;
    }

    /** Upload */
    public static function upload() {
      $output = array(                  
        "jsonSuccess" => true
      );

      $strResult = Utils::get_json_encode($output); // Get json_encode
      return $strResult;
    }

    /** Upload content directory */
    public static function uploaddirectoryclient($sourcePost) {
      $strPath = "view/uploads/_" . $sourcePost['data_pathid'] . "/";
      $results = null;
      if (is_dir($strPath)) {
        $counter = 0;
        if ($dh = opendir($strPath)) {
          while (($file = readdir($dh)) !== false) {
            if($file != '.' && $file != '..') {
              $strValue = '"'. "filename" . $counter . '" : "' . $file . '"';
              $results[]  = "[{" . $strValue . "}]"; 
              $counter++;
            }
          }
          closedir($dh);
        }
      }
      $output = array(
        "jsonSuccess" => true,
        "documentpath" => $strPath,
        "documentid" => $sourcePost['data_pathid'],
        "aaData" => $results
      );
      $strResult = Utils::get_json_encode($output); // Get json_encode
      $_SESSION['DATAJSONPath'] = $strResult;
      return $strResult;
    }

    /** Upload Files  */
    public static function uploadfiles($sourcePost) {//http://code.tutsplus.com/tutorials/uploading-files-with-ajax--net-21077
      $strPath = "view/uploads/_" . $_GET['data_pathid'] . "/";
      if (!is_dir($strPath)) {
        mkdir($strPath, 0777, true);
      }
      foreach ($_FILES["files"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
          $name = $_FILES["files"]["name"][$key];
          move_uploaded_file( $_FILES["files"]["tmp_name"][$key], $strPath . $_FILES['files']['name'][$key]);
        }
      }
      $output = array(
        "jsonSuccess" => true,
        "message" => "Successfully Uploaded"
      );

      $strResult = Utils::get_json_encode($output); // Get json_encode
      return $strResult;
    }  
	}
?>