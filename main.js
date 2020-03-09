// Conectamos al servidor websocket
var socket = io.connect('http://localhost:3000', { 'forceNew': true });
var type = 'author';
var idlistcount = 0;
var idElement = 0;
/**
 * Función que se encarga de pintar en el HTML los mensajes
 * @param {*} data 
 */
function render(data){
    // si el tipo de comentario es del autor se crea un elemento mas en la lista, si es un comentario de tipo respuesta se crea otra lista dentro de la lista a la que se va hacer la respuesta
    if(data.type == 'author'){
        // id del elemento list
        idlistcount++;
        //Creamos una plantilla con los datos a mostrar, la función map se encarga de iterar los datos que llegan a través del socket, el método join pintara los elementos del array con un espacio `
        var html = document.createElement('li')
        html.innerHTML = `
            <li id="${idlistcount}">
                <div class="comment-main-level">
                    <!-- Avatar -->
                    <div class="comment-avatar">
                        <img src="http://i9.photobucket.com/albums/a88/creaticode/avatar_2_zps7de12f8b.jpg">
                    </div>
                    <!-- Contenedor del comentario -->
                    <div class="comment-box">
                        <div class="comment-head">
                            <h6 class="comment-name"><a href="">${data.user}</a></h6>
                            <span>${ago(data.createdAt, data.time)}</span>
                            <span onclick="response(this)" id="${idlistcount}" style="cursor:pointer"><a>Responder</a></span>
                            <i class="fa fa-reply" aria-hidden="true"></i>
                            <i class="fa fa-heart" aria-hidden="true"></i>
                        </div>
                        <div class="comment-content">
                            ${data.msg}
                        </div>
                    </div>
                </div>
            </li>
        `  
        //Cuando el template esta completo lo insertamos en el DOM dentro del div con id messages
        document.getElementById('comments-list').appendChild(html)
    }else if(data.type == 'response'){
        var html = document.createElement('ul');
        html.setAttribute('class', 'comments-list reply-list')
        html.innerHTML = `
            <li>
                <!-- Avatar -->
                <div class="comment-avatar">
                    <img src="http://i9.photobucket.com/albums/a88/creaticode/avatar_2_zps7de12f8b.jpg">
                </div>
                <!-- Contenedor del comentario -->
                <div class="comment-box">
                    <div class="comment-head">
                        <h6 class="comment-name"><a href="">${data.user}</a></h6>
                        <span>${ago(data.createdAt, data.time)}</span>
                        <i class="fa fa-reply" aria-hidden="true"></i>
                        <i class="fa fa-heart" aria-hidden="true"></i>
                    </div>
                    <div class="comment-content">
                        ${data.msg}
                    </div>
                </div>
            </li>
        `
         //Cuando el template esta completo lo insertamos en el DOM dentro del div con id messages
         document.getElementById(data.idElement).appendChild(html)
    }
    
    
}

/**
 * Función que se encarga de realizar el calculo de intervalos de tiempo que ha transcurrido los comentarios devolviendo el calculo de tiempo desde que se emitió el comentario hasta la fecha actual
 * @param {*} dateInicial Fecha que se emitió el comentario
 * @param {*} timeInicial Hora que se emitió el comentario
 */
function ago(dateInicial, timeInicial){
   // Capturamos valores de los tiempos de fecha
   var tiempo1tmp= dateInicial;
   var tiempo2tmp= new Date().toLocaleDateString();
   // Capturamos los valores de tiempos de hora
   var time1tmp = timeInicial;
   var time2tmp = new Date().toLocaleTimeString();

   // Separamos la fecha por la barra invertida
   var tiempo1split= tiempo1tmp.split('/');
   var tiempo2split= tiempo2tmp.split('/');

   // Separamos la hora por los dos puntos
   var time1split = time1tmp.split(':');
    var time2split= time2tmp.split(':');
  
   // Creamos las fechas 
   var tiempo1 = new Date(tiempo1split[2], tiempo1split[1], tiempo1split[0], time1split[0], time1split[1], time1split[2], 0)
   var tiempo2 = new Date(tiempo2split[2], tiempo2split[1], tiempo2split[0], time2split[0], time2split[1], time2split[2], 0)
   // Obtenemos los tiempos en milisegundos
   var dif = tiempo1.getTime() - tiempo2.getTime()

   // Calculamos el intervalo de tiempo entre las fechas
   var Segundos_de_T1_a_T2 = dif / 1000;
   var Segundos_entre_fechas = Math.abs(Segundos_de_T1_a_T2);

   // Realizamos la conversión de tiempos
   var minutes = Math.floor(Segundos_entre_fechas / 60);
   var hours = Math.floor(Segundos_entre_fechas / 3600);
   var days = Math.floor(Segundos_entre_fechas / 86400);
   var week = Math.floor(Segundos_entre_fechas / 604800);
   var month = Math.floor(Segundos_entre_fechas / 2419200);
   var year = Math.floor(Segundos_entre_fechas / 29030400);

   /**
    * Validamos cuando se haga la conversión de tiempos para que se muestre el texto en pantalla del tiempo transcurrido
    */
   if(Segundos_entre_fechas == 0){
    return 'hace 1 segundo.';
   }else if(Segundos_entre_fechas > 0 && Segundos_entre_fechas < 60){
        if(Segundos_entre_fechas == 1){
            return 'hace ' + Segundos_entre_fechas + " segundo." 
        }else{
            return 'hace ' + Segundos_entre_fechas + " segundos." 
        }
   }else if(minutes > 0 && minutes < 60){
        if(minutes == 1){
            return 'hace ' + minutes + " minuto." 
        }else{
            return 'hace ' + minutes + " minutos." 
        }
   }else if(hours > 0 && hours < 24){
        if(hours == 1){
            return 'hace ' + hours + " hora." 
        }else{
            return 'hace ' + hours + " horas." 
        }
   }else if(days > 0 && days < 7){
        if(days == 1){
            return 'hace ' + days + " dia." 
        }else{
            return 'hace ' + days + " dias." 
        }
   }else if(week > 0 && week < 5){
        if(week == 1){
            return 'hace ' + week + " semana." 
        }else{
            return 'hace ' + week + " semanas." 
        }
   }else if(month > 0 && month < 12){
       if(month == 1){
        return 'hace ' + month + " mes."
       }else{
        return 'hace ' + month + " meses."
       }
   }else if(year > 0){
       if(year == 1){
        return 'hace ' + year + " año." 
       }else{
        return 'hace ' + year + " años." 
       }
   }

   console.log("Segundos: "+ Segundos_entre_fechas);
   console.log("Minutos: "+ minutes);
   console.log("Horas: "+ hours);
   console.log("Dias: "+ days);
   console.log("Semanas: "+ week);
   console.log("Meses: "+ month);
   console.log("Años: "+ year);
}

//Escuchamos el evento messages data contiene el array de mensajes que nos manda el servidor
socket.on('message', function(data){
    render(data);
    //Limpiamos los campos de texto
    document.getElementById('username').value= '',
    document.getElementById('texto').value = '';
    //console.log(data);
});

/**
 * Función que se encarga de realizar el cambio de tipo a respuesta y obtener el id del chat al que se le va a responder
 * @param {*} el elemento span que contiene el id actual del comentario
 */
function response(el){
    type = 'response';
    //id del elemento span response
    idElement = el.id;
}

/**
 * Función que se encarga de recoger el valor de los input y enviá el mensaje por el socket con el mensaje new-message
 * @param {*} e 
 */
function addMessages(e){
    //Data que se va enviar al servidor websocket
    var mensaje = {
        user: document.getElementById('username').value,
        msg: document.getElementById('texto').value,
        type: type,
        id: idElement,
        date: new Date('03/08/2020').toLocaleDateString(),
        //time: new Date('03/08/2020 20:38:04').toLocaleTimeString()
        time: new Date().toLocaleTimeString()
    };

    //emitimos un mensaje y le mandamos la data
    socket.emit('send-message', mensaje);
    type = 'author';
    return false;
}