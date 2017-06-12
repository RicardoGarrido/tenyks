/**
 * Created by Ingrid on 11/06/2017.
 */

/*LOGICA CUARTO MODAL "HOTELES"*/

/*funcion encargada de la llamada a la API*/
var enviarPresupuestoHotelYZona = function(vuelo){
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:8081/listarHoteles.action";
    var presupuesto = document.getElementById("presupuesto").value;
    var zona = vuelo['codDestino']
    var duracion = document.getElementById("duracionViaje").value;
    presupuesto = (presupuesto - vuelo['precio'])/duracion;
    if (presupuesto != null || presupuesto != undefined){
        url+="?presupuesto="+presupuesto
        url+="&zona="+zona
    }
    var params = "";
    xhttp.open("GET", url, false);
    xhttp.send();
    return xhttp.responseText;
}
/*funcion encargada de pintar la dispoHotel*/
var pintarDispoHotel = function(dispoHotel){
    document.getElementById("hospedajeTablaCont").innerHTML="";
    if(Object.keys(dispoHotel).length > 0){
        for(var hotel in dispoHotel){
        document.getElementById("hospedajeTablaCont").innerHTML+="" +
            "<div class='dispoHotel'>" +
                "<div class='hotelTH' data-tableChild='hot"+dispoHotel[hotel]['id']+"'>" +
                    "<span>"+dispoHotel[hotel]['nombre']+ "</span>" +
                    "<span class='categoriaHotel'>"+dispoHotel[hotel]['categoriaByCategoriaId']['nombre']+"</span>" +
                "</div>" +
                "<div class='habitacionTabla hot"+dispoHotel[hotel]['id']+"'></div>" +
            "</div>";
            for(var habitacion in dispoHotel[hotel]['habitacionHotelsById']){
                dispoHotel[hotel]['habitacionHotelsById'][habitacion]['hotelByHotelId'] = dispoHotel[hotel]['nombre'];
                document.querySelectorAll(".habitacionTabla.hot"+dispoHotel[hotel]['id'])[0].innerHTML+="" +
                    "<input id='"+dispoHotel[hotel]['habitacionHotelsById'][habitacion]['id']+"' type='radio' class='radioInvi' name='hotelUrl' value='"
                    +JSON.stringify(dispoHotel[hotel]['habitacionHotelsById'][habitacion])+"' />" +
                    "<label for='"+dispoHotel[hotel]['habitacionHotelsById'][habitacion]['id']+"' class='habitacionTH'>" +
                        "Habitación "+dispoHotel[hotel]['habitacionHotelsById'][habitacion]['tipoHabitacionByTipoHabitacionId']['nombre']
                        +" por "+dispoHotel[hotel]['habitacionHotelsById'][habitacion]['precio']
                        +dispoHotel[hotel]['habitacionHotelsById'][habitacion]['divisaByDivisaId']['simbolo']+"" +
                    "</label>";
            }
        }
    }
    else{
        document.getElementById("hospedajeTablaCont").innerHTML = "<form class='dispoHotelTabla'>No hay ofertas con el presupuesto restante del vuelo:(</form>"
    }
}

/*Metodo encargado de añadir los listeners a la tabla de dispoHotel en el cuarto modal*/
var añadirListenerDispoHoteles = function(th, tabla){
    var elementTh =document.getElementsByClassName(th);
    for(var i = 0; i<elementTh.length; i++){
        elementTh[i].addEventListener("click", function(){
            idTH=this.dataset.tablechild;
            if(document.querySelectorAll("."+idTH+tabla)[0].style.display=="none" || document.querySelectorAll("."+idTH+tabla)[0].style.display==""){
                ocultarTabla(tabla,"."+th)
                document.querySelectorAll("."+idTH+tabla)[0].style.display="block"
            }
            else{
                document.querySelectorAll("."+idTH+tabla)[0].style.display="none"
            }
        });
    }
}

document.querySelectorAll('[data-modal="02"] button#btnToHotel')[0].onclick = function(){
    nextStep('04',3);
    pintarDispoHotel(JSON.parse(enviarPresupuestoHotelYZona(JSON.parse(document.getElementsByClassName("dispoVueloTabla")[0].vueloUrl.value))));
    añadirListenerDispoHoteles("hotelTH",".habitacionTabla")
}
/*FIN LOGICA CUARTO MODAL "HOTELES"*/
