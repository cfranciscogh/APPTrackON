// JavaScript Document
// JavaScript Document
$(document).ready(function(e) {  
	getProgramaciones();
	
	 $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
	
	$("#agregarOC").click(function(e) {
		 
		 e.preventDefault();
		
		if (  $("#oc").val()== "" ){
			alerta("Ingresar OC");
			$("#oc").focus();
		}
		else{
			
			$.mobile.loading('show');
			$.ajax({
				url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerTrakingPorOC",
				type: "POST",
				//crossDomain: true,
				dataType : "json",
				data : '{"oc":"' + $("#oc").val() + '"}',
				//contentType: "xml",
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);
					//console.log(resultado);
					$.mobile.loading('hide');
					if ( resultado.length > 0  ){
						if ( resultado[0].IDEstado == 1 ){
							alerta("OC no ha sida programda.");
						}
						else if ( resultado[0].IDEstado == 2 ){
							actualizarChofer(resultado[0].IDPedido,$.QueryString["idChofer"]);
						}
						else{
							alerta("Pedido ya esta despachado.");
						}
						//alerta("Picking realizado con éxito");
						//getProgramaciones();
						//alert(resultado[0].mensaje);
					}
					else{
						$("#oc").val("");
						alerta("OC no existe!");
						$("#oc").focus();
					}
				},	
				error : function(jqxhr) 
				{
				   console.log(jqxhr);	
				   alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}			
			});
		}
	});
	
	 
	$("#actualizar").click(function(e) {
		var IDPedido = "";
		$("#listProgramacion input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		
		$("#listProgramacionDAD input").each(function(index, element) {
			if ( $(this).is(":checked") ){
				  IDPedido = IDPedido + "," + $(this).data("pedido");
			}
    	});
		 
		if ( IDPedido == ""){
			alerta('Debe seleccionar 1 o mas OC');
			return;	
		}
		
		$.mobile.loading('show');
		$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/PickingPedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedidos":"' + IDPedido + '"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado == 1 ){
				alerta("Picking realizado con éxito");
				$("#myPopup").popup("close");
				getProgramaciones();
				//alert(resultado[0].mensaje);
			}
        },

        error : function(jqxhr) 
        {
		   console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	
	
		 
        
		
    });
	
	if ($.QueryString["empresa"] == "SODIMA"){
		$("#tituloEmpresa").html("SODIMAC");
	}
	if ($.QueryString["empresa"] == "MAESTR"){
		$("#tituloEmpresa").html("MAESTRO");
	}//tituloEmpresa
	
	$("#regresarEmpresa").attr("href","empresa.html?idChofer=" + $.QueryString["idChofer"]);
	$("#irTracking").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
	
	 
	
});

function actualizarChofer(IDPedido,IDChofer){
	
	$.mobile.loading('show');
			$.ajax({
				url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/actualizarChofer",
				type: "POST",
				//crossDomain: true,
				dataType : "json",
				data : '{"IDPedido":"' + IDPedido + '","IDChofer":"' + IDChofer + '"}',
				//contentType: "xml",
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);
					console.log(resultado);
					$.mobile.loading('hide');
					if ( resultado == 1  ){
						alerta('OC agregada con exito.');
						$("#myPopup").popup("close");
						getProgramaciones();
					}
				},	
				error : function(jqxhr) 
				{
				   console.log(jqxhr);	
				   alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}			
			});
	
}


function alertDismissed(){
}
//

function getProgramaciones(){
	
	
	
	$.mobile.loading('show');
	//alert($.QueryString["idChofer"]);   
	$("#listProgramacion").html("");  
	$("#listProgramacionDAD").html("");  
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB_TEST/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarPedidosPicking",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDChofer":"'+$.QueryString["idChofer"]+'", "Empresa":"'+$.QueryString["empresa"]+'"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
		
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones #divTABS").fadeIn("fast");
				var count = 0;
				for (var i = 0; i<resultado.length;i++){
					
					if ( resultado[i].Operacion == "E" ){
						//alert(resultado[i].IDEstado);
						if (  resultado[i].IDEstado == 1 )
							$("#listProgramacion").append('<input data-pedido="' + resultado[i].IDPedido +  '" disabled="disabled" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');
						else {
							 
				 													 
							$("#listProgramacion").append('<input data-pedido="' + resultado[i].IDPedido +  '" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');								 
						}
						
						$("#listProgramacion input").checkboxradio().checkboxradio("refresh");
						//$("#listProgramacion").find("input").last().checkboxradio().checkboxradio("refresh");
					
					}
					if ( resultado[i].Operacion == "D" ){
						
						if (  resultado[i].IDEstado == 1 )
		 				$("#listProgramacionDAD").append('<input data-pedido="' + resultado[i].IDPedido +  '" disabled="disabled" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');
					else {						 
						$("#listProgramacionDAD").append('<input data-pedido="' + resultado[i].IDPedido +  '" type="checkbox" name="checkbox-' + i + '" id="checkbox-' + i + '"><label for="checkbox-' + i + '">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</label> ');								 
					}
					
						$("#listProgramacionDAD input").checkboxradio().checkboxradio("refresh");
						
					}
					
				}
				//$( "#listProgramacion" ).listview( "refresh" );
				//$( "#listProgramacionDAD" ).listview( "refresh" );
			}
			else{
				$("#contentProgramaciones #divTABS").fadeOut("fast", function(){
					$("#contentProgramaciones").append("<h3>No se encontraron programaci&oacute;nes para el dia de hoy</h3>").hide().fadeIn("fast");
				});
				//$("#contentProgramaciones").find("h3").remove();
				
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
