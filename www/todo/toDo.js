var todos = [];
var options= {
  date: new Date(),
  mode: "datetime"
}

$.ajax("http:///todos").done(function(result){ // ㅈㅏㄱㅣ ip

  console.log(result);

  todos=result;
  for (const todo of todos){
    $(".contents ul").append(liTemplate(todo.text, todo.checked,todo.date));
  }
});

function onSuccess(date){
  var text = $("#inputBox").val();
  todos.push({ text : text, checked : false, date: date });

  $("#inputBox").val("");
  console.log(todos);

  $(".contents ul").append(liTemplate(text,false,date)); //text에 있는거 리스트 추가

  cordova.plugins.notification.local.schedule({
    title : "Todo list",
    text: text,
    trigger: { at: date}
  });

  saveTodos();
}

function onError(error){
    alert("Error: " + error);
}

function inputTemplate(checked){
  var inputTag = $('<input type="checkbox" id="checkbox">');
  inputTag.attr("checked",checked);
  return inputTag;
}

function buttonTemplate(text){
  var buttonTag=$('<button id="deleteButton">X</button>');
  return buttonTag;
}



function liTemplate(text,checked,date) {
  var li= $("<li></li>");

  li.append(inputTemplate(checked));
  li.append(text);
  li.append(buttonTemplate());
  li.append(date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul"}));

  li.click(function(event) {
    var el= $(event.target); //무슨 이벤트인지 확인.
    var index=li.index("li");
    console.log(el.data("value"));

    if (el.is("button")) {
      todos.splice(index, 1);
      $("li")[index].remove();
    }
    else if (el.is("input[type='checkbox']")) {
      var isChecked = el.is(":checked");
      if (isChecked) {
        $($("li")[index]).addClass("checked");
        todos.checked=true;
      }
      else {
        $($("li")[index]).removeClass("checked");
        todos[index].checked=false;
      }
    }
    saveTodos()
  });

  return li;
};

$("#addButton").click(function() {
  datePicker.show(options, onSuccess,onError);
});

function saveTodos(){
    $.ajax({
        url: "http:///todos", // ㅈㅏㄱㅣ ip
        method: "POST",
        data: JSON.stringify({todos: todos}),
        dataType:"json",
        contentType: "application/json"
    }).done(function(){
        alert("post Done");
    })
}
