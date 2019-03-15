var data = require("./inputs.js");


//returns all time blocks that dont start after the deadline
//managing the deadline in the middle of the last block is the responsability of the caller
function before_deadline(avalibility, deadline)
{
    var out = [];
    for(var i = 0; i < avalibility.length; i++)
	{
		if(avalibility[i].starts_before(deadline))
		{
			out.push(avalibility[i]);
		}
		else
		{
			break;
		}
	}
    return out;
}

function FFD(free_time,assignments)
{
    for(var i = 0 ; i < assignments.length; i++)
    {   
		console.log(i);
		//hold current assignment
        var current = assignments[i];
		
		//retrieve the time_blocks that this assignent can be allocated
        var legal_blocks = before_deadline(free_time,current.deadline);
		console.log("availible blocks");
		data.print(legal_blocks);
        
		//allocate assignent in the first places it will fit
		//smear it across the continuum until it is empty
		var j = 0;
		console.log(current.duration);
		while(j < legal_blocks.length)
		{
			legal_blocks[j].fill_time(current)
			console.log(current.duration);
			j++;
		}
		
		//stop everything if an assignment cannot be allocated
		if(current.duration > 0)
		{
			console.log("error, assignment doesnt fit");
			process.exit(1);
		}
    }
}


var agenda = data.Agenda(2,8);
console.log("raw assignments");
console.log(agenda);

agenda.sort(data.sort);
console.log("sorted assignments");
console.log(agenda);

console.log("avalibility");
data.print(data.one);

FFD(data.one,agenda);
console.log("allocated space");
data.print_schedule(data.one)


