/**
 * Created by Ingrid on 08/05/2017.
 */

//    linea
var points = [];
function crearLineaFin(){
    var lineGenerator = d3.line()
        .curve(d3.curveCardinal);
    var svgWidth = window.innerWidth;
    svgWidth-=((svgWidth/100)*10);
    var pointsConuter=0;
    points = [
        [30, 110],
        [svgWidth*0.2, 15],
        [svgWidth*0.3, 200]
        ,
        [svgWidth*0.6, 15],
        [svgWidth*0.9, 180],
        [svgWidth, 15]
    ];
    console.log(points);

    var pathData = lineGenerator(points);

    d3.select('path')
        .attr('d', pathData) ;

    d3.select('svg')
        .selectAll('text')
        .data(points)
        .enter()
        .append('text')
        .text("X")
        .attr('counter', function(){
            pointsConuter=parseInt(pointsConuter)+1;
            pointsConuter="0"+pointsConuter;
            return pointsConuter;
        })
        .attr('x', function(d) {
            return (d[0]-18);
        })
        .attr('y', function(d) {
            return (d[1]+15);
        })
        .attr('class','arrow_box')}
crearLineaFin();


// encontrar padre especifico
function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

// cerrar modal
var cerrarModalBoton=document.getElementsByClassName("closeModal");
console.log("hola")
Array.from(cerrarModalBoton).forEach(function(element) {
    element.addEventListener('click', function(){
        console.log("entra");
        let modalPadre=findAncestor(this, "modal");
        modalPadre.style.right="110%";
    });
});


// funcionalidad modals
var nextStep = function(dataModal,point){
    var dataModals = document.querySelectorAll('[data-modal]');
    for (var i = 0; i<dataModals.length; i++){
        document.querySelectorAll('[data-modal]')[i].style.display="none";
    }
    document.querySelectorAll('[data-modal="'+dataModal+'"]')[0].style.display="block";
    console.log('[counter="'+dataModal+'"]');
    svgCont.style.width=points[point][0]+18+"px";
}

// empezar el viaje pulsando ancho
document.getElementsByClassName("start")[0].onclick = function(){
    this.style.display="none";
    document.querySelectorAll('[data-modal]')[0].style.display="block";
}
// informacion adicional
document.getElementsByClassName("extraInfoStarter")[0].onclick = function(){
    if(document.getElementsByClassName('extraInfo')[0].style.right=="110%"){
    document.getElementsByClassName('extraInfo')[0].style.right="0%";}
    else{
        document.getElementsByClassName('extraInfo')[0].style.right="110%";
    }
}



document.getElementsByClassName("resetDispo")[0].onclick = function(){
    console.log("reset!");
    window.location.reload();
}
//listeners en x del mapa para aumentar el tamaño
var svgCont=document.getElementsByClassName("contenedorSVG")[0];
var mapPoints=document.getElementsByTagName("text");

//resize del svg para responsive
window.onresize = function(){
    crearLineaFin();
    var mapPoints=document.getElementsByTagName("text");
    for(var i =0; i<mapPoints.length;i++){
        mapPoints[i].setAttribute("x", (points[i][0]-18));
    }
};
