/**
 * Created by ndario on 8/1/15.
 */

define(['etc/CanvasGL/ProgramGL'], function(ProgramGL){
  var CanvasGL = function(config) {

    //  Canvas With WebGL
    this.canvas = null;
    this.container = null;
    this.canvas_rect = null;
    this.ctx = null;

    //  Initialize if possible
    if(config['canvas_id'] != null) {
      this.setWebGLCanvas(config['canvas_id']);
    }

    //  WebGL variables
    this.programs = [];

    return this;
  };

  CanvasGL.constructor = CanvasGL;

  //  Changable Methods
  CanvasGL.prototype = {
    initContext : function(){
      if (this.ctx) {
        this.ctx.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        this.ctx.enable(this.ctx.DEPTH_TEST);                               // Enable depth testing
        this.ctx.depthFunc(this.ctx.LEQUAL);                                // Near things obscure far things
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT|this.ctx.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
      }
    },
    initEventHandlers : function(){
      var that = this;
      document.addEventListener('mousemove', function(e){
        that.mpx = e.pageX - that.canvas_rect.left;
        that.mpy = e.pageY - that.canvas_rect.top;
      });
    },
  };

  //  Setters for changable methods
  CanvasGL.prototype.setContext = function(funct) {
    this.prototype.initContext = funct.bind(this);
  };
  CanvasGL.prototype.setEventHandlers = function(funct) {
    this.prototype.initEventHandlers = funct.bind(this);
  };

  //  Methods
  CanvasGL.prototype.setWebGLCanvas = function(canvasid){
    this.canvas = document.getElementById(canvasid);
    this.container = this.canvas.parentNode;
    this.canvas_rect = this.canvas.getBoundingClientRect();
    this.canvas.height= this.container.clientHeight - 20;
    this.canvas.width = this.container.clientWidth - 20;

    try {
      this.ctx = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')
    } catch(e){
      alert(e.message);
    }

    if (!this.ctx) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      this.ctx = null;
    }
  };

  CanvasGL.prototype.clearCanvas = function(){
    this.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
  };

  CanvasGL.prototype.execute = function(){
    for(var i in this.programs) {
      this.programs[i].execute();
    }
  };

  CanvasGL.prototype.createProgram = function(vertexShader, fragmentShader, drawFunction){
    this.programs.push(new ProgramGL(this.ctx, {
      vertexShader : this.createShader(vertexShader, this.ctx.VERTEX_SHADER),
      fragmentShader : this.createShader(fragmentShader, this.ctx.FRAGMENT_SHADER),
      drawFunction : drawFunction
    }));
  };

  /**
   * @param src
   * @param type
   * @returns {WebGLShader}
   */
  CanvasGL.prototype.createShader = function(src, type) {
    var shader = this.ctx.createShader(type);
    this.ctx.shaderSource(shader, src);
    this.ctx.compileShader(shader);
    if(!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      console.log(this.ctx.getShaderInfoLog(shader));
      //throw new Error(this.ctx.getShaderInfoLog(shader));
    }
    return shader;
  };

  CanvasGL.prototype.createShaderFromScript = function(script_id){
    var script = document.getElementById(script_id);
    if (!script) {
      return null;
    }
    var source = "";
    var child = script.firstChild;

    while (child) {
      if (child.nodeType == child.TEXT_NODE) {
        source += child.textContent;
      }
      child = child.nextSibling;
    }

    if (script.type == "x-shader/x-fragment") {
      return this.createShader(source, this.ctx.FRAGMENT_SHADER);
    } else if (script.type == "x-shader/x-vertex") {
      return this.createShader(source, this.ctx.VERTEX_SHADER);
    }

    return null;
  };




  return CanvasGL;

});
