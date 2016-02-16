var fallingSnow = function() {
    
    var defaultOptions = {
        snowflakeSize: 3,
        intensity: 40, /* 10-100, 100= Blizzard */
        speed: 1,
        selector: 'html'       
    }
    
    var parameters = {};
    var options = {};
    var snowCanvas = "";
    var container = null;
    var snowflakes = [];
    var width = 0;
    var height = 0;
    var angle = 0;
    var intervalHandle = null;
    var ctx = null;
    
    return {
    
        cleanup: function() {
            if (snowCanvas && snowCanvas.parentNode) {
                snowCanvas.parentNode.removeChild(snowCanvas);
                snowCanvas = null;
                ctx = null;
            }
            snowflakes = [];
            cancelAnimationFrame(intervalHandle);
            height = width = 0;
        },
     
        validateParameters: function(parameters) {
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
            if (options.snowflakeSize < 0 || options.snowflakeSize > 6) {
                options.minWind = defaultOptions.snowflakeSize;
                console.log("FallingSnow: invalid minWind parameter.");
            }
            if (options.speed < 0.5 || options.speed > 1.5) {
                options.maxWind = defaultOptions.speed;
                console.log("FallingSnow: invalid speed parameter.");
            }
            if (options.intensity < 10 || options.intensity > 100) {
                options.maxWind = defaultOptions.intensity;
                console.log("FallingSnow: invalid intensity parameter.");
            }       
                    
        },
    
        setCanvasSize: function() {
            function setSize() {
                var size = window.getComputedStyle(container);
                width =  size.width.replace('px','');
                height = size.height.replace('px','');
                snowCanvas.width = width;
                snowCanvas.height = height;
            }
            window.onresize = setSize();
            setSize();        
        },
    
        generateCanvas: function() {

            // Make the canvas
            var canvas = document.createElement('canvas');
            canvas.id = 'fallingSnow';
            canvas.style.position = 'absolute';
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style["pointer-events"] = 'none';
            snowCanvas = canvas;        
            
            // And append it to the element we should make snow
            container = document.querySelector(options.selector);
            if (! container) {
                console.log("FallingSnow: Could not get element! Aborting.");
                return;
            }
            container.appendChild(canvas);
            
            this.setCanvasSize(); // Resize canvas with window    
     
            
        },
    
        generateSnow: function() {
            // Generate the snowflakes        
            var numParticles = 10*options.intensity;
            for (var i = 0; i < numParticles; i++) {
                snowflakes.push({
                    x: Math.random()*width, //x-coordinate
                    y: Math.random()*height, //y-coordinate
                    r: Math.random()*options.snowflakeSize, //radius
                    d: Math.random()*numParticles, //density 
                    a: Math.random()/100
                });
            }
        },

    
        drawSnow: function() {
             if (!ctx) {
                 ctx = snowCanvas.getContext("2d");
             }
            
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
                s.y += Math.abs(Math.cos(angle+s.d) + options.speed + s.r/2);
                s.x += (Math.sin(angle) + Math.sin(s.a))/2 * options.speed * 2;
                
                //Sending flakes back from the top when it exits
                //Lets make it a bit more organic and let flakes enter from the left and right also.

                if(s.x > width+5 || s.x < -5 || s.y > height)
                {
                    if(i%3 > 0) //66.67% of the flakes
                    {
                        snowflakes[i] = {x: Math.random()*width, y: -10, r: s.r, d: s.d, a: s.a};
                    }
                    else
                    {
                        //If the flake is exitting from the right
                        if(Math.sin(angle) > 0)
                        {
                            //Enter from the left
                            snowflakes[i] = {x: -5, y: Math.random()*height, r: s.r, d: s.d, a: s.a};
                        }
                        else
                        {
                            //Enter from the right
                            snowflakes[i] = {x: width+5, y: Math.random()*height, r: s.r, d: s.d, a: s.a};
                        }
                    }                
                }
            }     
            intervalHandle = requestAnimationFrame(this.drawSnow.bind(this),33);        
        },
    
        fall: function(params) {
            this.cleanup();
            this.validateParameters(params);
            this.generateCanvas();
            this.generateSnow();        
            this.drawSnow(); 
        }
    
    }   
}
