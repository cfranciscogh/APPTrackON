// JavaScript Document
// JavaScript Document
$(document).ready(function(e) {  
	getProgramaciones();
	$("#actualizar").click(function(e) {
        getProgramaciones();
    });
	
	if ($.QueryString["empresa"] == "SODIMA"){
		$("#tituloEmpresa").html("SODIMAC");
	}
	if ($.QueryString["empresa"] == "MAESTR"){
		$("#tituloEmpresa").html("MAESTRO");
	}//tituloEmpresa
	
	$("#regresarEmpresa").attr("href","empresa.html?idChofer=" + $.QueryString["idChofer"]);
	$("#irPicking").attr("href","picking.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
});

 

function alertDismissed(){
}
//

function getProgramaciones(){
	
	$.mobile.loading('show');
	//alert($.QueryString["idChofer"]);   
	$("#listProgramacion").html("");  
	$("#listProgramacionDAD").html("");  
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarPedidos",
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
						if (  resultado[i].IDEstado == 5  || resultado[i].IDEstado == 6 )
							$("#listProgramacion").append('<li data-icon="check"><a>'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</a></li> ');
						else {
							 
				 													 
							$("#listProgramacion").append('<li><a data-ajax="false" href="detalle.html?IDPedido='+resultado[i].IDPedido+'&idChofer='+$.QueryString["idChofer"]+'&empresa='+$.QueryString["empresa"]+'">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</a></li> ');								 
						}
					
					}
					if ( resultado[i].Operacion == "D" ){
						
						if (  resultado[i].IDEstado == 5  || resultado[i].IDEstado == 6 )
		 				$("#listProgramacionDAD").append('<li data-icon="check"><a>'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</a></li> ');
					else {						 
						$("#listProgramacionDAD").append('<li><a data-ajax="false" href="detalle.html?IDPedido='+resultado[i].IDPedido+'&idChofer='+$.QueryString["idChofer"]+'&empresa='+$.QueryString["empresa"]+'">'+ resultado[i].NroOrdenCompra + ' - ' + resultado[i].NombreCliente +'</a></li> ');								 
					}
						
					}
					
				}
				$( "#listProgramacion" ).listview( "refresh" );
				$( "#listProgramacionDAD" ).listview( "refresh" );
			}
			else{
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones #divTABS").fadeOut("fast", function(){
					$("#contentProgramaciones").append("<h3>No se encontraron programaci&oacute;nes para el dia de hoy</h3>").hide().fadeIn("fast");
				});
				//$("#contentProgramaciones").find("h3").remove();
				
			}
        },

        error : function(jqxhr) 
        {
		   console.log(jqxhr);	
           navigator.notification.alert(
            'Error de conexi\u00f3n, contactese con sistemas!',  // message
            alertDismissed,         // callback
            'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
        }

    });		 
	
}
