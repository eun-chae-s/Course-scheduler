// JSON data into the object
let json_file = [];
var schedule_days = {
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4, 
  "Friday": 5
};

// Clean JSON file
$.getJSON("data/csc_courses.json", function(json) {
  console.log(json);
  for (var course in json) {
    let lectures = [];
    let tutorials = [];
    var all_sections = json[course].meetings
    for (var meeting in all_sections) {
      if (all_sections[meeting].cancel == "") {
        // Delivery mode - tag
        let str = all_sections[meeting].online;
      
        if (str.includes("Online - Synchronous")) {
          online = "Online (S)";
        } else if (str.includes("In Person")) {
          online = "In Person";
        } else {
          online = "Online (A)";
        }

        // Section schedule - tag
        var schedule = all_sections[meeting].schedule;
        var days = {
          "MO": "Monday", 
          "TU": "Tuesday", 
          "WE": "Wednesday", 
          "TH": "Thursday", 
          "FR": "Friday"
        };
        let final_schedule = [];

        for (var s in schedule) {
          var day = schedule[s].meetingDay;
          final_schedule.push(
            {"Day": days[day], "Start": schedule[s].meetingStartTime, "End": schedule[s].meetingEndTime}         
          );

        }

        var section = {
          "sec_name": meeting,
          "delivery": online,
          "schedule": final_schedule
        };

        if (all_sections[meeting].teachingMethod == "LEC") {
          lectures.push(section);
        } else {
          tutorials.push(section);
        }
      }
      
    }

    var data = {
      "course": course.substring(0, 8),
      "section": json[course].section,
      "lectures": lectures,
      "tutorials": tutorials
    };

    json_file.push(data);

  }
  console.log(json_file);
})

// Functions
function findSection() {
    var course_code = document.getElementById('course');
    // Find the courses that match with the input value
    let result = [];
    json_file.forEach(element => {
      var course_name = element.course;
      if (course_name.includes(course_code.value.toUpperCase())) {
        result.push(element);
      }
    });

    console.log(result);
    // Display all the sections in the box
    var sections = document.getElementById('sections');
    sections.innerHTML = "";
    result.forEach(section => {

      section.lectures.forEach(lec => {
        // the whole card
        var card = document.createElement('div');
        card.className = "card";
        card.style.backgroundColor = "#fff0f8";
        
        // lecture section name
        var name = document.createElement('a');
        name.innerHTML = lec.sec_name;

        // Which semester
        var semester = document.createElement('a');
        semester.innerHTML = section.section;

        // lecture delivery mode
        var delivery = document.createElement('a');
        delivery.innerHTML = lec.delivery;

        // lecture schedule
        var schedule = document.createElement('div');
        let text = '';

        for (let i = 0; i < lec.schedule.length; i++) {
          var time = lec.schedule[i];
          if (i < lec.schedule.length - 1) {
            text += time.Day + ": " + time.Start + " - " + time.End + "<br>";
          } else {
            text += time.Day + ": " + time.Start + " - " + time.End;
          } 
            
        }
        
        schedule.innerHTML = text;

        // add button
        var button = document.createElement('button');
        button.id = "add";
        button.innerHTML = "add";
        

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);
        
        document.getElementById("add").addEventListener("click", addCourse(lec, section.section));
      });

      section.tutorials.forEach(tut => {
        // the whole card
        var card = document.createElement('div');
        card.className = "card";
        card.style.backgroundColor = "#e6eeff";

        // lecture section name
        var name = document.createElement('a');
        name.innerHTML = tut.sec_name;

        // Which semester
        var semester = document.createElement('a');
        semester.innerHTML = section.section;

        // lecture delivery mode
        var delivery = document.createElement('a');
        delivery.innerHTML = tut.delivery;

        // lecture schedule
        var schedule = document.createElement('a');
        let text = '';

        for (let i = 0; i < tut.schedule.length; i++) {
          var time = tut.schedule[i];
          if (i < tut.schedule.length - 1) {
            text += time.Day + ": " + time.Start + " - " + time.End + "<br>";
          } else {
            text += time.Day + ": " + time.Start + " - " + time.End;
          } 
            
        }
        
        schedule.innerHTML = text;
        schedule.style.fontSize = "12px";

        // add button
        var button = document.createElement('button');
        button.id = "add";
        button.innerHTML = "add";
        

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);

        document.getElementById("add").addEventListener("click", addCourse(tut, section.section));
      })
      
    })
}


// find the timeslot and color the cell on the table
function addCourse(section, semester) {
  console.log("success");
  // course_code
  var course = document.getElementById('course');
  var course_code = course.value.toUpperCase();

  // selected section info
  // 1. section name
  var sec_name = section.sec_name;

  // 2. section semester
  var sem = (semester == "F") ? "fall" : (semester == "S") ? "winter" : "both";

  // 3. section schedule array
  var schedule = section.schedule;
  schedule.forEach(time => {
    var day = time.Day;
    var start = time.Start;
    var end = time.End;
    var start_time = parseInt(start.slice(0, start.indexOf(":")));
    var end_time = parseInt(end.slice(0, end.indexOf(":")));
    for (let i = 0; i < end_time - start_time; i++) {
      if (sem != "both") {
        var t = document.getElementById(sem);
        var cell = t.rows[start_time - 7 + i].cells[schedule_days[day]];
        // if (cell.bgColor != "") {
        //   alert("Conflicted schedule! Choose another section!");
        // } else {
          cell.bgColor = "pink";
          if (end_time - start_time > 1) {
            if (i == 0) {
              cell.innerText = course_code;
            } 
            if (i == 1) {
              cell.innerText = sec_name;
            }
          } else {
            cell.innerHTML = course_code + "<br>" + sec_name;
          }
        // }
      }

      // if filled in multiple borders: erase the bottom border line & top border line
    }
  })

  
}

document.getElementById("fall").rows[1].cells[1]