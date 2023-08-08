const params = new URLSearchParams(window.location.search);

function makeRequest(method, url, body, done) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);

  if (body) {
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  }
  xhr.onload = function () {
    done(null, xhr.response);
  };
  xhr.onerror = function () {
    done(xhr.response);
  };
  xhr.send(JSON.stringify(body)); }

const activityNames = {};

let loggedIn = false;
const groups = document.cookie.match(/access_token=(.*)(;|$)/);

if (groups) {
  loggedIn = true;
}

if (loggedIn) {
  document.getElementById('loggedIn').style.display = '';
  document.getElementById('notLoggedIn').style.display = 'none';

  makeRequest('GET', '/last_activities', undefined, (err, activitiesJson) => {
    if (err) { throw err; }

    const activities = JSON.parse(activitiesJson)

    // update page with the activities
    updateTableRows(activities);

    // update state with activities
    for (const { id, name } of activities) {
      activityNames[id] = name;
    }

  });
}
else {
  document.getElementById('loggedIn').style.display = 'none';
  document.getElementById('notLoggedIn').style.display = '';
}

const updateTableRows = (activities) => {
  const activityTableBody = document.querySelector('#activityTable tbody');

  const rows = [];
  for (const { id, name, type } of activities) {
    const row = document.createElement('tr');

    row.insertAdjacentHTML("beforeend", `<td>${id}</td>`);
    row.insertAdjacentHTML("beforeend", `<td>${type}</td>`);
    row.insertAdjacentHTML("beforeend", `<td><input type="text" value="${name}" onChange="onChangeHandler(this, ${id})" /></td>`);
    row.insertAdjacentHTML("beforeend", `<td><input type="button" value="update" onClick="updateActivityName(${id})" /></td>`);

    rows.push(row);
  }

  activityTableBody.replaceChildren(...rows);
}


const onChangeHandler = (target, id) => {
  activityNames[id] = target.value
}

const updateActivityName = (id) => {
  console.log(`udpating id ${id} with name ${activityNames[id]}`);

  makeRequest(
    'PUT',
    '/update_activity_name',
    { id, name: activityNames[id] },
    (err, response) => {
      if (err) { throw err; }
      console.log("update response: ", response);
  });
}