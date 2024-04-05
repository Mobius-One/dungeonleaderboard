function calculateDuration(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate) || isNaN(endDate)) {
    return 9999;
  }

  const durationMs = endDate - startDate;
  const millisecondsPerHour = 1000 * 60 * 60;
  const hours = durationMs / millisecondsPerHour;

  return hours;
}

function fetchLeaderboard() {
  fetch('https://mobius-one.github.io/leaderboard_json/leaderboard.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      data.sort((a, b) => {
        if (a.completedLevels === b.completedLevels) {
          const durationA = calculateDuration(a.startTime, a.endTime);
          const durationB = calculateDuration(b.startTime, b.endTime);
          return durationA - durationB;
        }
      });

      let table = document.getElementById("leaderboard_table");

      let tableHeader = document.createElement("thead");
      let headerRow = document.createElement("tr");
      let numberHeader = document.createElement("th");
      numberHeader.textContent = "#";
      let nameHeader = document.createElement("th");
      nameHeader.textContent = "Captain";
      let completedLevelsHeader = document.createElement("th");
      completedLevelsHeader.textContent = "Completed Levels";
      let durationHeader = document.createElement("th");
      durationHeader.textContent = "Duration";
      headerRow.appendChild(numberHeader);
      headerRow.appendChild(nameHeader);
      headerRow.appendChild(completedLevelsHeader);
      headerRow.appendChild(durationHeader);
      tableHeader.appendChild(headerRow);
      table.appendChild(tableHeader);
      
      for (let i = 0; i < data.length; i++) {
        let cap = data[i];
        let name = cap["twitchDisplayName"];
        let completedLevels = cap["completedLevels"];
        let startTime = cap["startTime"];
        let endTime = cap["endTime"];
        let duration = calculateDuration(startTime, endTime);
        let row = document.createElement("tr");
        let numberCell = document.createElement("td");
        numberCell.textContent = i + 1;
        let nameCell = document.createElement("td");
        nameCell.textContent = name;
        let completedLevelsCell = document.createElement("td");
        completedLevelsCell.textContent = completedLevels;
        let durationCell = document.createElement("td");
        durationCell.textContent = duration.toFixed(2) + " hours";

        row.appendChild(numberCell);
        row.appendChild(nameCell);
        row.appendChild(completedLevelsCell);
        row.appendChild(durationCell);

        table.appendChild(row);
      }

    })
    .catch(error => {
      console.error('Error fetching JSON:', error);
    });

    fetch('https://mobius-one.github.io/leaderboard_json/time.json')
            .then(response => response.json())
            .then(data => {
                const utcTime = data.time;
                document.getElementById('time_container').innerText = "Last update: " + utcTime + " UTC";
            })
            .catch(error => console.error('Error fetching data:', error));
}

window.addEventListener('load', fetchLeaderboard);
