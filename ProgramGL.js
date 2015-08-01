/**
 * Created by ndario on 8/1/15.
 */

define(function(){

  var ProgramGL = function(ctx, config){
    this.ctx = ctx;

    this.attributes = {};
    this.uniforms = {};
    this.verterShader = null;
    this.fragmentShader = null;
    this.enabled = true;

    //  Function to be drawn every round
    this.draw = null;

    if(config['vertexShader'] != null){
      this.setVertexShader(config['vertexShader']);
    }

    if(config['fragmentShader'] != null){
      this.setFragmentShader(config['fragmentShader']);
    }

    return this;
  };

  ProgramGL.constructor = ProgramGL;

  ProgramGL.prototype.setDrawFunction = function(funct){
    this.draw = funct.bind(this);
  };

  ProgramGL.prototype.setVertexShader = function(vspointer) {

  };

  ProgramGL.prototype.setFragmentShader = function(fspointer) {

  };

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
