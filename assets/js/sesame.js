
    var spheres;
    var speeds = [ .15,.25, .35, .4, .5, .6, .75, .85, 1, 1.15, 1.25, 1.5];
    var cycles = [ .7, .75, .80, .85, .90, .95, 1.0, 1.05, 1.1, 1.15, 1.20, 1.25];
    var speed;
    var rotation = 1;
    var ss = {"angle": 90, "angleIncrement":0.03, "clusterAmplitude": 5, "planetAmplitude": 1, "amplitude": 3, "cycles":1,"period":1,"verticalShift": 0, "xShift": 0,"zShift": 0, "horizontalShift": 0
    };

    //Project Variable
    var projector;

    //Planet Variables
    var planets;
    function planet(){};
    var PLANET_COUNT = 40;

    //Cluster Variables
    var clusters = [];
    // var cluster  = {"cluster_ID": 0, "name": "untitled","clusterPlanets" : []};
    function cluster(cluster_ID){
      this.cluster_ID = cluster_ID;
      this.name = "untitled";
      this.clusterPlanets = [];
    }

    var CLUSTER_MAX   = 8;
    var cluster_count = Math.floor(Math.random() * CLUSTER_MAX + 2);

    // Creating the cube
      var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      renderer.setSize(document.body.clientWidth, document.body.clientHeight);
      document.body.appendChild(renderer.domElement);
      // renderer.setClearColorHex(0xFFFFFF, 1.0);
      renderer.setClearColor( 0x0000000, 1);
      renderer.clear();

      var fov = 45;
      var width  = renderer.domElement.width; 
      var height = renderer.domElement.height;

      var aspect = width/height;

      var near = 1;
      var far = 10000;

      var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 300;

      var scene = new THREE.Scene();
      var cube  = new THREE.Mesh(
        new THREE.CubeGeometry(30,30,30),
        new THREE.MeshBasicMaterial({color: 0xCCCCCC, opacity: 1})
      );
      scene.add(cube);
      renderer.render(scene, camera);

  // Creating the light

    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    dirLight.position.set( 0, -1, 0 ).normalize();
    scene.add( dirLight );

    dirLight.color.setHSL( 0.1, 0.7, 0.5 );

    var RADIUS = 30;
    var relatives = [1, -1];
    var sizes  = [7, 8, 9, 10, 11];
    var kuler  = ["0xFFFFFF","0x1C2842","0xFFF2B3"];
    // var kuler = ["0x32450C", "0x717400", "0xDC8505", "0xEC5519", "0xBE2805"];

    function createPlanets(){
        planets = []; // reference from global
        spheres = []; // reference from global
        for(var i=0; i<PLANET_COUNT; i++){
          var geometry   = new THREE.SphereGeometry( sizes[Math.floor(Math.random() * sizes.length)], 8, 8 );
          var material   = new THREE.MeshBasicMaterial( {color: Number(kuler[Math.floor(Math.random() * kuler.length)])});
          spheres[i]     = new THREE.Mesh( geometry, material );
          // scene.add(spheres[i]);

          // Create a new planet reference
          var planetSpawn = new planet();
          planetSpawn = {
            speed:      speeds[Math.floor(Math.random() * speeds.length)],
            relative:   relatives[Math.floor(Math.random() * relatives.length)],
            random:     Math.random() * speeds[speeds.length-1],
            cycle:      cycles[Math.floor(Math.random() * cycles.length)],
            targetSize: 1,
            orbit:      RADIUS*.5 + (RADIUS * .5 * Math.random()),
            geometry:   geometry,
            material:   material,
            sphereInitID: i,
            sphere:     spheres[i],
            sphereID:   spheres[i].id,
            planetAmplitude : Math.floor(Math.random() * 20 + 5),
          }
          scene.add(planetSpawn.sphere);

          planets[i] = planetSpawn;
        }

        //take all the planets, and put them in various clusters
        var cluster_inc  = 0;
        var cluster_iter = 0;
        var planet_inc   = 0;
        
        //while we haven't compiled every planet
        while(planet_inc < planets.length){
          clusters[cluster_inc] = new cluster(planet_inc);
          clusters[cluster_inc].cluster_ID = cluster_inc; 
          //for each size of each cluster
          for(cluster_iter = 0; ((cluster_iter < cluster_count) && (planet_inc < planets.length)); cluster_iter++){
            //add a planet to the iterated cluster
            clusters[cluster_inc].clusterPlanets[cluster_iter] = planets[planet_inc++];
            //add a planet to the iterated cluster
          }
          cluster_inc++;
        }
    }


    function changeClusterColor(clusterID, colorString){
      // changes color by cluster reference
      //scene.getObjectByName( "objectName", true ); // alternative to getByName
      for(var i=0; i<clusters[clusterID].clusterPlanets.length; i++){
        scene.getObjectById(clusters[clusterID].clusterPlanets[i].sphereID).material.color.setHex(colorString);
      }
    } 

  // Creating the orbit
      var paused = false;
      var last = new Date().getTime();
      var down = false;
      var sx = 0;
      var sy = 0;

      window.onmousedown = function (ev){
        down = true; sx = ev.clientX; sy = ev.clientY;
      }
      window.onmouseup = function(){down = false}
      window.onmousemove = function(ev){
        if(down){
          var dx = ev.clientX - sx;
          var dy = ev.clientY - sy;
          // console.log("X-location: " + ev.clientX);
          // console.log("Y-location: " + ev.clientY);
          rotation += dx/100;
          // console.log("rotation: " + rotation);
          camera.position.x = Math.cos(rotation)*250;
          camera.position.z = Math.sin(rotation)*250;
          camera.position.y += dy;
          // console.log("Camera X position: " + camera.position.x); 
          // console.log("Camera Z position: " + camera.position.z);
          // console.log("Camera Y position: " + camera.position.y);
          sx += dx;
          sy += dy;
        }
      }

      function cameraOrbit(t){
          if(!down){
            camera.position.set(
              Math.sin(t/1000) * 300, sy, Math.cos(t/1000) * 300);
          }
      }

      onmessage = function(ev) {
        paused = (ev.date == 'pause');
      };

      function loop(){
          ss.angle += ss.angleIncrement;

          //local variable for eff's sake
          var clusterRef;
          var planetRef;

          //Update every planet(p) of every cluster(c) 
          for(var c=0; c < clusters.length; c++){
            clusterRef = clusters[c];
            planetRef  = clusters[c].clusterPlanets[0];

            //Give each central planet a color
            clusters[c].clusterPlanets[0].sphere.material.color.setRGB(1,0,0); 
            //update orbit around universal center (0,0,0)
            planetRef.sphere.position.y = (60-Math.sin(ss.angle)) * planetRef.random + sizes[0] * planetRef.relative;
            planetRef.sphere.position.x = (ss.clusterAmplitude * planetRef.planetAmplitude) * Math.cos(planetRef.cycle*(ss.angle - ss.horizontalShift) * planetRef.speed) + ss.verticalShift;
            planetRef.sphere.position.z = (ss.clusterAmplitude * planetRef.planetAmplitude) * Math.sin(planetRef.cycle*(ss.angle - ss.horizontalShift) * planetRef.speed) + ss.verticalShift;         

            //iterate through every every planet of every cluster
            for(var p=1; p < clusters[c].clusterPlanets.length; p++){
              planetRef = clusterRef.clusterPlanets[p];

              //change the color of every planet in the cluster
              planetRef.sphere.material.color.setHex(["0x32450C", "0x717400", "0xDC8505", "0xEC5519", "0xBE2805","0x32450C", "0x717400", "0xDC8505", "0xEC5519", "0xBE2805","0x32450C", "0x717400", "0xDC8505", "0xEC5519", "0xBE2805","0x32450C"][c]);
              // udpate x,y and z around central orbit
              // planetRef.sphere.position.y = (60-Math.sin(ss.angle)) * planetRef.random + sizes[0] * planetRef.relative;
              planetRef.sphere.position.y = clusterRef.clusterPlanets[0].sphere.position.y;
              planetRef.sphere.position.x = (planetRef.planetAmplitude) * Math.cos(planetRef.cycle*(ss.angle - ss.horizontalShift) * planetRef.speed) + ss.verticalShift + clusterRef.clusterPlanets[0].sphere.position.x;
              planetRef.sphere.position.z = (planetRef.planetAmplitude) * Math.sin(planetRef.cycle*(ss.angle - ss.horizontalShift) * planetRef.speed) + ss.verticalShift + clusterRef.clusterPlanets[0].sphere.position.z;
            }
          }


          //Renderer Animation managment
          renderer.clear();
          camera.lookAt(scene.position);
          renderer.render(scene,camera);
      }

      function onDocumentMouseDown( event ) {

        event.preventDefault();

        var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( spheres );

        if ( intersects.length > 0 ) {

          //makes object clicked.
          intersects[ 0 ].object.material.color.setHex(0xffffff);
          console.log(intersects[ 0 ].object);

          //Creates a particle where cube is clicked
          // var particle = new THREE.Sprite( particleMaterial );
          // particle.position = intersects[ 0 ].point;
          // particle.scale.x = particle.scale.y = 16;
          // scene.add( particle );

        }

        /*
        // Parse all the faces
        for ( var i in intersects ) {

          intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

        }
        */
      }

      init();
      function init(){

        createPlanets();

        projector = new THREE.Projector();

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );

        setInterval(loop, 1000/60);
      }

      //make clusters of a certain size

      // Adds a GUI interface for changing the orbit
      var gui = new DAT.GUI();
      gui.add(ss, 'angleIncrement', 0, 1, 0.01);
      gui.add(ss, 'amplitude', 0, 25, .5);
      gui.add(ss, 'clusterAmplitude', 0, 25, .5);
      gui.add(ss, 'planetAmplitude', 0, 25, .5);
      gui.add(ss, 'cycles', 0, 1, 0.01);
      gui.add(ss, 'period', 0, 1, .1);
      gui.add(ss, 'verticalShift', 0, 100, 1);
      gui.add(ss, 'xShift', 0, 100, 1);
      gui.add(ss, 'zShift', 0, 100, 1);
      gui.add(ss, 'horizontalShift', 0, 100, 1);
      // gui.add(ss, 'explode');