// Modelo
const appModelo = (function() {
  //** Contiene 3 elementos. Elemento 0 -> Indica si existe algun set activo,
  //** El 1 -> Indica el ID del ejercicio activo, El 2 -> indica los sets restantes
  let activeSet = [false, -1, -1];
  let listExercise = [];
  const newExercise = function(ID, name, reps, sets) {
    this.name = name;
    this.ID = ID;
    this.reps = reps;
    this.sets = sets;
  };
  const getlastID = function() {
    let lastID;
    if (listExercise.length > 0) {
      console.log("IF : La lista es larga :  ", listExercise.length);
      lastID = listExercise[listExercise.length - 1].ID;
      return lastID + 1;
    } else {
      console.log("Else : La lista es larga :  ", listExercise.length);
      return 0;
    }
  };
  const findElement = function(ID) {
    // Crear una copia de todos los ID existente en la lista
    let allIDs = listExercise.map(el => {
      return el.ID;
    });
    //Conseguir el indice del elemento con el ID correspondiente
    return (position = allIDs.findIndex(el => el === ID));
  };
  return {
    checkList: function() {
      if (listExercise.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    restart: function() {
      listExercise = [];
      activeSet = [false, -1, -1];
    },
    addExercise: function(name, reps, sets) {
      let ID, newExc;
      //Crear el objeto con los nuevos datos
      ID = getlastID();
      console.log("El ID : ", ID);
      newExc = new newExercise(ID, name, reps, sets);
      listExercise.push(newExc);
      console.log(listExercise);
      //Se retorna
      return newExc;
    },
    deleteExercise: function(ID) {
      let position;
      position = findElement(ID);
      // Finalmente removerlo
      y = listExercise.splice(position, 1);
      console.log("Se acaba de eliminar el siguiente elemento: ");
      console.log("Lista actualizada: ");
      console.log(listExercise);
    },
    reduceSet: function(ID) {
      position = findElement(ID);
      if (listExercise[position].sets > 0) {
        //Indicar que ha sido iniciado un set
        activeSet[0] = true;
        activeSet[1] = ID;
        activeSet[2] = position;
        //Actualizar la cantidad de sets
        return (listExercise[position].sets = listExercise[position].sets - 1);
      } else {
        return -1;
      }
    },
    setActive: function() {
      return activeSet[0];
    },
    setDone: function() {
      activeSet[0] = false;
      return [activeSet[1], listExercise[activeSet[2]].sets];
    },
    returnSetActive: function() {
      return activeSet[1];
    }
  };
})();

let test = (function() {
  const hola = function() {
    console.log("HOla");
  };
  return {
    hola: hola
  };
})();

//Vista

let appVista = (function() {
  let DomStrings = {
    input_exerciseName: ".input-exercise-name" /*Verificado*/,
    input_excerciseSets: ".input-exercise-sets" /*Verificado*/,
    input_excerciseReps: ".input-exercise-reps" /*Verificado*/,
    input_Min: "input-min",
    input_Seg: "input-seg",
    input_exerciseFields: ".input-data" /*Verificado*/,
    btn_Rest: "rest",
    btnAddExercise: ".btn-add" /*Verificado*/,
    btn_removeFromList: ".delete",
    btn_listActions: "btn-list-action" /*Verificado*/,
    btn_exerciseListDone: ".btn-list-done" /*Verificado*/,
    btn_exerciseListRestart: ".btn-routine-restart",
    div_exerciseList: ".app__exercise-list" /*Verificado*/,
    div_mainSection: ".app__main-section" /*Verificado*/,
    div_inputTimer: ".timer" /*Verificado*/,
    div_exerciseItem: ".exercise-detail",
    div_navBar: ".nav",
    div_TimerCount: ".timer__count",
    text_timerMin: ".timer-min",
    text_timerSeg: ".timer-seg",
    soundAlarm: "sound_alarm",
    app: ".app"
  };
  let isAlarmActive = false;
  let activeExercise = null;
  let timer = false;
  let idTimer;
  let rest = [0, 0];
  const finishTimer = function() {
    if (timer) {
      changeStatusTimer();
    }
    clearInterval(idTimer);
    removeTimer();
    isAlarmActive = false;
  };
  const restIsDone = function() {
    if (timer) {
      return false;
    } else {
      if (isAlarmActive) {
        isAlarmActive = false;
        finishTimer();
        showInputTimer();
      }
      return true;
    }
  };
  const changeStatusTimer = function() {
    timer = !timer;
  };
  const getDomStrings = function() {
    return DomStrings;
  };
  const getInputs = function() {
    return {
      name: document.querySelector(DomStrings.input_exerciseName).value,
      sets: parseInt(document.querySelector(DomStrings.input_excerciseSets).value),
      reps: parseInt(document.querySelector(DomStrings.input_excerciseReps).value)
    };
  };
  const clearFields = function() {
    document.querySelector(DomStrings.input_exerciseName).value = "";
    document.querySelector(DomStrings.input_excerciseSets).value = "";
    document.querySelector(DomStrings.input_excerciseReps).value = "";
  };
  const updateList = function(obj) {
    console.log(obj);
    const codHTML = `<div class="exercise-detail">
          <div class="exercise-detail-name">
            <span class="exercise-name">${obj.name}</span>
            <div class="repAndSets"><span>${obj.sets}</span><span>x</span><span>${obj.reps}</span></div>
          </div>
          <div class="exercise-detail-sets"><span>${obj.sets}</span></div>
          <div class="exercise-detail-reps"><span>${obj.reps}</span></div>
          <div class="exercise-detail-actions" id="${obj.ID}"><button class="delete"></button></div>
        </div>`;
    document.querySelector(DomStrings.div_exerciseList).insertAdjacentHTML("beforeend", codHTML);
    // document.querySelector(DomStrings.)
    document.querySelector(DomStrings.input_exerciseName).focus();
  };
  const removeExercise = function(exerciseSelectedID) {
    document.getElementById(exerciseSelectedID).parentNode.remove();
  };
  const removeInputFields = function() {
    /*Verificado*/
    if (document.querySelector(DOM.input_exerciseFields)) {
      document.querySelector(DOM.input_exerciseFields).remove();
    }
  };
  const removeInputTimer = function() {
    if (document.querySelector(DomStrings.div_inputTimer)) {
      document.querySelector(DomStrings.div_inputTimer).remove();
    }
  };
  const showInputTimer = function() {
    if (!document.querySelector(DomStrings.div_inputTimer)) {
      const inputTimer = `<div class="timer"><div><span>Descanso </span><img src="img/stopwatch-outline.svg" alt="Temporizador"  height="30px" />  </div> <div class="input-timer"> <input  type="text" onkeypress="return appControlador.onlyNumbers(event);" value="${rest[0]}" id="input-min" size="1"> <span>min</span><input type="text" value="${rest[1]}" onkeypress="return appControlador.onlyNumbers(event);" id="input-seg" size="1">  <span>seg</span></div></div>`;
      document.querySelector(DomStrings.div_mainSection).insertAdjacentHTML("afterbegin", inputTimer);
    }
  };
  const showTimer = function(min, seg) {
    if (!document.querySelector(DomStrings.timer)) {
      const Timer = `<div class="timer"><div class="timer__count"> <span class="timer-min"> ${min} </span> <span>:</span><span class="timer-seg"> ${seg}</span> <img src="img/stop-circle-outline.svg" class="stop-timer" alt="Parar" height="30px" /></div></div>`;
      document.querySelector(DomStrings.div_mainSection).insertAdjacentHTML("afterbegin", Timer);
    }
  };
  const prepareListForTraining = function(newClass) {
    //Selecciona el primer ejercicio de la lista para empezar a entrenar
    let firstExcercise = document.getElementById("0");
    activeExercise = firstExcercise.closest(DomStrings.div_exerciseItem);
    activeExercise.classList.add("active_element");

    //Cambia la clase de los botones para empezar los sets
    if (newClass === "start") {
      let btnDelete;
      btnDelete = document.querySelectorAll(DomStrings.btn_removeFromList);
      console.log("Aqui");
      console.log(btnDelete);
      [...btnDelete].forEach(btn => {
        btn.textContent = "Iniciar";
        btn.classList = "start";
      });
    }
  };
  const changeActionButtonForList = function() {
    // Operador ternario que evalua que clase posee el boton, y lo cambiar
    document.getElementById(DomStrings.btn_listActions).classList =
      document.getElementById(DomStrings.btn_listActions).classList[0] === "btn-list-done" ? "btn-routine-restart" : "btn-list-done";
    // Operador ternario que texto posee el boton, y lo cambia
    document.getElementById(DomStrings.btn_listActions).textContent =
      document.getElementById(DomStrings.btn_listActions).classList[0] === "btn-routine-restart" ? "Reiniciar rutina" : "Rutina Lista - Iniciar";
  };
  const updateSetLeft = function(exerciseSelectedID, newValue) {
    const exerciseSelected = document.getElementById(exerciseSelectedID);
    //Se actualiza el valor de los sets
    exerciseSelected.parentNode.children[1].textContent = newValue;
    //Se cambia el boton para luego activar el descanso
    exerciseSelected.children[0].textContent = "Completo";
    exerciseSelected.children[0].classList = "rest";
  };
  const setDone = function(exerciseID) {
    let newEl;
    const exerciseSelected = document.getElementById(exerciseID);
    exerciseSelected.parentNode.style = "text-decoration-line: line-through";
    newEl = document.createElement("span");
    newEl.textContent = "Terminado";
    exerciseSelected.parentNode.replaceChild(newEl, document.getElementById(exerciseID));
  };
  const setStart = function(ID) {
    document.getElementById(ID).children[0].classList = "start";
    document.getElementById(ID).children[0].textContent = "Iniciar";
  };
  const highlightExerciseActive = function(exerciseSelected) {
    const isNotHighlight = !activeExercise.classList.contains("highlight_exercise");
    const isDiferentFromActive = exerciseSelected !== activeExercise;
    if (isNotHighlight && isDiferentFromActive) {
      activeExercise.classList.toggle("highlight_exercise");
      setTimeout(() => {
        activeExercise.classList.toggle("highlight_exercise");
      }, 500);
    }
  };
  const getDataTimer = function() {
    if (isNaN(parseInt(document.getElementById(DomStrings.input_Min).value))) {
      rest[0] = 0;
    } else {
      rest[0] = parseInt(document.getElementById(DomStrings.input_Min).value);
    }
    if (isNaN(parseInt(document.getElementById(DomStrings.input_Seg).value))) {
      rest[1] = 0;
    } else {
      rest[1] = parseInt(document.getElementById(DomStrings.input_Seg).value);
    }
    return rest;
  };
  const checkInputTimer = function() {
    if (isNaN(parseInt(document.getElementById(DomStrings.input_Min).value)) || isNaN(parseInt(document.getElementById(DomStrings.input_Seg).value))) {
      return false;
    } else {
      return true;
    }
  };
  const removeListComplete = function() {
    document.querySelector(DomStrings.div_exerciseList).innerHTML = "";
  };
  const removeTimer = function() {
    let items = document.querySelector(DomStrings.div_mainSection).children;
    items[0].remove();
  };
  const showInputExercises = function() {
    inputFieldsHtml =
      '<div class="input-data"><div class="input-exercise"><label>Ejercicio</label><input class="input-exercise-name" type="text" maxlength="40" value="" size="6" /></div><div class="input-sets"><label>Sets </label><input class="input-exercise-sets" value="0" type="text" onkeypress="return appControlador.onlyNumbers(event);" size="2"/></div><div class="input-reps"><label>Reps</label><input class="input-exercise-reps" value="0" type="text" onkeypress="return appControlador.onlyNumbers(event);" size="2" /></div><div class="btn-add"><button class="btn-add-img"><img src="img/add-circle-outline.svg" alt="Agregar" height="30px" /></button></div></div>';
    document.querySelector(DomStrings.div_mainSection).insertAdjacentHTML("afterbegin", inputFieldsHtml);
  };
  const cleanViewComplete = function() {
    // Mejorar, principio de responsabilidad unica*/
    //Remover los items
    removeListComplete();
    //Quitar el timer
    finishTimer();
    //Mostrar input de ejercicios
    showInputExercises();
    activeExercise = null;
  };
  const runEndAlarmSound = function() {
    isAlarmActive = true;
    let countSound = 0;
    idTimer = setInterval(() => {
      if (countSound < 30) {
        countSound++;
        document.getElementById(DomStrings.soundAlarm).play();
        document.querySelector(DomStrings.div_TimerCount).classList.toggle("active_element");
      } else {
        finishTimer();
        showInputTimer();
      }
    }, 1000);
  };
  const runTimer = function(min, seg) {
    let id, start, dead, currentTime;
    start = new Date();
    currentTime = Date.parse(new Date());
    dead = new Date(currentTime + min * 60 * 1000 + seg * 1000 + 1000);
    console.log(dead > start);
    idTimer = setInterval(() => {
      let actualTime = new Date();
      time = dead - actualTime;
      if (time >= 0) {
        console.log("Ha pasado un segundo");
        let mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let secs = Math.floor((time % (1000 * 60)) / 1000);
        console.log(mins + " : " + secs);
        document.querySelector(DomStrings.text_timerMin).textContent = mins;
        document.querySelector(DomStrings.text_timerSeg).textContent = secs;
      } else {
        clearInterval(idTimer);
        changeStatusTimer();
        runEndAlarmSound();
      }
    }, 1000);
  };
  const highlightInput = function(inputs) {
    if (inputs.name === "") {
      document.querySelector(DomStrings.input_exerciseName).focus();
    } else if (isNaN(inputs.sets) || inputs.sets === 0) {
      document.querySelector(DomStrings.input_excerciseSets).focus();
    } else if (isNaN(inputs.reps) || inputs.reps === 0) {
      document.querySelector(DomStrings.input_excerciseReps).focus();
    }
  };
  const translateView = function(newX) {
    document.querySelector(DomStrings.app).style.transform = `translateX(${newX * 100}%)`;
  };
  const highlightTimer = function() {
    let div_Timer;
    div_Timer = document.querySelector(DomStrings.div_TimerCount);
    div_Timer.classList.toggle("active_element");
    setTimeout(() => {
      div_Timer.classList.toggle("active_element");
    }, 1000);
  };
  const displayNewActiveExercise = function(newExerciseActive) {
    if (newExerciseActive !== activeExercise && activeExercise) {
      activeExercise.classList.remove("active_element");
      activeExercise = newExerciseActive;
      activeExercise.classList.add("active_element");
    }
  };
  return {
    finishTimer: finishTimer,
    restIsDone: restIsDone,
    changeStatusTimer: changeStatusTimer,
    getDomStrings: getDomStrings,
    getInputs: getInputs,
    clearFields: clearFields,
    updateList: updateList,
    removeExercise: removeExercise,
    removeInputFields: removeInputFields,
    removeInputTimer: removeInputTimer,
    showInputTimer: showInputTimer,
    showTimer: showTimer,
    prepareListForTraining: prepareListForTraining,
    changeActionButtonForList: changeActionButtonForList,
    updateSetLeft: updateSetLeft,
    setDone: setDone,
    setStart: setStart,
    highlightExerciseActive: highlightExerciseActive,
    getDataTimer: getDataTimer,
    checkInputTimer: checkInputTimer,
    removeListComplete: removeListComplete,
    removeTimer: removeTimer,
    showInputExercises: showInputExercises,
    cleanViewComplete: cleanViewComplete,
    runEndAlarmSound: runEndAlarmSound,
    runTimer: runTimer,
    highlightInput: highlightInput,
    translateView: translateView,
    highlightTimer: highlightTimer,
    displayNewActiveExercise: displayNewActiveExercise
  };
})();

//Controlador
const appControlador = (function(ctrlVista, ctrlModelo) {
  let setupEventListener = function() {
    DOM = ctrlVista.getDomStrings();
    //Listener para agregar ejercicios a la lista
    document.querySelector(DOM.btnAddExercise).addEventListener("click", ctrlAddItem);
    document.querySelector(DOM.input_exerciseFields).addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    //Listener para cambiar la vista de haciendo rutina a entrenando
    document.getElementById(DOM.btn_listActions).addEventListener("click", checkActionButtonList); /*Verificado*/
    //Listener para detener el tiempo del descanso
    document.querySelector(DOM.div_mainSection).addEventListener("click", event => {
      if (event.target.classList.contains("stop-timer")) {
        ctrlStopTimer();
      }
    });
    //Listener para el control de los ejercicio
    document.querySelector(DOM.div_exerciseList).addEventListener("click", event => {
      if (event.target.matches("button")) {
        let exerciseSelectedID = event.target.parentNode.id;
        console.log(exerciseSelectedID);
        if (event.target.classList.contains("delete")) {
          ctrlDeleteItem(exerciseSelectedID);
        } else if (event.target.classList.contains("start")) {
          ctrlStartSet(exerciseSelectedID);
        } else if (event.target.classList.contains("rest")) {
          ctrlRest();
        }
      }
      // Obtener el target donde fue dado el click y llamar la funcion si fue el boton delete
      else {
        // Listener para cambiar de ejercicio activo
        changeActiveExercise(event);
      }
    });
    //Listener para cambiar la vista
    document.querySelector(DOM.div_navBar).addEventListener("click", changeView);
  };
  const changeActiveExercise = function(event) {
    const newExerciseActive = event.target.closest(".exercise-detail");
    //Verificar si no se posee un un set activo en el modelo
    if (!ctrlModelo.setActive()) {
      //Verificar si el nuevo ejercicio es diferente al que esta activo
      ctrlVista.displayNewActiveExercise(newExerciseActive);
    } else {
      ctrlVista.highlightExerciseActive(newExerciseActive);
    }
  };
  const changeView = function(event) {
    let target = event.target.closest(".nav__view");
    if (target) {
      target = target.id.split("-");
      translateX = -target[1];
      ctrlVista.translateView(translateX);
    }
  };
  const ctrlStopTimer = function() {
    ctrlVista.finishTimer();
    ctrlVista.showInputTimer();
  };
  const ctrlSetDone = function(event) {
    let item;
    //Actualizar datos en el modelo
    item = ctrlModelo.setDone();
    //Restablecer vista a "Iniciar"
    console.log("El Item ID: " + item[0], "y restan estos sets: " + item[1]);
    if (item[1] > 0) {
      ctrlVista.setStart(item[0]);
    } else {
      ctrlVista.setDone(item[0]);
    }
  };

  const ctrlStartTimer = function() {
    let datatime = [];
    //Obtener los datos establecidos por el usuario
    datatime = ctrlVista.getDataTimer();
    //Remover el input de tiempo
    ctrlVista.removeInputTimer();
    //desplegar el timer con los valores establecido
    ctrlVista.showTimer(datatime[0], datatime[1]);
    //se indica a la vista que hay un timer corriendo
    ctrlVista.changeStatusTimer();
    // se empieza a contar de forma regresiva
    ctrlVista.runTimer(datatime[0], datatime[1]);
  };
  const ctrlRest = function() {
    //Esta funcion se activa al presionar "Completo"
    //Primero llamada al metodo ctrlSetDone para que se encarga de indicar en el modelo y vista
    //que el set ha sido terminado
    ctrlSetDone();
    //Luego activa la funcion del temporizador para el descanso
    ctrlStartTimer();
  };
  const ctrlStartSet = function(exerciseSelectedID) {
    if (!ctrlModelo.setActive()) {
      ctrlReduceSet(exerciseSelectedID);
    }
  };
  const ctrlReduceSet = function(exerciseSelectedID) {
    if (ctrlVista.restIsDone()) {
      let amountLeft;
      //Reducir un set menos del modelo
      amountLeft = ctrlModelo.reduceSet(parseInt(exerciseSelectedID));
      //Actualizar en la interfaz con los nuevos valores
      ctrlVista.updateSetLeft(exerciseSelectedID, amountLeft);
    } else {
      ctrlVista.highlightTimer();
    }
  };
  const ctrlDeleteItem = function(exerciseSelectedID) {
    //Remover del modelo
    ctrlModelo.deleteExercise(parseInt(exerciseSelectedID));
    //Remover de la UI
    ctrlVista.removeExercise(exerciseSelectedID);
  };

  const exerciseListDone = function() {
    /*Verificado*/
    if (ctrlModelo.checkList()) {
      // Eliminar DIV contenedor de todos los Inputs y reemplazar por input Timer
      ctrlVista.removeInputFields();
      //TODO Agregar DIV de tiempo
      ctrlVista.showInputTimer();
      //Cambiar las clase necesarias
      ctrlVista.prepareListForTraining("start");
      //Cambiar el boton de rutina lista
      ctrlVista.changeActionButtonForList();
    } else {
      document.querySelector(DOM.input_exerciseName).focus();
    }
  };

  const checkActionButtonList = function() {
    //Revisar que accion cumple el boton al momento de ser invocado
    if (event.target.matches(DOM.btn_exerciseListDone)) {
      exerciseListDone();
    } else if (event.target.matches(DOM.btn_exerciseListRestart)) {
      // Eliminar todos los registros del modelo
      ctrlModelo.restart();
      // Eliminar todo de la vista
      ctrlVista.cleanViewComplete();
      ctrlVista.changeActionButtonForList();
      // setupEventListener();
      document.querySelector(DOM.btnAddExercise).addEventListener("click", ctrlAddItem);
      document.querySelector(DOM.input_exerciseFields).addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
    }
  };

  const ctrlAddItem = function() {
    let input;
    //Obtener los inputs
    input = ctrlVista.getInputs();
    if (input.name != "" && !isNaN(input.sets) && input.sets != 0 && !isNaN(input.reps) && input.reps != 0) {
      //Limpiar la UI
      ctrlVista.clearFields();
      //Agregar al modelo
      newExercise = ctrlModelo.addExercise(input.name, input.reps, input.sets);
      console.log(newExercise);
      //Agregar a la lista de ejercicios - Actualizar UI
      ctrlVista.updateList(newExercise);
    } else {
      ctrlVista.highlightInput(input);
    }
  };
  return {
    init: function() {
      setupEventListener();
    },
    onlyNumbers: function(e) {
      var key = window.Event ? e.which : e.keyCode;
      return (key >= 48 && key <= 57) || key == 8;
    }
  };
})(appVista, appModelo);
appControlador.init();
