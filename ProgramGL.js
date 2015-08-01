/**
 * Created by ndario on 8/1/15.
 */

define(function(){

  var ProgramGL = function(){



    this.attributes = {};
    this.uniforms = {};
    this.verterShader = null;
    this.fragmentShader = null;
    this.enabled = true;

    //  Function to be drawn every round
    this.draw = null;


  };

  ProgramGL.constructor = ProgramGL;

  ProgramGL.prototype.setDrawFunction = function(funct){
    this.draw = funct.bind(this);
  };

  ProgramGL.prototype.setVertexShader = function(shaderText) {};

  ProgramGL.prototype.setFragmentShader = function(shaderText) {};

  ProgramGL.prototype.execute = function() {
    if(this.enabled == true){
      this.draw.call(this);
    }
  };

  ProgramGL.prototype.updateAttribute = function(attr, data) {};
  ProgramGL.prototype.updateUniform = function(attr, data) {};
  ProgramGL.prototype._retrieveAttributes = function(){};
  ProgramGL.prototype._retrieveUniforms = function(){};




  return ProgramGL;
});
