(function () {
    'use strict';

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
        SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

    var camera, scene, renderer, vrrenderer;

    var mouseX = 0,
        mouseY = 0;


    function init() {

        camera = new THREE.OrthographicCamera(-SCREEN_WIDTH_HALF, SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, -SCREEN_HEIGHT_HALF, 1, 10000);
        camera.position.z = 400;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x01131D, 0.001);

        var loader = new THREE.JSONLoader();
        var url = 'models/webgl-logo.js';
        loader.load(url, function (geometry, materials) {
            var mat = new THREE.MeshFaceMaterial(materials);
            var mesh = new THREE.Mesh(geometry, mat);
            var s = 200;
            mesh.scale.set(s, s, s);
            mesh.rotation.x = Math.PI / 2;
            scene.add(mesh);
        });

        var texture = THREE.ImageUtils.loadTexture('textures/cap.png');
        var box = new THREE.Mesh(
                new THREE.BoxGeometry(800, 1000, 20),
                new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    map: texture
                })
            );
        scene.add(box);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(100, 100, 100);
        scene.add(light);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x01131D);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        if (vrHMD) {
            vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
        }


        document.addEventListener('mousemove',  onDocumentMouseMove,  false);
        document.addEventListener('mousewheel', onDocumentMouseWheel, false);
        document.body.appendChild(renderer.domElement);

        //

        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onDocumentMouseMove(e) {
        e.preventDefault();

        mouseX = e.pageX - SCREEN_WIDTH_HALF;
        mouseY = e.pageY - SCREEN_HEIGHT_HALF;
    }

    function onDocumentMouseWheel(e) {
        e.preventDefault();
        camera.position.y += e.wheelDelta / 50;
    }

    //

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    var center = new THREE.Vector3(0, 0, 0);
    function render() {
        // var time = Date.now() * 0.00005;

        // camera.position.x += ( mouseX - camera.position.x) * 0.05;
        // camera.position.y += (-mouseY - camera.position.y) * 0.05;

        // camera.lookAt(scene.position);
        // renderer.render(scene, camera);
        
        if (vrHMDSensor) {
            var state = vrHMDSensor.getState();
            camera.quaternion.set(state.orientation.x, 
                                  state.orientation.y, 
                                  state.orientation.z, 
                                  state.orientation.w);
            vrrenderer.render(scene, camera);
        }
        else {
            renderer.render(scene, camera);
        }
    }

    var vrHMD       = null;
    var vrHMDSensor = null;
    function vrDeviceCallback(vrdevs) {
        for (var i = 0; i < vrdevs.length; i++) {
            if (vrdevs[i] instanceof HMDVRDevice) {
                vrHMD = vrdevs[i];
                break;
            }
        }
        for (var i = 0; i < vrdevs.length; i++) {
            if (vrdevs[i] instanceof PositionSensorVRDevice &&
                vrdevs[i].hardwareUnitId === vrHMD.hardwareUnitId) {
                vrHMDSensor = vrdevs[i];
                break;
            }
        }

        // Start a WebGL content.
        init();
        animate();
    }

    window.addEventListener('keypress', function(e) {
        camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 10000);
        camera.position.z = 400;

        if (e.charCode == 'f'.charCodeAt(0)) {
            if (renderer.domElement.mozRequestFullScreen) {
                renderer.domElement.mozRequestFullScreen({
                    vrDisplay: vrHMD
                });
            }
            else if (renderer.domElement.webkitRequestFullscreen) {
                renderer.domElement.webkitRequestFullscreen({
                    vrDisplay: vrHMD,
                });
            }
        }

        if (e.charCode == 'w'.charCodeAt(0)) {
            camera.position.z += 0.1;
        }
        if (e.charCode == 'x'.charCodeAt(0)) {
            camera.position.z -= 0.1;
        }
    }, false);

    if (navigator.getVRDevices) {
        navigator.getVRDevices().then(vrDeviceCallback);
    }
    else {
        // Start a WebGL content.
        init();
        animate();
    }

}());
