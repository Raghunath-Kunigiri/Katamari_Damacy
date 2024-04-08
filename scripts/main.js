window.onload = function() {
    // WebGL initialization
    var canvas = document.getElementById("gameCanvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        alert("Your browser does not support WebGL");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Set the viewport to cover the entire canvas area
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader program
    var vsSource = `
        attribute vec4 aVertexPosition;
        uniform vec2 uTranslation;
        varying vec4 vColor;

        void main(void) {
            // Apply translation
            vec2 translatedPosition = aVertexPosition.xy + uTranslation;
            gl_Position = vec4(translatedPosition, 0.0, 1.0);
            vColor = vec4(1.0, 1.0, 1.0, 1.0); // White color
        }
    `;

    // Fragment shader program
    var fsSource = `
        precision mediump float;
        varying vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
    `;

    // Initialize shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create shader program
    var shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    // Set up vertex position attribute
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        // Platform vertices
        -0.75, -0.9,
        0.75, -0.9,
        0.75, -1.0, -0.75, -0.9,
        0.75, -1.0, -0.75, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Enable the vertex attribute array
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer to the attribute
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Ball vertices
    var ballRadius = 0.1;
    var ballSegments = 30;
    var ballVertices = [];
    for (var i = 0; i <= ballSegments; i++) {
        var theta = (i / ballSegments) * Math.PI * 2;
        var x = ballRadius * Math.cos(theta);
        var y = ballRadius * Math.sin(theta);
        ballVertices.push(x, y);
    }

    // Ball buffer
    var ballBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ballVertices), gl.STATIC_DRAW);

    // Animation variables
    var translation = [0, 0]; // Initial translation
    var translationSpeed = 0.01; // Speed of translation animation

    // Rotation angle for the ball
    var ballRotation = 0;

    // Keydown event handler for controlling the ball
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            ballRotation += 0.1;
        } else if (event.key === 'ArrowRight') {
            ballRotation -= 0.1;
        }
    });

    // Main render loop
    function render() {
        // Update translation for animation
        translation[0] += translationSpeed; // Translate along x-axis
        translation[1] += translationSpeed; // Translate along y-axis

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the translation uniform in the shader
        var translationLocation = gl.getUniformLocation(shaderProgram, "uTranslation");
        gl.uniform2fv(translationLocation, translation);

        // Use the shader program
        gl.useProgram(shaderProgram);

        // Draw the platform
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Set the rotation uniform in the shader for the ball
        var rotationLocation = gl.getUniformLocation(shaderProgram, "uRotation");
        gl.uniform1f(rotationLocation, ballRotation);

        // Draw the ball
        gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, ballSegments + 2);

        // Request the next frame
        requestAnimationFrame(render);
    }

    // Start the animation loop
    render();
};

// Function to create a shader
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Function to create a shader program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error("Program linking failed:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}