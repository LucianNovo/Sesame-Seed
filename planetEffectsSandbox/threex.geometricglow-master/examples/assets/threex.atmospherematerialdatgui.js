/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

THREEx.addAtmosphereMaterial2DatGui	= function(material, datGui){
	datGui		= datGui || new dat.GUI()
	var uniforms	= material.uniforms
	// options
	var options  = {
		coeficient	: uniforms['coeficient'].value,
		power		: uniforms['power'].value,
		glowColor	: '#'+uniforms.glowColor.value.getHexString(),
		presetFront	: function(){
			options.coeficient	= 1
			options.power		= 2
			onChange()
		},
		presetBack	: function(){
			options.coeficient	= 0.5
			options.power		= 4.0
			onChange()
		},
		pulse 		: function(){
			// TWEEN.removeAll();
			var start = { coeficient: 0, power: 0};
			var target = { coeficient: 2, power: 1};
			var tweenHead = new TWEEN.Tween(start)
				.to(target, 10000)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onUpdate(update);
			var tweenBack = new TWEEN.Tween(target)
				.to(start, 10000)
				.easing(TWEEN.Easing.Cubic.InOut)
				.onUpdate(update);
			
			var update = function(){
				uniforms['coeficient'].value = target.coeficient;
				uniforms['power'].value = target.power;
			}

			tweenHead.chain(tweenBack);
			tweenBack.chain(tweenHead);

			tweenHead.start();
			tweenHead.onComplete(console.log("tween complete"));
		},
	}
	var onChange = function(){
		uniforms['coeficient'].value = options.coeficient
		uniforms['power'].value		 = options.power
		uniforms.glowColor.value.set( options.glowColor ); 
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'coeficient'	, 0.0 , 2)
		.listen().onChange( onChange )
	datGui.add( options, 'power'		, 0.0 , 5)
		.listen().onChange( onChange )
	datGui.addColor( options, 'glowColor' )
		.listen().onChange( onChange )
	datGui.add( options, 'presetFront' )
	datGui.add( options, 'presetBack' )
	datGui.add( options, 'pulse' )
}