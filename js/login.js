// JavaScript Document
// JavaScript Document
$(document).ready(function(e) {
    	$("#ingresar").click(function(e) {
            e.preventDefault();
			$.mobile.loading('show');
			setTimeout(loginValidar, 500);
        });
});

var loginValidar = function(){
	
	  if ( $("#usuario").val() == "" && $("#clave").val() == "" )
   	{
		 $.mobile.loading('hide');
	   navigator.notification.alert(
            'Complete los campos',  // message
            alertDismissed,         // callback
            'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	   return;
   	} 
	 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Autenticacion/LoginChofer.asmx/LoginChofer",
        type: "POST",
		crossDomain: true,
        dataType : "json",
        data : '{"usuario" : "' + $("#usuario").val() + '", "clave" : "' + $("#clave").val() + '"}',
        contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
          resultado = $.parseJSON(data.d);
		  //console.log(resultado);
		  if ( resultado.code == 1){
			  location.href = "empresa.html?idChofer=" + resultado.datos[0].codigo;
			   //$.mobile.changePage( "panel.html", {changeHash:true,transition: "slide", reloadPage:true, data: "idChofer=" + resultado.datos[0].codigo} );
		  }
		  else{
			   $.mobile.loading('hide');
			   navigator.notification.alert(
					'Usuario y/o clave son incorrectos!',  // message
					alertDismissed,         // callback
					'Informaci\u00f3n',            // title
					'Aceptar'                  // buttonName
				);
			   $("#usuario").val("");
			   $("#clave").val("");
			   $("#usuario").focus();
			   $(".loadLogin").fadeOut("fast");
		  }
        },

        error : function(jqxhr) 
        {
			$.mobile.loading('hide');
           navigator.notification.alert(
            'Error de conexi\u00f3n, contactese con sistemas!',  // message
            alertDismissed,         // callback
            'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
        }

    });	
	
	
	
/*   if ( $("#usuario").val() == "admin" && $("#clave").val() == "1234" )
   {
	  
   }
   else{
	   $.mobile.loading('hide');
	   navigator.notification.alert(
            'Usuario y/o clave son incorrectos!',  // message
            alertDismissed,         // callback
            'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        );
	   $("#usuario").val("");
	   $("#clave").val("");
	   $("#usuario").focus();
	   $(".loadLogin").fadeOut("fast");
   }*/
   
};

function alertDismissed(){
}
