			import * as THREE from '../build/three.module.js';

			import { PointerLockControls } from './jsm/controls/PointerLockControls_loose.js';
			import { DeviceOrientationControls } from './jsm/controls/DeviceOrientationControls_walk.js';

			let camera, evc, renderer, controls;

			var material;
			var geometry;

			const objects = [];

			let raycaster;

			let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;

			let mobilemoveForward = false;
			let mobilemoveBackward = false;
			let mobilemoveLeft = false;
			let mobilemoveRight = false;

			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();

			var x = document.getElementById("finfo");
			var y = document.getElementById("ninfo");
			var z = document.getElementById("dinfo");
			var m = document.getElementById("minfo");

			var firstlatcut;
			var firstlongcut;

			var latcutonce, longcutonce, latcutnow, longcutnow, lattravelcut, longtravelcut;

			var refresh = 1000;
			var specificity = 15;
			var mul = 1000000;

			getLocationonce();
			getLocationnow();
			setTimeout(function(){
				showdifference();
				setTimeout(function(){
					showmultiplication();
				},100);
			}, 3000);

			function getLocationonce() {
			  if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(showPositiononce);
				}
			}

			function showPositiononce(positiononce) {
				var latonce = String(positiononce.coords.latitude);
				var longonce = String(positiononce.coords.longitude);
				latcutonce = latonce.slice(0, specificity);
				longcutonce = longonce.slice(0, specificity);
				x.innerHTML = "lat: " + latcutonce + "<br>long: " + longcutonce;
			    return;
			}

			function getLocationnow() {
			  if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(showPositionNow);
				    setTimeout(function(){
				    	getLocationnow();
				    },refresh);
				}
			}

			function showPositionNow(positiononce) {
				var latnow = String(positiononce.coords.latitude);
				var longnow = String(positiononce.coords.longitude);
				latcutnow = latnow.slice(0, specificity);
				longcutnow = longnow.slice(0, specificity);
				y.innerHTML = "lat: " + latcutnow + "<br>long: " + longcutnow;
			}

			function showdifference(positiononce) {
				var lattravel = (latcutnow - latcutonce);
				var longtravel = (longcutnow - longcutonce);
				var lattravelstring = String(lattravel);
				var longtravelstring = String(longtravel);
				lattravelcut = lattravelstring.slice(0, specificity);
				longtravelcut = longtravelstring.slice(0, specificity);
				z.innerHTML = "lat travel: " + lattravelcut + "<br>long travel: " + longtravelcut;
				setTimeout(function(){
					showdifference();
				},refresh)
			}

			function showmultiplication() {
				var multi = (lattravelcut*mul);
				m.innerHTML = "lat multiplied: " + String(multi);
				setTimeout(function(){
					showmultiplication();
				},refresh)
			}

			function init() {

				console.log("beginning");

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.position.y = 10;

				evc = new THREE.Scene();
				evc.background = new THREE.Color( 0xffffff );
				evc.fog = new THREE.Fog( 0xffffff, 0, 750 );

				const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
				light.position.set( 0.5, 1, 0.75 );
				evc.add( light );

				if (isMobile==true) {
					controls = new DeviceOrientationControls( camera );
				}else{
					controls = new PointerLockControls( camera, document.body );
					evc.add( controls.getObject() );
				}

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				
				var canvas = document.getElementById( 'canvas' );
				canvas.appendChild( renderer.domElement );

				const onKeyDown = function ( event ) {
					switch ( event.code ) {
						case 'ArrowUp':
						case 'KeyW':
							moveForward = true;
							break;
					}
				};
				const onKeyUp = function ( event ) {
					switch ( event.code ) {
						case 'ArrowUp':
						case 'KeyW':
							moveForward = false;
							break;
					}
				};

				geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );

				window.addEventListener( 'resize', onWindowResize );
				window.addEventListener( 'keydown', onKeyDown );
				window.addEventListener( 'keyup', onKeyUp );
			}	

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			var io=1;
			$("body").click(function(){
					if (io==1) {
						init();
						animate();
						addtestmesh();
						io=2;
					}
				})

			function addtestmesh(){
				for ( let i = 0; i < 50; i ++ ) {
					material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, flatShading: true } );
					const mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = Math.random() * 1000 - 500;
					mesh.position.y = 0;
					mesh.position.z = Math.random() * 100 - 50;
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = false;
					evc.add( mesh );
				}
			}

			const walkdirection = new THREE.Vector3;

			let speed = 1.0;

			function animate() {

				console.log(camera.position.x);

					if (isMobile==true) {
						// camera.getWorldDirection(walkdirection);
						camera.position.x=-lattravelcut*mul;
						// camera.position.z=(longtravelcut+=longtravelcut);
					}

					requestAnimationFrame( animate );
					if (isMobile==true) {
						controls.update();
					}

				    if (isMobile==true) {
				    	camera.getWorldDirection(walkdirection);
					    if(mobilemoveForward==true){
							camera.position.addScaledVector(walkdirection, speed);
						}
						if(mobilemoveForward==false){
							camera.position.addScaledVector(walkdirection, 0);
						}
					}
					const time = performance.now();
					if ( controls.isLocked === true ) {
						const delta = ( time - prevTime ) / 1000;
						velocity.x -= velocity.x * 10.0 * delta;
						velocity.z -= velocity.z * 10.0 * delta;
						velocity.y -= 9.8 * 100.0 * delta;
						direction.z = Number( moveForward ) - Number( moveBackward );
						direction.x = Number( moveRight ) - Number( moveLeft );
						direction.normalize();
						if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
						if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
						velocity.y = Math.max( 0, velocity.y );
						controls.moveRight( - velocity.x * delta );
						controls.moveForward( - velocity.z * delta );
						controls.getObject().position.y += ( velocity.y * delta );
						if ( controls.getObject().position.y < 10 ) {
							velocity.y = 0;
							controls.getObject().position.y = 10;
						}
					}
					prevTime = time;
					renderer.render( evc, camera );
				}
