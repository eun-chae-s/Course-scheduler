// JSON data into the object
let json_file;

$.getJSON("data/csc_courses.json", function(data) {
  console.log(data);
  json_file = data;
})

// Functions
function findSection() {
    var course_code = document.getElementById('course');
}