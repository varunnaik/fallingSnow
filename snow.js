var fallingSnow = function(parameters) {
    
    var defaultOptions = {
        minWind: 0,
        maxWind: 0,
        windVariation: 0,
        numLayers: 3,
        intensity: 90, /* 1-10, 10= Blizzard */
        uniqueSnowflakes: false,
        element: 'html'       
    }
    
    var options = {};
    var snowCanvas = "";
    var container = null;
    var snowflakes = [];
    var width = 0;
    var height = 0;
    var angle = 0;
     
    var setParameters = function(parameters) {
        // Get a set of parameters combining passed parameters with
        // default parmeters
        
        if (typeof parameters === 'undefined') {
            parameters = {};
        }
        
        // Generate a set of parameters
        for (key in defaultOptions) {
            if (defaultOptions.hasOwnProperty(key)) {
                if (typeof parameters[key] !== 'undefined') {
                    options[key] = parameters[key];
                } else {
                    options[key] = defaultOptions[key];
                }
            }
        }
        
        // Validate and normalise parameters
        if (options.minWind < 0 || options.minWind > options.maxWind) {
            options.minWind = defaultOptions.minWind;
            console.log("FallingSnow: invalid minWind parameter.");
        }
        if (options.maxWind > 10 || options.maxWind < options.minWind) {
            options.maxWind = defaultOptions.maxWind;
            console.log("FallingSnow: invalid maxWind parameter.");
        }
        
                
    }
    
    var setCanvasSize = function() {
        function setSize() {
            var size = window.getComputedStyle(container);
            width =  size.width.replace('px','');
            height = size.height.replace('px','');
            snowCanvas.width = width;
            snowCanvas.height = height;
        }
        window.onresize = setSize();
        setSize();        
    }
    
    var makeItSnow = function() {

        // Make the canvas
        var canvas = document.createElement('canvas');
        canvas.id = 'fallingSnow';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        snowCanvas = canvas;        
        
        // And append it to the element we should make snow
        container = document.querySelector(options.element);
        if (! container) {
            console.log("FallingSnow: Could not get element! Aborting.");
            return;
        }
        container.appendChild(canvas);
        
        setCanvasSize(); // Resize canvas with window
        
         // Generate the snowflakes
        var numParticles = 10*options.intensity;
        for (var i = 0; i < numParticles; i++) {
            snowflakes.push({
                x: Math.random()*width, //x-coordinate
                y: Math.random()*height, //y-coordinate
                r: Math.random()*4+1, //radius
                d: Math.random()*numParticles //density 
            });
        }
        
        drawSnow();
        setInterval(drawSnow,33);
        
    }
    
    var drawSnow = function() {
        var ctx = snowCanvas.getContext("2d"); 
        
         ctx.clearRect(0, 0, width, height);
 
         ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
         ctx.beginPath();
         for(var i = 0; i < snowflakes.length; i++) {
            var s = snowflakes[i];
            ctx.moveTo(s.x, s.y);
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2, true);
         }
         ctx.fill();
        
        angle += 0.01;
        
		for(var i = 0; i < snowflakes.length; i++)
		{
			var s = snowflakes[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			s.y += Math.cos(angle+s.d) + 1 + s.r/2;
			s.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.

			if(s.x > width+5 || s.x < -5 || s.y > height)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					snowflakes[i] = {x: Math.random()*width, y: -10, r: s.r, d: s.d};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						snowflakes[i] = {x: -5, y: Math.random()*height, r: s.r, d: s.d};
					}
					else
					{
						//Enter from the right
						snowflakes[i] = {x: width+5, y: Math.random()*height, r: s.r, d: s.d};
					}
				}                
			}
		}        
    }
    
    var init = function() {
        setParameters();
        makeItSnow();
    }
    
    init();    
}
