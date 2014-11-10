var url = "http://wiselib.teamwork.com";
var user = "piano724bowling";
var password = "password"; //dummy password
var requirementTaskListName = "Functional requirements";

function httpGet(getUrl) {
    var req = new XMLHttpRequest();
    req.open('GET', getUrl, false); //"piano724bowling", "test"
    req.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + password));
    req.send();
    
    return req.responseText;
}

function getProjectID() {
    var projectUrl = url + "/projects.json";
    var response = JSON.parse(httpGet(projectUrl));
    
    return parseInt(response.projects[0].id);
}

function getRequirementsTaskListID() {
    var taskUrl = url + "/projects/" + getProjectID() + "/todo_lists.json";
    var response = JSON.parse(httpGet(taskUrl));
    var length = response['todo-lists'].length;
    var requirementTaskList = null;
    
    for(var i = 0; i < length; i++) {
        if(response['todo-lists'][i].name == requirementTaskListName) {
            requirementTaskList = response['todo-lists'][i];
            break;
        }
    }
    
    return parseInt(requirementTaskList.id);
}

function todoItemToTable(todoItem) {
    var table = '';
    var priority = 'none';
    if(todoItem.priority != "") {
        priority = todoItem.priority;
    }
    //heading
    table += '<tr class=\'requirement '
                 + ' completed-' + todoItem.completed + '\'>';
        table += '<th>' + todoItem.content + '</th>';
        table += '<th>' + '<span class=\'fa fa-exclamation-circle priority-' + priority + '\'>' + '</span>' + ' ' + priority + '</th>';
        table += '</tr>';
    //subtasks
    var subtasks = todoItem['subTasks'];
    for(var i = 0; i < subtasks.length; i++) {
        priority = 'none';
        if(subtasks[i].priority != "") {
            priority = subtasks[i].priority;
        }
        table += '<tr class=\'requirement '
                 + ' completed-' + subtasks[i].completed + '\'>';
        table += '<td>' + subtasks[i].content + '</td>';
        table += '<td>' + '<span class=\'fa fa-exclamation-circle priority-' + priority + '\'>' + '</span>' + ' ' + priority + '</td>';
        table += '</tr>';
    }
    
    return table;
}

function getRequirements() {
    var taskUrl = url + "/tasklists/" + getRequirementsTaskListID() + "/tasks.json?nestSubTasks=yes";
    var response = JSON.parse(httpGet(taskUrl));
    var tasks = response['todo-items'];
    var length = tasks.length;
    
    var table = '<table>';
    for(var i = 0; i < length; i++) {
        table += todoItemToTable(tasks[i]);
    }
    table += '</table class=\'requirements\'>';
    
    document.getElementById('requirements-dashboard').innerHTML += table;
}

getRequirements();