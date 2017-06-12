/**
 * Created by Ingrid on 10/06/2017.
 */

/*LOGICA PRIMER-SEGUNDO MODAL*/
/*Variables globales*/
var dispo;
var actualDispoSeleccionada;
/*Metodo encargado de hacer las llamadas axaj para a traves del presupuesto solicitar la lista de vuelos disponibles*/
var enviarPresupuesto = function(precio){
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:8081/listarVuelos.action";
        if (precio != null || precio != undefined){
            url+="?presupuesto="+precio
        }
    var params = "";
    xhttp.open("GET", url, false);
    xhttp.send();
    return xhttp.responseText;
}

/*Metodo encargado de devolver la fecha del dia de hoy en un formato complensible para los input.value */
var informarFechaActualInput = function(){
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
}

/*Metodo de estructurar el modal a partir de la informacion de los vuelos disponibles*/
var recogerArrayDeContinentes = function(listaVuelos){
    var continentes = {};
    for(var vuelo in listaVuelos){
        var nombreContinente = listaVuelos[vuelo].ciudadByDestinoId.paisByPaisId.continenteByContinenteId.nombre;
        continentes[nombreContinente] = continentes[nombreContinente] || {};
        var nombrePais = listaVuelos[vuelo].ciudadByDestinoId.paisByPaisId.nombre;
        continentes[nombreContinente][nombrePais] = continentes[nombreContinente][nombrePais]||{};
        var nombreCiudad = listaVuelos[vuelo].ciudadByDestinoId.nombre;
        if(continentes[nombreContinente][nombrePais][nombreCiudad]== undefined || continentes[nombreContinente][nombrePais][nombreCiudad]>listaVuelos[vuelo]["precio"]){
            continentes[nombreContinente][nombrePais][nombreCiudad]={
                'codOrigen':listaVuelos[vuelo]["ciudadByOrigenId"]["codigo"],
                'codDestino':listaVuelos[vuelo]["ciudadByDestinoId"]["codigo"],
                'precio':listaVuelos[vuelo]["precio"],
                'salida':listaVuelos[vuelo]["fechaSalida"],
                'vuelta':listaVuelos[vuelo]["fechaVuelta"],
                'divisa':listaVuelos[vuelo]["divisaByDivisaId"]['simbolo']
            };

        }
    }
    return continentes
}
/*Metodo para formatear fechas*/
var formatearFecha = function(fecha){
    var fechaSalida = new Date(fecha);
    return fechaSalida.getDate() + "/" +(fechaSalida.getMonth()+1)+"/"+fechaSalida.getFullYear();
}

/*Metodo para formatear fechas para la url de vuelo*/
var formatearFechaURL = function(fecha){
    var fechaSalida = new Date(fecha);
    return fechaSalida.getFullYear().toString().substr(-2)+("0"+(fechaSalida.getMonth()+1)).substr(-2)+("0"+fechaSalida.getDate()).substr(-2);
}
/*Metodo para calcular el total de vuelos de un continente o país*/

/*Metodo encargado de pintar la tabla en el segundo modal*/
var pintarDispoContinetes = function(dispoContinentes){
    if(Object.keys(dispoContinentes).length > 0){
        var counter = 0;
        document.getElementById("dispoContinetnes").innerHTML = "<form class='dispoVueloTabla'></form>"
        for(var continente in dispoContinentes){
            document.getElementsByClassName("dispoVueloTabla")[0].innerHTML+="<div class='continenteTH'>"+continente+"</div><div class='paisesTabla "+continente+"'></div>"
            var counterPais = 0;
            for(var pais in dispoContinentes[continente]){
                document.getElementsByClassName("paisesTabla")[counter].innerHTML+="<div class='paisTH'>"+pais+"</div><div class='ciudadesTabla "+pais+"'></div>"
                for(var ciudad in dispoContinentes[continente][pais]){
                    document.querySelectorAll("."+continente+" .ciudadesTabla")[counterPais].innerHTML+="<input id='"+dispoContinentes[continente][pais][ciudad]['codDestino']+"' type='radio' class='radioInvi' name='vueloUrl' value="+JSON.stringify(dispoContinentes[continente][pais][ciudad])+" />" +
                        "<label for='"+dispoContinentes[continente][pais][ciudad]['codDestino']+"' class='ciudadTH'>"+ciudad+" por "+dispoContinentes[continente][pais][ciudad]['precio']+
                        dispoContinentes[continente][pais][ciudad]['divisa']+
                        " con salida el "+formatearFecha(dispoContinentes[continente][pais][ciudad]['salida'])+" y vuelta el "+
                        formatearFecha(dispoContinentes[continente][pais][ciudad]['vuelta'])+"</label>"
                }
                counterPais++;
            }
            counter++;
        }
    }
    else{
        document.getElementById("dispoContinetnes").innerHTML = "<form class='dispoVueloTabla'>No hay ofertas con ese presupuesto :(</form>"
    }
}
/*Metodo para ocultar todas las tablas*/
var ocultarTabla = function(tabla, th){
    for(var i = 0; i<document.querySelectorAll(th).length;i++){
        document.querySelectorAll(th)[i].style.background="none"
    }
    for(var i = 0; i<document.querySelectorAll(tabla).length;i++){
        document.querySelectorAll(tabla)[i].style.display="none"
    }
}
/*Metodo encargado de añadir los listeners a la tabla de dispo en el segundo modal*/
var añadirListenerDispoContinentes = function(th, tabla){
    var elementTh =document.getElementsByClassName(th);
    for(var i = 0; i<elementTh.length; i++){
        elementTh[i].addEventListener("click", function(){
            idTH=this.innerText;
            if(document.querySelectorAll("."+idTH+tabla)[0].style.display=="none" || document.querySelectorAll("."+idTH+tabla)[0].style.display==""){
                ocultarTabla(tabla,"."+th)
                document.querySelectorAll("."+idTH+tabla)[0].style.display="block"
                this.style.background="white";
            }
            else{
                document.querySelectorAll("."+idTH+tabla)[0].style.display="none"
            }
        });
    }
}
/*listener en el boton next del primer modal para cargar la dispo inicial*/
document.querySelectorAll('[data-modal="01"] button.next')[0].onclick = function(){
    nextStep('02',1);
    document.getElementById('fechaSalida').valueAsDate = new Date();
    var precio = document.getElementById("presupuesto").value;
    dispo = JSON.parse(enviarPresupuesto(precio))
    pintarDispoContinetes(recogerArrayDeContinentes(JSON.parse(enviarPresupuesto(precio))));
    añadirListenerDispoContinentes("continenteTH",".paisesTabla");
    document.querySelectorAll(".continenteTH")[0].click();
    añadirListenerDispoContinentes("paisTH",".ciudadesTabla");

}

/*FILTROS*/
/*funciona encargada de filtrar segun el filtroFechaSalida seleccionado*/
var filtroFechaSalidaFiltrar = function(vuelo, filtroFechaSalida, fechaSalida){
    var vueloFechaSalida = new Date(vuelo['fechaSalida']);
    var FiltrofechaSalida = new Date(fechaSalida);
    vueloFechaSalida.setHours(0,0,0,0);
    FiltrofechaSalida.setHours(0,0,0,0);
    if(filtroFechaSalida==0 && vueloFechaSalida.getTime()>FiltrofechaSalida.getTime()){
        return true
    }
    else if(filtroFechaSalida==1 && vueloFechaSalida.getTime()<FiltrofechaSalida.getTime()){
        return true
    }
    else if(filtroFechaSalida==2 && vueloFechaSalida.getTime()==FiltrofechaSalida.getTime()){
        return true
    }
    else{
        return false
    }
}
/*funcion encargada de filtrar la dispo para obtener una nueva que se acote a la seleccionada y devolverla*/
var filtrarDispo = function(dispo){
    var fechaSalida = document.getElementById("fechaSalida").value;
    var filtroFechaSalida = document.getElementById("filtroFechaSalida").value;
    var copiaDispo = JSON.parse(JSON.stringify(dispo));
    for(var i = copiaDispo.length-1; i>=0;i--){
        if(!filtroFechaSalidaFiltrar(copiaDispo[i],filtroFechaSalida,fechaSalida)){
            copiaDispo.splice(i,1);
        }
    }
    return copiaDispo;
}
document.getElementById("fechaSalida").onchange = function(){
    pintarDispoContinetes(recogerArrayDeContinentes(filtrarDispo(dispo)));
    añadirListenerDispoContinentes("continenteTH",".paisesTabla");
    document.querySelectorAll(".continenteTH")[0].click();
    añadirListenerDispoContinentes("paisTH",".ciudadesTabla");
}

document.getElementById("filtroFechaSalida").onchange = function(){
    pintarDispoContinetes(recogerArrayDeContinentes(filtrarDispo(dispo)));
    añadirListenerDispoContinentes("continenteTH",".paisesTabla");
    document.querySelectorAll(".continenteTH")[0].click();
    añadirListenerDispoContinentes("paisTH",".ciudadesTabla");
}
/*FIN LOGICA PRIMER-SEGUNDO MODAL*/
