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
let added = {};

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

    // console.log(result);
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
        var sem = (section.semester == "F") ? "fall" : (section.semester == "S") ? "winter" : "year";

        // 3. section schedule array
        var schedule = section.schedule;
        var alert_called = false;
        schedule.forEach(time => {
          var day = time.Day;
          var start = time.Start;
          var end = time.End;
          if (day != undefined || start != null || end != null) {
            var start_time = parseInt(start.slice(0, start.indexOf(":")));
            var end_time = parseInt(end.slice(0, end.indexOf(":")));
          
            // Check any conflicted schedule
            for (let i = 0; i < end_time - start_time; i++) {
              if (sem != "year") {
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

            // Coloring
            if (alert_called == false) {
              for (let i = 0; i < end_time - start_time; i++) {
                if (sem != "year") {
                  var t = document.getElementById(sem);
                  var cell = t.rows[start_time - 7 + i].cells[schedule_days[day]];
                  // if (cell.bgColor != "") {
                  //   alert("Conflicted schedule! Choose another section!");
                  // } else {
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

                  // add the position of cells that was colored;
                  if (added[id.slice(4)] == null) {
                    added[id.slice(4)] = [cell];
                  } else {
                    added[id.slice(4)].push(cell);
                  }
                  
                  //}
                } else {  
                  // for the year course 
                  var fall = document.getElementById("fall");
                  var winter = document.getElementById("winter");

                  var cell1 = fall.rows[start_time - 7 + i].cells[schedule_days[day]];
                  var cell2 = winter.rows[start_time - 7 + i].cells[schedule_days[day]];
                  if (id.includes("lec")) {
                    cell1.bgColor = "#fff0f8";
                    cell2.bgColor = "#fff0f8";
                  } else if (id.includes("tut")) {
                    cell1.bgColor = "#e6eeff";  // tutorial section
                    cell2.bgColor = "#e6eeff";
                  } else {
                    cell1.bgColor = "#c3fc86";  // activity section
                    cell2.bgColor = "#c3fc86";
                  }
                  
                  if (end_time - start_time > 1) {
                    if (i == 0) {
                      cell1.innerText = course_code;
                      cell2.innerText = course_code;
                    } 
                    if (i == 1) {
                      cell1.innerText = sec_name;
                      cell2.innerText = sec_name;
                    }
                  } else {
                    cell1.innerHTML = course_code + "<br>" + sec_name;
                    cell2.innerHTML = course_code + "<br>" + sec_name;
                  }

                  // remove the border line
                  if (i > 0) {
                    cell1.style.borderTop = "None";
                    cell2.style.borderTop = "None";
                  }
                  if (i < end_time - start_time - 1) {
                    cell1.style.borderBottom = "None";
                    cell2.style.borderBottom = "None";
                  }

                  // add the position of cells that was colored;
                  if (added[id.slice(4)] == null) {
                    added[id.slice(4)] = [cell1, cell2];
                  } else {
                    added[id.slice(4)].push(cell1);
                    added[id.slice(4)].push(cell2);
                  }
                }
              }
            }
          }
          
          
        })
        
        // add to the "Added Courses" section
        if (alert_called == false) {
          var added_courses = document.getElementById('selected_courses');
          var new_card = document.createElement('div');
          var text = course_code + " " + sem.toUpperCase()[0] + " " + sec_name;
          new_card.innerHTML = text;
          var delete_button = document.createElement("button");
          delete_button.innerHTML = "&#10006;";
          delete_button.id = "delete-" + id.slice(4);

          new_card.appendChild(delete_button);
          new_card.className = "selected";

          added_courses.appendChild(new_card);
          delete_button.onclick = () => {
            var cells = added[id.slice(4)];
            cells.forEach(cell => {
              cell.bgColor = "";
              cell.innerHTML = "";
              cell.innerText = "";
              cell.style.border = "1px solid black";
            })
            added_courses.removeChild(new_card);
          }
        }
        
      };
    }
}

// Save HTML file into PDF
// reference: https://www.freakyjolly.com/multipage-canvas-pdf-using-jspdf/
function getPDF(){

  var HTML_Width = $("#schedule").width();
  var HTML_Height = $("#schedule").height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width+(top_left_margin*2);
  var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;
  
  var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
  

  html2canvas($("#schedule")[0],{allowTaint:true}).then(function(canvas) {
    canvas.getContext('2d');
    
    console.log(canvas.height+"  "+canvas.width);
    
    
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
    
    
    for (var i = 1; i <= totalPDFPages; i++) { 
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
    }
    
    pdf.save("HTML-Document.pdf");
    });
};