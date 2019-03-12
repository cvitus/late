const TOTAL_TIME = 14;

//interval to be allocated in a time_block
function Allocation(id,start,duration)
{
    return{ id:id,
            start:start,
            end:start+duration};
}

// returns time_block object
//object handles allocation of assignments with it
function time_block(start,end)
{
    return {
			//start time
			start:start,
			
			//end time
            end:end,
			
			//start of unallocated section of time_block
			remaining_mark:start,
			
			//intervals where assignments are within the time_block
            allocated:[],
			
			//member function, returns true if given time is with the time_block
			contains:function(time){return (this.start < time) && (time < this.end);},
            
            //schedules as much of the assignment as is possible
			//reduces the allocated time from the inputed assignment object
            //returns true if the entire assingment fit
            fill_time: function(assignment){
				//handle 0 assignments, nothing to do, just say it false
                if(assignment.duration == 0) return true;
				
                //if the assignment can fit, add the entire thing
                if(this.end - this.remaining_mark > assignment.duration)
                {
					//allocate entire assignment
                    this.allocated.push(Allocation(  assignment.id,
                                                this.remaining_mark,
                                                assignment.duration));
					
					//move remaining mark to end of assignment
					this.remaining_mark += assignment.duration
					
                    //update time of assignment
                    assignment.duration = 0;
					
					//true = it fits
                    return true;
                }
				
                //if not add as much as will fit
                else
                {
					//allocate as much as will fit
                    this.allocated.push(Allocation(  assignment.id,
                                                this.remaining_mark,
                                                this.end-this.remaining_mark));
					
					//remove allocated time from assignment
                    assignment.duration -= this.end-this.remaining_mark
					
					//update remaining mark
                    this.remaining_mark = end;
                    
					//false = it doesnt fit
					return false;
                }
            }}
}

function print_interval(input)
{
    for(var i = 0 ; i < input.length; i++)
    {
        process.stdout.write("start:");
        process.stdout.write(""+input[i].start+" ");
        process.stdout.write("end:");
        process.stdout.write(""+input[i].end+"\n");
    }
}

function print_schedule(input)
{
    input.forEach(element => {
        element.allocated.forEach(allocation =>{
            console.log(allocation);
        })
    });
}

//free time: 8 hrs
var schedule_one = [
    time_block(0,2),
    time_block(2,3),
    time_block(8,10),
    time_block(13,14)];

//free time: 10 hrs
var schedule_two = [
    time_block(2,4),
    time_block(8,9),
    time_block(13,14)];

//free time: 7 hrs
var schedule_three = [
    time_block(2,4),
    time_block(5,6),
    time_block(6,8),
    time_block(10,12)]

//free time: 7 hrs
var schedule_four = [
    time_block(0,1),
    time_block(2,4),
    time_block(8,9),
    time_block(13,14)];

// returns assignment object with inputed information
function Assignment(id,deadline,duration,priority)
{
    return {id:id,
            deadline:deadline,
            duration:duration,
            priority:priority};
}

//generates <num_assignments> random assignment objects that collectively take up a max of
function Agenda(num_assignments,availible_time)
{
    var Agenda = [];
    for(var i = 1 ; i <= num_assignments; i++)
    {
        //duration is a random amount of time within the working time
        var duration = Math.random()*availible_time;

        //the sum of all durations <= WORKING_TIME
        availible_time -= duration;

        //due date must occur before the end of TOTAL_TIME but after the duration has passed
        var deadline = Math.random()*(TOTAL_TIME-duration)+duration;
        
        //priority can just be any value, leaving it within the 1-100 range for ease
        var priority = Math.floor(Math.random()*(99)+1);

        Agenda.push(Assignment(i,deadline,duration,priority));
    }
    return Agenda;
}

//an assingments true priority is proportional to the given priority
//and inversely proporitonal to the time remaining
function assignment_sort(a,b)
{
    return (b.priority/a.deadline)-(a.priority/a.deadline);
}
exports.one = schedule_one;
exports.two = schedule_two;
exports.three = schedule_three;
exports.four = schedule_four;

exports.Agenda = Agenda;
exports.sort = assignment_sort;
exports.print = print_interval
exports.print_schedule = print_schedule