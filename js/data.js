// JSON data into the object
let json_file = [];

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
        button.innerHTML = "add";

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);
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

        tut.schedule.forEach(time => {
          text += time.Day + ": " + time.Start + " - " + time.End;
        })
        
        schedule.innerHTML = text;
        schedule.style.fontSize = "12px";

        // add button
        var button = document.createElement('button');
        button.innerHTML = "add";

        // add all the components to the entire card
        card.appendChild(name);
        card.appendChild(semester);
        card.appendChild(delivery);
        card.appendChild(schedule);
        card.appendChild(button);

        // add the card to the section display
        sections.appendChild(card);
      })
      
    })
}

