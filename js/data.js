// August 16 To-do list
// 1. alert function() for conflicted course (even 1 hr different also) (done)
// 2. different color for the tutorial (done)
// 3. add delete function
// 4. display all the added section 
// 5. coloring for the Y course
// 6. deal with the course that does not have a time
// 7. api call 바꾸기
// 8. save into pdf file function


// JSON data into the object
let json_file = [];
var schedule_days = {
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4, 
  "Friday": 5
};
let buttons = {};

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
    buttons = {};
    result.forEach(section => {

      for (let i = 0; i < section.lectures.length; i++) {
        var lec = section.lectures[i];
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
        button.id = "add-lec" + section.section + i;
        button.innerHTML = "add";

        // add all the info to the array
        buttons["add-lec" + section.section + i] = {
          "name": lec.sec_name,
          "schedule": lec.schedule,
          "semester": section.section,
          "delivery": lec.delivery
        };

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);
      };

      for (let j = 0; j < section.tutorials.length; j++) {
        var tut = section.tutorials[j];
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
        button.id = "add-tut" + section.section + j;
        button.innerHTML = "add";
        
        // add all the info to the array
        buttons["add-tut" + section.section + j] = {
          "name": tut.sec_name,
          "schedule": tut.schedule,
          "semester": section.section,
          "delivery": tut.delivery
        };

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);
      }
    })

    // find the timeslot and color the cell on the table
    for (const id in buttons) {
      var button = document.getElementById(id);
      button.onclick = () => {
        // course_code
        var course = document.getElementById('course');
        var course_code = course.value.toUpperCase();

        // selected section info
        var section = buttons[id];

        // 1. section name
        var sec_name = section.name;

        // 2. section semester
        var sem = (section.semester == "F") ? "fall" : (section.semester == "S") ? "winter" : "both";

        // 3. section schedule array
        var schedule = section.schedule;
        schedule.forEach(time => {
          var day = time.Day;
          var start = time.Start;
          var end = time.End;
          var start_time = parseInt(start.slice(0, start.indexOf(":")));
          var end_time = parseInt(end.slice(0, end.indexOf(":")));
          var alert_called = false;
          for (let i = 0; i < end_time - start_time; i++) {
            if (sem != "both") {
              var t = document.getElementById(sem);
              var cell = t.rows[start_time - 7 + i].cells[schedule_days[day]];
              if (cell.bgColor != "") {
                alert("Conflicted schedule! Choose another section!");
                alert_called = true;
                break;
              }
            } else {
              var fall = document.getElementById("fall");
              var winter = document.getElementById("winter");

              var cell1 = fall.rows[start_time - 7 + i].cells[schedule_days[day]];
              var cell2 = winter.rows[start_time - 7 + i].cells[schedule_days[day]];
              if (cell1.bgColor != "" || cell2.bgColor != "") {
                alert("Conflicted schedule! Choose another section!");
                alert_called = true;
                break;
              }
            }
          }
          if (alert_called == false) {
            for (let i = 0; i < end_time - start_time; i++) {
              if (sem != "both") {
                var t = document.getElementById(sem);
                var cell = t.rows[start_time - 7 + i].cells[schedule_days[day]];
                if (cell.bgColor != "") {
                  alert("Conflicted schedule! Choose another section!");
                } else {
                  if (id.includes("lec")) {
                    cell.bgColor = "#fff0f8";
                  } else if (id.includes("tut")) {
                    cell.bgColor = "#e6eeff";  // tutorial section
                  } else {
                    cell.bgColor = "#c3fc86";
                  }
                  
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
  
                  // remove the border line
                  if (i > 0) {
                    cell.style.borderTop = "None";
                  }
                  if (i < end_time - start_time - 1) {
                    cell.style.borderBottom = "None";
                  }
                }
              }
            }
          }
          
        })
      };
    }
}