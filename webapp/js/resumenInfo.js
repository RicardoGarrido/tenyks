/**
 * Created by Ingrid on 12/06/2017.
 */

/*Funcion encargada de pintar el resumen*/
var pintarReasumen = function(noHotel){
    var hotel=undefined;
    if(document.getElementById("hospedajeTablaCont").hotelUrl != undefined && noHotel==undefined){
        hotel=JSON.parse(document.getElementById("hospedajeTablaCont").hotelUrl.value);
    }
    var vuelo=JSON.parse(document.getElementsByClassName("dispoVueloTabla")[0].vueloUrl.value);
    var duracion = document.getElementById("duracionViaje").value;
    document.getElementById("resumenInfo").innerHTML="<div><p>Vuelo desde "+
        vuelo['codOrigen'] +" a "+ vuelo['codDestino']+" con salida el "+formatearFecha(vuelo['salida'])+" y vuelta el "+
        formatearFecha(vuelo['vuelta'])+" por:</p><div class='precioResumen'>"+
        vuelo['precio']+vuelo['divisa']+"</div></div>"

    url="https://www.skyscanner.es/transporte/vuelos/"+ vuelo['codOrigen'] +
        "/" +  vuelo['codDestino'] + "/" + formatearFechaURL(vuelo['salida']) + "/"
        + formatearFechaURL(vuelo['vuelta']) + "/"
    document.getElementById("resumenURLs").innerHTML="<div><a target='_blank' href='"+url+"'>URL vuelo</a></div>"

    if(hotel != undefined && noHotel==undefined){
        document.getElementById("resumenInfo").innerHTML+="<div><p>habitacion "+
            hotel['tipoHabitacionByTipoHabitacionId']['nombre']+" en el "+hotel['hotelByHotelId']+" por:</p><div class='precioResumen'><p>"+
            String(parseInt(hotel['precio'])*parseInt(duracion))+hotel['divisaByDivisaId']['simbolo']+"</p></div></div>" +
            "<div class='totalResumen'><p>Total: </p><div class='precioResumen'><p>"+String(parseInt(hotel['precio'])*parseInt(duracion)+parseInt(vuelo['precio']))+vuelo['divisa']+"</div></div>"
        document.getElementById("resumenURLs").innerHTML+="<div><p>obtención de Hoteles reales en desarrollo<p></div>"
    }




}

document.querySelectorAll('[data-modal="04"] button.toResumen')[0].onclick = function(){
    nextStep('06',5);
    pintarReasumen();
}

document.querySelectorAll('[data-modal="03"] button.toResumen')[0].onclick = function(){
    nextStep('06',5);
    pintarReasumen("noHotel");
}
