<?php

  Class DB_SqlServer_Properties {
    public $m_connection = null; // Conection argument
    public $m_strINSTANCE = null; // Instance

    /**
    * Set Connect database
    *
    */
    public function setConnect($p_connection){
      /* Connect using Authentication.*/
      $this->m_connection = $p_connection;
    }

    /**
    * get Connect database
    *
    */
    public function getConnect(){
      /* Connect using Authentication.*/
      return $this->m_connection;
    }

    /**
    * Close the database
    *
    */
    public function Close(){
      unset($this->m_connection);
    }

    /**
    * Open the database produccion
    *
    */
    public function ConnectMysql() {
      try{
        $strUser = "usr_cotizador"; // User
        $strPass = "UGQCredT@^5*1"; // Password
        $strDB = "CotizadorCQ"; // DB Name
        $strServer = "190.0.226.126:3333"; // Server

        $this->m_connection = new mysqli($strServer, $strUser, $strPass, $strDB);

        if ($this->m_connection->connect_errno) {
          echo "Failed to connect to MySQL: (" . $this->m_connection->connect_errno . ") " . $this->m_connection->connect_error;
        }
      }catch(Exception $e){
        $strError = "::ConnectMysql: Exception=" . $e->getMessage();
        error_log($strError); 
        echo $strError;
      }
    }

    /**
    * Open the database desarrollo
    *
    */
    public function ConnectMysqlDesa() {
      try{
        $strUser = "usr_cotizador"; // User
        $strPass = "UGQCredT@^5*1"; // Password
        $strDB = "CotizadorCQ"; // DB Name
        $strServer = "calidad.grupoq.co.cr:3306"; // Server

        $this->m_connection = new mysqli($strServer, $strUser, $strPass, $strDB);

        if ($this->m_connection->connect_errno) {
          echo "Failed to connect to MySQL: (" . $this->m_connection->connect_errno . ") " . $this->m_connection->connect_error;
        }
      }catch(Exception $e){
        $strError = "::ConnectMysql: Exception=" . $e->getMessage();
        error_log($strError); 
        echo $strError;
      }
    }
  }
?>
