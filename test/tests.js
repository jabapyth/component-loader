
var componentLoader = require('component-loader');
var expect = chai.expect;

var newDiv = function(parent, attrs){
  var node = document.createElement('div');
  var keys = Object.keys(attrs);
  for (var i=0; i<keys.length; i++) {
    node.setAttribute(keys[i], attrs[keys[i]]);
  }
  (parent || document.body).appendChild(node);
  return node;
};

describe('component-loader', function(){
  var one
    , one_comp
    , two
    , two_comp
    , three
    , three_comp
    , mockRequire;
  beforeEach(function(){
    one = newDiv(null, {'data-comp': 'ones'});
    two = newDiv(one, {'data-comp': 'twos'});
    three = newDiv(null, {'data-comp': 'threes'});
    mockRequire = sinon.stub();
    one_comp = sinon.stub();
    one_comp.returns(true);
    two_comp = sinon.stub();
    two_comp.returns(true);
    three_comp = sinon.stub();
    three_comp.returns(true);
    mockRequire.withArgs('ones').returns(one_comp);
    mockRequire.withArgs('twos').returns(two_comp);
    mockRequire.withArgs('threes').returns(three_comp);
  });
  afterEach(function(){
    one.parentNode.removeChild(one);
    three.parentNode.removeChild(three);
  });
  it('should find all elements', function(){
    componentLoader(null, {require: mockRequire});
    expect(mockRequire.callCount).to.eql(3);
    expect(one_comp.called).to.be.true;
    expect(two_comp.called).to.be.true;
    expect(three_comp.called).to.be.true;
  });
  it('should respect boundries', function(){
    componentLoader(one, {require: mockRequire});
    expect(mockRequire.callCount).to.eql(1);
    expect(mockRequire.firstCall.args).to.eql(['twos']);
    expect(one_comp.called).to.be.false;
    expect(two_comp.called).to.be.true;
    expect(three_comp.called).to.be.false;
  });
  describe('when a component is not found', function(){
    var onerror
      , four;
    beforeEach(function(){
      onerror = sinon.spy();
      four = newDiv(null, {'data-comp': 'four'});
      mockRequire.withArgs('four').throws('require failed');
    });
    afterEach(function(){
      four.parentNode.removeChild(four);
    });
    it('should call onerror', function(){
      componentLoader(null, {require: mockRequire, onerror: onerror});
      expect(onerror.callCount).to.eql(1);
    });
  });
  describe('when there is invalid config', function(){
    var onerror;
    beforeEach(function(){
      onerror = sinon.spy();
      one.setAttribute('data-config', '{{{');
    });
    it('should call onerror', function(){
      componentLoader(null, {require: mockRequire, onerror: onerror});
      expect(onerror.callCount).to.eql(1);
    });
  });
  describe('when a component fails to initialize', function(){
    var onerror;
    beforeEach(function(){
      onerror = sinon.spy();
      one_comp.returns(false);
    });
    it('should call onerror', function(){
      componentLoader(null, {require: mockRequire, onerror: onerror});
      expect(onerror.callCount).to.eql(1);
    });
  });
  describe('without a shadowed require', function(){
    it('should throw the proper error', function(){
      var onerror = sinon.spy();
      componentLoader(one, {onerror: onerror});
      expect(onerror.callCount).to.eql(1);
      expect(onerror.firstCall.args[1].message).to.match(/^Failed to require/);
    });
  });
});

