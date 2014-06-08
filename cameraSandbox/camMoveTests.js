    var cameraSpline;
    var zoomDestinationId;

    CAMERA_RELATION = {
        ABOVE: 0,
        SAME_ANGLE: 1,
        TOWARD_CENTER: 2
    } 

    function zoomAndDollyToPoint(startPoint,destinationId,callback){
        console.log("dollying");
        //don't go anywhere else if you're in the middle of an animation
        if(ss.cameraAnimating == true) return;
        this.firstClick = false;

        //make starts and destinations vectors
        zoomDestinationId = destinationId;
        var destinationPoint = scene.getObjectById(destinationId);
        var destinationVector = new THREE.Vector3(destinationPoint.position.x, destinationPoint.position.y,destinationPoint.position.z), 
        startVector = startPoint.position.clone(), 
        //create a camera path between the two vectors             
        cameraPath = cameraPathToPoint(startVector, destinationVector),
        upClone = new THREE.Vector3(0,0.93,0.36);
        //current position TBE
        currentPosition = {now:0},
        targetCurrent   = destinationVector.clone();
        duration = 2;

        TweenMax.to(startVector,duration/1.1,{
            x:startVector.x,
            y:startVector.y,
            z:startVector.z
        });
        TweenMax.to(currentPosition,duration,{
            now:0.8,
            onUpdate: function(){
                var pos = cameraPath.getPoint(currentPosition.now);
                target  = new THREE.Vector3(targetCurrent.x,targetCurrent.y,targetCurrent.z); 
                camera.position.set(pos.x,pos.y,pos.z);
                camera.up.set(0,0.93,0.36);
                camera.lookAt(destinationVector);
                camera.updateProjectionMatrix();
            },
            onStart: startAnimation(),
            onComplete: function(){
                endAnimation();
                if(typeof callback === "function") callback();
            }
        })
    };

    function reset(callback){
        var duration = 2,
            home = ss.Settings.cameraDefaultPosition.clone(),
            center = ss.Settings.cameraDefaultTarget.clone(),
            upGoal = ss.Settings.cameraDefaultUp.clone(),
            upCurrent = camera.up.clone(),
            targetCurrent = target.clone(),
            positionCurrent = camera.position.clone();

        // never do anything when nothing will suffice. The callback should have no delay.
        if (camera.up.equals(ss.Settings.cameraDefaultUp) &&
            camera.position.equals(ss.Settings.cameraDefaultPosition) &&
            target.equals(ss.Settings.cameraDefaultTarget)) {

            duration = 0.1;
        }
        if (ss.isAnimating === true) return;

        TweenMax.to(upCurrent,duration/1.5,{x: upGoal.x,y: upGoal.y,z: upGoal.z});
        TweenMax.to(targetCurrent,duration/1.5,{x: center.x,y: center.y, z: center.z});
        TweenMax.to(positionCurrent,duration,{x: home.x,y: home.y, z: home.z,ease: Power1.easeInOut,
            onUpdate: function(){
                target = new THREE.Vector3(targetCurrent.x,targetCurrent.y,targetCurrent.z);
                camera.position.set(positionCurrent.x,positionCurrent.y,positionCurrent.z);
                camera.up.set( upCurrent.x,upCurrent.y,upCurrent.z );
                camera.lookAt(target.clone());
                camera.updateProjectionMatrix();
            },
            onComplete: function(){
                endAnimation();
                firstClick = true;
                if (typeof callback === "function") callback();
            },
            onStart: startAnimation()
        })
    };

    function startAnimation(){
        // startAnimation refers to user-initiated animations. The default animation must be removed if ongoing.
        // this.endAutomaticTravel();
        ss.cameraAnimating = true;
        controls.enabled   = false;
        console.log("Start animation");
    }

    function endAnimation(){
        // startAnimation refers to user-initiated animations. The default animation must be removed if ongoing.
        // this.endAutomaticTravel();
        ss.cameraAnimating = false;
        var destinationPoint = scene.getObjectById(zoomDestinationId);
        controls.target.set( destinationPoint.position.x,destinationPoint.position.y,destinationPoint.position.z);
        controls.enabled   = true;
        controls.chillOut();
        console.log("End animation");
    }

    function cameraPathToPoint(fromPoint,toPoint){
        var spline = new THREE.SplineCurve3([
           fromPoint,
           new THREE.Vector3( (toPoint.x-fromPoint.x)*0.5 + fromPoint.x, (toPoint.y-fromPoint.y)*0.5 + fromPoint.y, (toPoint.z-fromPoint.z)*0.7 + fromPoint.z),
           toPoint
        ]);

        // //create a line along the spline
        // //materials and geometry
        // var lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        // var lineGeometry  = new THREE.Geometry();
        // //line vertices
        // lineGeometry.vertices.push(fromPoint.clone());
        // lineGeometry.vertices.push(new THREE.Vector3( (toPoint.x-fromPoint.x)*0.5 + fromPoint.x, (toPoint.y-fromPoint.y)*0.5 + fromPoint.y, (toPoint.z-fromPoint.z)*0.7 + fromPoint.z));
        // lineGeometry.vertices.push(toPoint.clone());
        // //creating the line
        // var cameraSpline = new THREE.Line(lineGeometry, lineMaterial);
        // scene.add(cameraSpline);

        return spline;
    }

     function strafeFromPointToPoint(startPoint,destinationId,callback){
        console.log("Strafing");
        destinationPoint = scene.getObjectById(destinationId);
        var dest = destinationPoint.clone(),
            current = camera.position.clone(),
            duration = 0.5;
            // that = this;
        dest.sub(startPoint.clone());
        dest.add(current.clone());
        console.log("\n\n",startPoint,destinationPoint,current,dest);

        // if (that.isAnimating === true) return;
        TweenMax.to(camera.position,duration,
            {
                x:startVector.x,
                y:startVector.y,
                z:startVector.z,
            onComplete: function(){
                endAnimation();
                camera.lookAt(destinationPoint.clone());
                target = destinationPoint.clone();
                if (typeof callback === "function") callback();
            },
            onStart: startAnimation()
        })
    }