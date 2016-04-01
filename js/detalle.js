// JavaScript Document
var  latitude = "";
var longitude = "";
function onSuccess(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
}

// onError Callback receives a PositionError object
//
function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}

//document.addEventListener("deviceready", onDeviceReady, false);
var watchID = null;

$(	document).ready(function(e) {
    
//function onDeviceReady() {

	setPedido($.QueryString["IDPedido"]);
	setTracking($.QueryString["IDPedido"]);
	$("#IDPedido").val($.QueryString["IDPedido"]);
	$("#regresarPanel").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] + "&empresa=" + $.QueryString["empresa"]);
	
	if ($.QueryString["empresa"] == "SODIMA"){
		$("#tituloEmpresa").html("SODIMAC");
	}
	if ($.QueryString["empresa"] == "MAESTR"){
		$("#tituloEmpresa").html("MAESTRO");
	}//tituloEmpresa
	
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
	 
	
	$("#guardarTracking").click(function(e) {
        e.preventDefault();
		
		if ( latitude == "" ||  longitude == ""){
			//alert("Ingrese DNI");
			alerta("No se puede obtener información de ubicación, revise si su GPS se encuentra activo o tenga cobertura de red");
			return;
			}
			
			
		if ( $("#hora").val() == "" ){
			//alert("Ingrese Tiempo Aprox. de llegada");
			alerta("Ingrese Tiempo Aprox. de llegada");
			$("#hora").focus();
			return;
		}
		
		if ( $("#recepcionado").val() == 1 ){
			
			if ( $("#nombre").val() == "" ){
			//alert("Ingrese Nombre");
			alerta("Ingrese Nombre");
			$("#nombre").focus();
			return;
			}
			
			if ( $("#dni").val() == "" ){
			//alert("Ingrese DNI");
			alerta("Ingrese DNI");
			$("#dni").focus();
			return;
			}
			
			if ( latitude == null ||  longitude == null){
			//alert("Ingrese DNI");
			alerta("No se puede obtener información de su ubicación, revise si su GPS se encuentra activo o que se encuentre dentro de red de cobertura");
			return;
			}
			
			
			
		}
		
		
		if ( $("#estado").val() == "5" ){
			if ( $("#incidencia").val() == "0" ){
				alerta("Seleccionar incidencia");
				$("#incidencia").focus();
				return;
			}
		}
		
		
	var parametros = new Object();
	parametros.IDTranking = $("#IDTranking").val();	
	parametros.IDPedido = $("#IDPedido").val();	
	parametros.TiempoAproxLlegada = $("#hora").val();	
	parametros.Recepcionado = $("#recepcionado").val();	
	parametros.Nombre = $("#nombre").val();	
	parametros.DNI = $("#dni").val();	
	parametros.IDEstado = $("#estado").val();	
	parametros.Observacion = $("#observacion").val();	
	parametros.Latitud = latitude;	
	parametros.Longitud = longitude;	
	parametros.Incidencia = $("#incidencia").val();	 
	
	//console.log(parametros);
	//return;
		
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTraking",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 if ( resultado.code == 1){
				 $("#IDTranking").val(resultado.codigo);	
				 setTracking($("#IDPedido").val());
			 }			 
			 //alert(resultado.message);
			 alerta(resultado.message);
        },

        error : function(jqxhr) 
        {
		  console.log(jqxhr);	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		
		
		//
		
		
    });
	
//};

});



function HabilitarIncidencia(control){
	
 if ( $(control).val() == 5 )
	 $("#DIVIncidencia").show();
 else
 	$("#DIVIncidencia").hide();
 

}


function setTracking(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerTraking",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 
			if ( resultado.length > 0 ){
				
				for (var i = 0; i<resultado.length;i++){					
					//$(".titulo").val(resultado[i].IDTraking);
					$("#IDTranking").val(resultado[i].IDTraking);
					$("#IDPedido").val(resultado[i].IDPedido);
					$("#observacion").val(resultado[i].Observacion.trim());
					if (resultado[i].Recepcionado){
						$("#recepcionado").val(1);
						$("#recepcionado").slider('refresh');
						$(".contentDatos").slideDown("fast");
						$("#nombre").val(resultado[i].Nombre.trim());
						$("#dni").val(resultado[i].DNI.trim());
					}
					
					$("#estado").html("");
					$("#estado").append("<option selected value='"+resultado[i].IDEstado+"'>"+resultado[i].Estado+"</option>");
					
					if ( resultado[i].IDEstado == 4 ) {
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
						//$("#estado").append("<option value='5'>PENDIENTE DE ENTREGA</option>");
					}
					
					if ( resultado[i].IDEstado > 3 ) {
						$("#DIVEstado").fadeIn("fast");
						$("#DIVRecepcionado").fadeIn("fast");
						$("#hora").val(resultado[i].TiempoAproxLlegadaFormat);
					}
					
					$("#estado").selectmenu( "refresh" )		
					break;
				}
			}
			else{
			}
        },

        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}






function valirRecepcion(ctrlSelect){
	$(".contentDatos").slideUp("fast");
	if ( $(ctrlSelect).val() == 1 )
		$(".contentDatos").slideDown("fast");
}

function alertDismissed(){
}
//

function setPedido(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerPedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){
				
				for (var i = 0; i<resultado.length;i++){
					$(".oc").html(resultado[i].NroOrdenCompra);
					$(".titulo").html(resultado[i].NroOrdenCompra);
		 		 	$(".cliente").html(resultado[i].NombreCliente);
					$(".dni").html(resultado[i].DocumentoCliente);
					$(".blt").html(resultado[i].BLT_FME);
					$(".fch_entrega").html(resultado[i].FechaEntregaFormat);
					$(".provincia").html(resultado[i].NomProvincia);
					$(".distrito").html(resultado[i].NomDistrito);
					$(".direccion").html(resultado[i].DireccionEntrega);
					$(".referencia").html(resultado[i].Referencia);
					$(".telefono").html(resultado[i].Telefono);
					$(".mail").html(resultado[i].Email);
					$(".observacion").html(resultado[i].Observacion);					
					setDetallePedido(idPedido);					
					break;
				}
				//$( "#listProgramacion" ).listview( "refresh" );
			}
			else{
				//$("#contentProgramaciones").html("");
//				$("#contentProgramaciones").html("<h3>No se encontraron programaci&oacute;nes para el dia de hoy</h3>");
//				//Mensaje
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}





function setDetallePedido(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerDetallePedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){
					$(".contentDetalle").append("<p><b>"+resultado[i].Descripcion+"</b><br><b>Tipo: </b>"+resultado[i].Tipo+"<br><b>SKU: </b>"+resultado[i].SKU+"<br><b>Cantidad: </b>"+resultado[i].Cantidad+"</p>");				 
				}
			}
			else{
				$("#contentProgramaciones").html("");
				$("#contentProgramaciones").html("<h3>No se encontro informaci&oacute;n</h3>");
//				//Mensaje
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
		   alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}

function alerta(mensaje){
	alert(mensaje);
	return;
	 navigator.notification.alert(
            mensaje,  // message
            alertDismissed,         // callback
           'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	
}


function alertDismissed(){
}
