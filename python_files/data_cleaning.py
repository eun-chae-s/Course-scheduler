"""
This python file is for cleaning the JSON file
into the better form.

copyright: Eunchae Seong
"""
import json


def clean_file(file_name: str) -> dict:
    """Return the """
    result = {}
    with open(file_name) as file:
        f = json.load(file)
        for course in f:
            course_name = f[course]["code"]
            section = f[course]["section"]
            meetings_original = f[course]["meetings"]
            lectures = {}
            tutorials = {}
            for m in meetings_original:
                if meetings_original[m]["cancel"] == "Cancelled":
                    continue
                name = m
                full_schedules = meetings_original[m]["schedule"]
                final_schedules = {}
                for schedule in full_schedules:
                    s = full_schedules[schedule]
                    day = s["meetingDay"]
                    start = s["meetingStartTime"]
                    end = s["meetingEndTime"]
                    final_schedules[day] = {'start': start, 'end': end}

                if 'Online - Synchronous' in meetings_original[m]["online"]:
                    delivery = 'Online - Synch'
                elif 'In Person' in meetings_original[m]["online"]:
                    delivery = 'In Person'
                else:
                    delivery = 'Asynch'

                if meetings_original[m]["teachingMethod"] == "LEC":
                    lectures[name] = {"delivery": delivery, "schedule": final_schedules}
                elif meetings_original[m]["teachingMethod"] == "TUT":
                    tutorials[name] = {"delivery": delivery, "schedule": final_schedules}

            info = {"section": section, "lecture": lectures, "tutorial": tutorials}
            if course_name in result:
                result[course_name].append(info)
            else:
                result[course_name] = [info]
    
    return result