 <?php 

  require_once('db.sqlserver.properties.php'); // Class DB_SqlServer_Properties
  require_once('utils.php'); // Class DB_SqlServer_Properties

	class db {

    public $m_connection = null; // Conection argument
	  public $m_strquery;
	  public $m_strtable;
	  public $m_results;

    /**
    * Set Connect database
    *
    */
    public function isReservedWord($p_value) {
      $array = array("NOW()","DATE(NOW())");
      if (in_array($p_value, $array)) {
        return true;
      }else{
        return false;
      }
    }

    /**
    * Set Connect database
    *
    */
    public function setConnect($p_connection) {
      /* Connect using Authentication.*/
      $this->m_connection = $p_connection;
    }

    /**
    * get Connect database
    *
    */
    public function getConnect() {
      /* Connect using Authentication.*/
      return $this->m_connection;
    }      

    /**
    * connect the database 
    *
    */      
    public function Connect() {
      $SqlServerProperties = new DB_SqlServer_Properties(); // Create Object 
      $SqlServerProperties->ConnectMysql();	// Open Conexion produccion
      //$SqlServerProperties->ConnectMysqlDesa();	// Open Conexion desarrollo
      $this->m_connection	 = $SqlServerProperties->getConnect(); // Get Conexion
      unset($SqlServerProperties); // Free Memory 		
    }  

    /**
    * Close the database
    *
    */
    public function Close() {
      unset($this->m_connection); 
    } 

    /**
    * Set Connect database
    *
    */
    public function setTable($p_strtable) {
    /* Connect using Authentication.*/
      $this->m_strtable = $p_strtable;
    }

    /**
    * get Connect database
    *
    */
    public function getTable() {
      /* Connect using Authentication.*/
      return $this->m_strtable;
    }   

    /**
    * get Pagination
    *
    */
    public function getPagination() {
      if (!isset($_GET["num_rec_per_page"]))
        $_GET["num_rec_per_page"] = 10;

      if (isset($_GET["page"])) {
        $page = $_GET["page"];
      } else {
        $page=1;
      };
      $start_from = ($page-1) * $_GET["num_rec_per_page"];
      $sql = " LIMIT $start_from, " . $_GET["num_rec_per_page"];
      return $sql;
    }

    /**
    * get Total Pages
    *
    */
    public function getTotalPage($p_total_records) {
      $total_pages = ceil($p_total_records / $_GET["num_rec_per_page"]);

      return $total_pages;
    }

    /**
    * get Pagination
    *
    */
    public function getTotalRecords($p_query) {
      $iTotalRecords = 0;
      $p_query =  str_replace('FROM', 'SELECT COUNT(*) as counter FROM ', $p_query);
      //echo $p_query;
      /* Execute the query. */
      $this->m_connection->query("SET NAMES utf8"); //FIXED (Gets $connection from config.php and runs the query "SET NAMES utf8")
      $getData = $this->m_connection->query( $p_query );

      /* Loop thru recordset and display each record. */
      if ( $aRow = $getData->fetch_assoc() ) {
        $iTotalRecords = $aRow["counter"];
      }

      return $iTotalRecords;
    }

    /**
    * query the database
    *
    */
    public function query($p_sql) {
      try {
        /* Execute the query. */
        $this->m_connection->query("SET NAMES utf8"); //FIXED (Gets $connection from config.php and runs the query "SET NAMES utf8")
        $getData = $this->m_connection->query( $p_sql );

        /* Loop thru recordset and display each record. */
        while ( $aRow = $getData->fetch_assoc() ) {
			    //print_r($aRow);
          $arrayKeys = array_keys($aRow);
          $arrayValues = array_values($aRow);
          //print_r($arrayValues);
          $row = array();
          $strValor = "";
          for ( $ii=0 ; $ii<count($arrayKeys) ; $ii++ ) {
            $special  = $arrayValues[ intval($ii) ];
			      $strValue = '"'. $arrayKeys[$ii] . '" : "' . $special . '"';
			      array_push($row, $strValue);
			    }
			    $row = join(",", $row);
			    $this->m_results[]  = "[{" . $row . "}]";
			  }

      }catch(Exception $e) {
        $str_error = "::query: Exception=" . $e->getMessage();
        error_log($str_error);
        $output = array(
          "error" => $str_error,
          "jsonSuccess" => false
        );
        $this->m_results = $output;
      }
    }

    /**
    * execute the database
    *
    */
    public function execute() {
      try {
        /* Execute the query. */
        $this->m_connection->query("SET NAMES utf8"); //FIXED (Gets $connection from config.php and runs the query "SET NAMES utf8")
        $getData = $this->m_connection->query( $this->m_strquery );

        if($this->m_connection->error) {
          $output = array(
            "error" => "ERROR: " . $this->m_connection->error,
            "jsonSuccess"  => false
          );
        }else {
          $output = array(
            "jsonSuccess"  => true
          );
        }	

        $this->m_results = $output;

      }catch(Exception $e){
        $str_error = "::query: Exception=" . $e->getMessage();
        error_log($str_error);
        $output = array(
          "error"    	  => $str_error,
				  "jsonSuccess"  => false
        );
        $this->m_results = $output;
      }
    }

    /**
    * getResult the database
    *
    */
    public function getResult() {
      /* concat the query. */
      return $this->m_results;
    }

    /**
    * select the database
    *
    */
    public function select($p_strsql) {
      /* concat the query. */
      $this->m_strquery = $p_strsql;
    }

    /**
    * setQuery the database
    *
    */
    public function setQuery($p_strsql) {
      /* concat the query. */
      $this->m_strquery = $p_strsql;
    }

    /**
    * getQuery the database
    *
    */
    public function getQuery() {
      /* concat the query. */
      return $this->m_strquery;
    }

    /**
    * where the database
    *
    */
    public function where() {
      /* concat the query. */
      $this->m_strquery .=  " WHERE ";
    }

    /**
    * AddCondicion the database
    * example : AddCondicion("id = 50 ","AND");
    */
    public function AddCondicion($p_strsql,$p_strCondition) {
      /* concat the query. */
      $this->m_strquery .= $p_strsql . " " . $p_strCondition;
    }

    /**
    * update the search
    *
    */
    public function search($p_source,$data) {
      $strQuery = "";
      if (isset($p_source["data_search"]) && strlen($p_source["data_search"]) != 0) {
        if(strpos($this->m_strquery, " WHERE "))
          $strQuery .= " AND ";
          //$strQuery = str_replace('WHERE', ' AND ', $this->m_strquery);
        else
          $strQuery .= " WHERE ";

        if (isset($p_source["data_typesearch"]) && $p_source["data_typesearch"] != "label_searchmodifieddate") {
          foreach ($data as $key => $value) {
            $strQuery .= " " . $key . " LIKE '%" . $p_source["data_search"] . "%'";
            $strQuery .= " OR ";
          }

          $strQuery .= "OR|";
          $strQuery  = str_replace(" OR OR|","",$strQuery);
          //echo $this->m_strquery;
        }else {
          foreach ($data as $key => $value) {
            $strQuery .=  $key . " >= '" . $p_source["data_date1"] . "' AND ";
            $strQuery .=  $key . " <= '" . $p_source["data_date2"] . "'";
            $strQuery .=  " OR ";
          }

          $strQuery .= "OR|";
          $strQuery  = str_replace(" OR OR|","",$strQuery);
        }
        //echo $strQuery . "aqui";
      }
      return " " . $strQuery;
    }

    /**
    * delete the database
    *
    */
    public function delete() {
      try {
        /* Execute the query. */
        $getData = $this->m_connection->query( $this->m_strquery );

		    if($this->m_connection->error) {
				  $output = array(
				    "error" => "ERROR: " . $this->m_connection->error,
            "SQLQUERY" => $this->m_strquery,
				    "jsonSuccess"  => false
				  );
			  }else {
				  $output = array(
				    "jsonSuccess"  => true
				  );
			  }

        $this->m_results = $output;

      }catch(Exception $e) {
        $str_error = "::query: Exception=" . $e->getMessage();
        error_log($str_error);
        $output = array(
          "error" => $str_error,
          "SQLQUERY" => $this->m_strquery,
				  "jsonSuccess" => false
        );
        $this->m_results = $output;
      }
    }

    /**
    * insert the database
    *
    */
    public function insert($p_strtable,$data) {
      try {
        $columns = array();
        $values  = array();
        /* get values and keys for query. */
        foreach ($data as $key => $value) {
          array_push($columns, $key);
          array_push($values , $value);
        }

        /* concat the query. */
        $this->m_strquery .= "INSERT INTO " . $p_strtable;
        $this->m_strquery .= "(";
        /* concat columns the query. */
        foreach ($columns as $value) {
          $this->m_strquery .= $value;
          $this->m_strquery .= ",";
        }
        $this->m_strquery .= ")";
        $this->m_strquery .= " VALUES ";
        $this->m_strquery .= "(";

        /* concat values the query. */
        foreach ($values as $value) {
          if (is_numeric($value) || $this->isReservedWord($value)){
            $number =  str_replace(',', '', $value);
            $this->m_strquery .=  $value;
          }else {
            $special = $value; //Utils::Remove_SpecialCharacters($value);
            $this->m_strquery .= "'" . $special . "'";
          }
          $this->m_strquery .= ",";                        
        }
        $this->m_strquery .= ")";  
        $this->m_strquery = str_replace(",)",")",$this->m_strquery);

        //echo $this->m_strquery;                                                                
        /* Execute the query. */
        $this->m_connection->query("SET NAMES utf8"); //FIXED (Gets $connection from config.php and runs the query "SET NAMES utf8")                      
        $getData = $this->m_connection->query( $this->m_strquery );

        if($this->m_connection->error) {
          $output = array(
            "error" => "ERROR: " . $this->m_connection->error,
            "SQLQUERY"     => $this->m_strquery,
            "jsonSuccess"  => false
          );
        }else {
          $output = array(
            "last_id" => $this->m_connection->insert_id,
            "jsonSuccess"  => true
          );
        }
        $this->m_results = $output;

      }catch(Exception $e) {
        $str_error = "::query: Exception=" . $e->getMessage();
        error_log($str_error);
        $output = array(
          "error" => $str_error,
				  "jsonSuccess" => false
        );

			  $this->m_results = $output;
      }
    }

    /**
    * update the database
    *
    */
    public function update($p_strtable,$data) {
      try {
        /* concat the query. */
        $this->m_strquery .= "UPDATE " . $p_strtable . " SET ";

        foreach ($data as $key => $value) {
          if (is_numeric($value) || $this->isReservedWord($value)){
            $number =  str_replace(',', '', $value);
            $this->m_strquery .= $key . " = " . $number;
          }else {
            $special = $value; //Utils::Remove_SpecialCharacters($value);
            $this->m_strquery .= $key . " = '" . $special . "'";
          }
          $this->m_strquery .= ",";
        }
        $this->m_strquery .= ",|";
        $this->m_strquery  = str_replace(",,|","",$this->m_strquery);
        //echo $this->m_strquery;

        }catch(Exception $e) {
          $str_error = "::query: Exception=" . $e->getMessage();
          error_log($str_error);
          $output = array(
            "error" => $str_error,
            "SQLQUERY" => $this->m_strquery,
				    "jsonSuccess" => false
          );
          $this->m_results = $output;
        }
      }       
	}
?>
