/**
 * Created by ndario on 8/1/15.
 */

define(function(){

  var ProgramGL = function(ctx, config){
    this.ctx = ctx;

    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.attributes = {};
    this.uniforms = {};
    this.attrdata = {
      //  attr : {
      //    data:[data, data, ...],
      //    segsize:int
      //  }
    };
    this.unifdata = {
      //  unif : {
      //    data:[data, data, ...],
      //    segsize:int
      //  }
    };
    this.changed = {
      //  name : type
    };
    this.enabled = true;
    this.drawType = this.ctx.POINTS;

    //  Function to be drawn every round

    if(config['vertexShader'] != null){
      this.vertexShader = config['vertexShader'];
    }

    if(config['fragmentShader'] != null){
      this.fragmentShader = config['fragmentShader'];
    }

    if(this.vertexShader != null && this.fragmentShader != null) {
      this.initProgram();
    }

    return this;
  };

  ProgramGL.constructor = ProgramGL;

  ProgramGL.prototype.draw = null;
  ProgramGL.prototype.setDrawFunction = function(funct){
    this.draw = funct.bind(this);
  };

  ProgramGL.prototype.setVertexShader = function(vspointer) {

  };

  ProgramGL.prototype.setFragmentShader = function(fspointer) {

  };

  ProgramGL.prototype.initProgram = function(){
    this.program = this.ctx.createProgram();
    this.ctx.attachShader(this.program, this.vertexShader);
    this.ctx.attachShader(this.program, this.fragmentShader);
    this.ctx.linkProgram(this.program);
    if(!this.ctx.getProgramParameter(this.program, this.ctx.LINK_STATUS)){
      console.log('Unable to initalize program');
      return false;
    }
    return true;
  };

  ProgramGL.prototype.execute = function() {
    if(this.enabled == true){
      this.ctx.useProgram(this.program);
      this._retrieveAttributes();
      this._retrieveUniforms();
      this.draw();
    }
  };

  ProgramGL.prototype.updateAttribute = function(attr, data, size) {
    this.attrdata[attr].data = data;
    this.attrdata[attr].segsize = size;
    this.changed[attr] = 'attrdata'
  };

  ProgramGL.prototype.updateUniform = function(unif, data, size) {
    this.unifdata[unif].data = data;
    this.unifdata[unif].segsize = size;
    this.changed[unif] = 'unifdata'
  };

  /**
   * @private
   * When attribute and uniform data is changed
   * We push new data into their buffers.
   */
  ProgramGL.prototype._updateData = function() {
    for(var attr in this.changed) {
      var type = this.changed[attr];
      var data = new Float32Array(this[type][attr].data);
      var dataSize = this[type][attr].dataSize;
      //var bpe = data.BYTES_PER_ELEMENT;

      var buffer = this.ctx.createBuffer();
      this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer);
      this.ctx.bufferData(this.ctx.ARRAY_BUFFER, data, this.ctx.STATIC_DRAW);
      this.ctx.vertexAttribPointer(this.attributes[attr], dataSize, this.ctx.FLOAT, false, 0, 0);
      this.ctx.enableVertexAttribArray(this.attributes[attr]);
      this.changed.splice(attr, 1);
    }
  };

  ProgramGL.prototype._drawData = function() {
    for(var attr in this.attributes){
      this.ctx.drawArrays(this.drawType, 0, data.length / dataSize);
    }
  };

  ProgramGL.prototype._retrieveAttributes = function(){
    var numAttributes = this.ctx.getProgramParameter(this.program, this.ctx.ACTIVE_ATTRIBUTES);
    for (var i=0; i<numAttributes; i++) {
      var nameAttrib = this.ctx.getActiveAttrib(this.program, i).name;
      this.attributes[nameAttrib] = this.ctx.getAttribLocation(this.program, nameAttrib);
    }
  };

  ProgramGL.prototype._retrieveUniforms = function(){
    var numUniforms = this.ctx.getProgramParameter(this.program, this.ctx.ACTIVE_UNIFORMS);
    for (var i=0; i<numUniforms; i++) {
      var nameUniform = this.ctx.getActiveUniform(this.program, i).name;
      this.uniforms[nameUniform] = this.ctx.getUniformLocation(this.program, nameUniform);
    }
  };

  return ProgramGL;
});
