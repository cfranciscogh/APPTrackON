// JavaScript Document
var  latitude = "";
var longitude = "";
function onSuccess(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
}

// onError Callback receives a PositionError object
//

function quitarFoto(IDFoto, ctr){
	if ( confirm('Desea quitar esta foto?')){
		$(ctr).parent().parent().remove();
	}
}

function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}

function sendImage(src) {

    src = (src == 'library') ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
    navigator.camera.getPicture(success, fail, {quality: 45, sourceType: src});

                             function success(imageData) {
                             var url = 'http://www.meridian.com.pe/GT_Extranet/TransportesMeridian/Util/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val();
                             var params = {image: imageData};

                             // send the data
                             $.post(url, params, function(data) {
                                     alert('sent');     
                             });
                             }
}

  function fail(message) { alert(message); }

  
//document.addEventListener("deviceready", onDeviceReady, false);
var watchID = null;

$(document).ready(function(e) {
	
	
 $('#btnFoto').click(function (e) { e.preventDefault(); sendImage("camera"); });
    
 
 $('#fileFoto').on('change', function (e) {
	 $.mobile.loading('show'); 
    var files = e.target.files;
    //var myID = 3; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
       if (window.FormData !== undefined) {
           var data = new FormData();
		   data.append("IDPedido", $("#IDPedido").val());
           for (var x = 0; x < files.length; x++){
               data.append("file" + x, files[x]);
           }
		  //console.log($("#IDPedido").val());
           $.ajax({
               type: "POST",
               url: 'http://www.meridian.com.pe/GT_Extranet/TransportesMeridian/Util/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val(),
               contentType: false,
               processData: false,
               data: data,
               success: function(result) {
                   resp = result.toString().split("|");
				   if ( resp[0] == 0) {
				   		alerta(resp[1]);
						setFotosPedido($.QueryString["IDPedido"]);
				   }
					else
						alerta("Error, no se pudo subir la foto");
						
				   $.mobile.loading('hide'); 
				   $('#file').val("");
               },
               error: function (xhr, status, p3, p4){
                   var err = "Error " + " " + status + " " + p3 + " " + p4;
                   if (xhr.responseText && xhr.responseText[0] == "{")
                       err = JSON.parse(xhr.responseText).Message;
                       
					   $('#file').val("");
					   console.log(xhr);
					    console.log(status);
					   alerta("Error, no se pudo subir la foto");
					   $.mobile.loading('hide'); 
                    }
                });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
          }
     }
});
 
 $("#registrarIncidencia").click(function(e) {
        e.preventDefault();
		
		if ( latitude == "" ||  longitude == ""){
			//alert("Ingrese DNI");
			//alerta("No se puede obtener información de ubicación, revise si su GPS se encuentra activo o tenga cobertura de red");
			//return;
		}
			
			
		if ( $("#hora").val() == "" ){
			//alert("Ingrese Tiempo Aprox. de llegada");
			alerta("Ingrese Tiempo Aprox. de llegada");
			$("#hora").focus();
			return;
		}
		
		if ( $("#recepcionado").val() == 1 ){
			
			if ( $("#nombre").val() == "" ){
				//alerta("Ingrese Nombre");
				//$("#nombre").focus();
				//return;
			}
			
			if ( $("#dni").val() == "" ){
				//alerta("Ingrese DNI");
				//$("#dni").focus();
				//return;
			}
			
			if ( latitude == null ||  longitude == null){
			//alert("Ingrese DNI");
			alerta("No se puede obtener información de su ubicación, revise si su GPS se encuentra activo o que se encuentre dentro de red de cobertura");
			return;
			}
			
			
			
		}
		
		
		if ( $("input[name*=tipoIncidencia]:checked").val() ==  null ){			 
				alerta("Seleccionar incidencia");
				$("input[name*=tipoIncidencia").focus();
				return;
		
		}
		
		
	var parametros = new Object();
	parametros.IDTranking = $("#IDTranking").val();	
	parametros.IDPedido = $("#IDPedido").val();	
	parametros.TiempoAproxLlegada = $("#hora").val();	
	parametros.Recepcionado = $("#recepcionado").val();	
	parametros.Nombre = $("#nombre").val();	
	parametros.DNI = $("#dni").val();	
	parametros.IDEstado = $("#estado").val();	
	parametros.Observacion = $("#detalle").val();	
	parametros.Latitud = latitude;	
	parametros.Longitud = longitude;	
	parametros.Incidencia = $("input[name*=tipoIncidencia]:checked").val();	 
	parametros.FlagMail = 0;
	parametros.HoraInicio = $("#hora_inicio").val();	 
	parametros.HoraFin = $("#hora_fin").val();	 
	//console.log(parametros);
	//console.log(parametros);
	//return;
		
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingV2",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 if ( resultado.code == 1){
				 $("#myPopup").popup("close");
				 $("#detalle").val("");
				 $("input[name*=tipoIncidencia]").removeAttr("checked");
				 //$("#IDTranking").val(resultado.codigo);	
				 //setTracking($("#IDPedido").val());
			 }			 
			 //alert(resultado.message);
			 alerta(resultado.message);
			 
        },

        error : function(jqxhr) 
        {
		  //console.log(jqxhr);	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		
		
		//
		
		
    });
	
	
	
	$("input[id*='opcion']").change(function(e) {	 
		//console.log($("label[for*='" + $(this).attr("id") + "']").find("img").attr("title") );
        $("#txtIncidencia").html( $("label[for*='" + $(this).attr("id") + "']").find("img").attr("title") );
    });

	setPedido($.QueryString["IDPedido"]);
	setTracking($.QueryString["IDPedido"]);
	setFotosPedido($.QueryString["IDPedido"]);
	$("#IDPedido").val($.QueryString["IDPedido"]);
	$("#regresarPanel").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] + "&empresa=" + $.QueryString["empresa"]);
	
	$("#tituloEmpresa").html($.QueryString["empresa"]);
	
 
	
	setIncidencias_Tracking($.QueryString["empresa"]);
	
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
	 
	
	$("#guardarTracking").click(function(e) {
        e.preventDefault();
		
		if ( latitude == "" ||  longitude == ""){
			//alert("Ingrese DNI");
			//alerta("No se puede obtener información de ubicación, revise si su GPS se encuentra activo o tenga cobertura de red");
			//return;
		}
			
			
		if ( $("#hora").val() == "" ){
			//alert("Ingrese Tiempo Aprox. de llegada");
			alerta("Ingrese Tiempo Aprox. de llegada");
			$("#hora").focus();
			return;
		}
		
		if ( $("#recepcionado").val() == 1 ){
			
			if ( $("#nombre").val() == "" ){
				//alerta("Ingrese Nombre");
				//$("#nombre").focus();
				//return;
			}
			
			if ( $("#dni").val() == "" ){
				//alerta("Ingrese DNI");
				//$("#dni").focus();
				//return;
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
	parametros.FlagMail = 1;
	parametros.HoraInicio = $("#hora_inicio").val();	 
	parametros.HoraFin = $("#hora_fin").val();	 
	//console.log(parametros);
	//return;
		
	$.mobile.loading('show'); 
	$.ajax({
       //url : "http://localhost:8099/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTraking",
	    url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingV2",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 alerta(resultado.message);
			 
			 if ( resultado.code == 1){
				  //location.href =  $("#regresarPanel").attr("href");
			 		//$("#regresarPanel").click();
			 
				 $("#IDTranking").val(resultado.codigo);	
				 setTracking($("#IDPedido").val());
			 }			 
			 //alert(resultado.message);
			
			
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
	
 if ( $(control).val() == 5 ){
	 $("#DIVIncidencia").show();
 }
 else{
 	$("#DIVIncidencia").hide();
 } 
 
  if ( $(control).val() == 4 ){
	$(" #btnIncidencia").show("fast");
 }
 else{
	$(" #btnIncidencia").hide("fast");
 } 
 

}


function setTracking(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerTraking",
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
					HabilitarIncidencia($("#estado"));
					$("#estado").html("");
					$("#estado").append("<option selected value='"+resultado[i].IDEstado+"'>"+resultado[i].Estado+"</option>");
					if ( resultado[i].IDEstado == 4 ) {
						 $("#btnIncidencia").fadeIn("fast");					 
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
						//$("#estado").append("<option value='5'>PENDIENTE DE ENTREGA</option>");
					}
					 
					
					if ( resultado[i].IDEstado > 3 ) {
						$("#DIVEstado").fadeIn("fast");
						$("#DIVRecepcionado").fadeIn("fast");
						$(".contentAtencion").fadeIn("fast");
						$("#hora").val(resultado[i].TiempoAproxLlegadaFormat);
						$("#hora_inicio").val(resultado[i].Hora_Inicio);
						$("#hora_fin").val(resultado[i].Hora_Termino);
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



function setIncidencias_Tracking(empresa){
	
	if (empresa!="SOLTRA")
		empresa = "TODOS";
		
	$("#incidencia").html("<option value='0'>Seleccionar Incidencia</option>");
	//$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/Obtener_IncidenciaNontregado",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"Empresa":"'+empresa+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$("#incidencia").append("<option value='"+resultado[i].IDIncidencia+"'>"+resultado[i].Descripcion+"</option>");					
				}
				$("#incidencia").selectmenu('refresh', true);
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
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerPedido",
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
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerDetallePedido",
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


function setFotosPedido(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarFotos",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);			
			$(".panelFotos").html("");
			//console.log(resultado);
			$.mobile.loading('hide');
			var html = "";
			if ( resultado.length > 0 ){
				html = "<table width='100%'><tr>";		
				for (var i = 0; i<resultado.length;i++){
					html += "<td style='vertical-align:top;' width='50%'><div class='imgPanel'><img src='"+ resultado[i].Ubicacion.replace("~","http://www.meridian.com.pe/GT_Extranet") + "' width='100%'/> <a onclick='quitarFoto("+ resultado[i].IDFoto + ", this)'>Borrar</a></div></td>";
					if ( (i%2)!=0 && i>0 )
						html += "</tr><tr>"; 			 
				}
				html += "</tr></table>";		
				$(".panelFotos").append(html);	
			}
			else
				$(".panelFotos").html("<h3>No se encontro informaci&oacute;n</h3>");
			
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
