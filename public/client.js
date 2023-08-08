const params = new URLSearchParams(window.location.search);
console.log(params);

function makeRequest (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      done(null, xhr.response);
    };
    xhr.onerror = function () {
      done(xhr.response);
    };
    xhr.send();
  }
  
  

if (params.get('logged_in') === 'true') {
    console.log("true")
    document.getElementById('loggedIn').style.display = '';
    document.getElementById('notLoggedIn').style.display = 'none';

    makeRequest('GET', '/last_activities', (err, activitiesJson) => {
        if (err) { throw err; }

        const activities = JSON.parse(activitiesJson)
        console.log(activities)

        // update page with the activities
        updateTableRows(activities);
    });
}
else {
    console.log("false")
    document.getElementById('loggedIn').style.display = 'none';
    document.getElementById('notLoggedIn').style.display = '';
}

const updateTableRows = (activities) => {
    const activityTableBody = document.querySelector('#activityTable tbody');
    console.log(activityTableBody)

    const rows = [];
    for (const {id, name, type} of activities) {
        const row = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.appendChild(document.createTextNode(id));
        row.appendChild(idTd);

        const nameTd = document.createElement('td');
        nameTd.appendChild(document.createTextNode(name));
        row.appendChild(nameTd);

        const typeTd = document.createElement('td');
        typeTd.appendChild(document.createTextNode(type));
        row.appendChild(typeTd);

        rows.push(row);
    }
    console.log(rows)

    activityTableBody.replaceChildren(...rows);
}