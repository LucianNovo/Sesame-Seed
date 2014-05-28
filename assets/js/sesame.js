
    var spheres;
    var speeds = [ .15,.25, .35, .4, .5, .6, .75, .85, 1, 1.15, 1.25, 1.5];
    var cycles = [ .7, .75, .80, .85, .90, .95, 1.0, 1.05, 1.1, 1.15, 1.20, 1.25];
    var speed;
    var rotation = 1;
    var ss = {"angle": 90, "angleIncrement":0.03, "amplitude": 100, "cycles":1,"period":1,"verticalShift": 0, "horizontalShift": 0
    };

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
      for(var i=0; i<clusters[1].clusterPlanets.length; i++){
        scene.getObjectById(clusters[i].clusterPlanets[3].sphereID).material.color.setRGB(1,0,0);
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
          for(var i=0; len = spheres.length, i < len; i++){
            // spheres[i].position.y = (60-Math.sin(angle.angle)) * (planets[i].speed * speedScaler.speedScalar) * planets[i].relative;

            spheres[i].position.y = (60-Math.sin(ss.angle)) * planets[i].random + sizes[0] * planets[i].relative;

            // spheres[i].position.x = Math.cos(angle.angle * planets[i].speed)*85 * (planets[i].speed * speedScaler.speedScalar);

            spheres[i].position.x = (ss.amplitude * planets[i].planetAmplitude) * Math.cos(planets[i].cycle*(ss.angle - ss.horizontalShift) * planets[i].speed) + ss.verticalShift;

            // spheres[i].position.z = Math.sin(angle.angle * planets[i].speed)*85 * (planets[i].speed * speedScaler.speedScalar);

            spheres[i].position.z = (ss.amplitude * planets[i].planetAmplitude) * Math.sin(planets[i].cycle*(ss.angle - ss.horizontalShift) * planets[i].speed) + ss.verticalShift;
          }
          renderer.clear();
          camera.lookAt(scene.position);
          renderer.render(scene,camera);
      }

      init();
      function init(){
        createPlanets();
        setInterval(loop, 1000/60);
      }

      //make clusters of a certain size

      // Adds a GUI interface for changing the orbit
      var gui = new DAT.GUI();
      gui.add(ss, 'angleIncrement', 0, 1, 0.01);
      gui.add(ss, 'amplitude', 0, 200, 1);
      gui.add(ss, 'cycles', 0, 1, 0.01);
      gui.add(ss, 'period', 0, 1, .1);
      gui.add(ss, 'verticalShift', 0, 100, 1);
      gui.add(ss, 'horizontalShift', 0, 100, 1);
      // gui.add(ss, 'explode');