<?php
class login {
    private $email;
    private $password;

    public function __construct ($email, $password) {
        $this -> email = $email;
        $this -> password = $password;
    }
    
    public function login ($email_correcto, $password_correcto) {
        if ($this->email ===$email_correcto && $this->password===$password_correcto){
            return true;
        }else{
            return false;
        }
    }
}
if ($_SERVER["REQUEST_METHOD"]== "POST") {
    $email_escrito = $_POST['email'];
    $password_escrita = $_POST['password'];
    $intento_login = new login($email_escrito, $password_escrita);
    $resultado = $intento_login->login("julio@smartpaper.com", "mi_clave_secreta_777");
    if ($resultado === true) {
        echo "!LOGIN EXITOSO¡ BIENVENIDO," . $email_escrito;
    }else {
        echo "!DATOS INCORRECTOS¡. !INTENTA DE NUEVO¡";
    }
}
?>