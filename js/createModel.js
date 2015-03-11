/* CREATE MORPH GEOMETRY */
var uniforms = {};
uniforms.texRef = {
  "type": "t",
};

var meshToon = null;
var loader = new THREE.JSONLoader();
loader.load('model/logo-flat.js', function (geometry, materials) {
    meshToon = new THREE.Mesh(
        geometry,
        new THREE.ShaderMaterial({
            "uniforms": uniforms,
            "vertexShader": document.getElementById("shader-vertex").text,
            "fragmentShader": document.getElementById("shader-fragment-cartoon").text,
            "side": THREE.FrontSide,
            "transparent": true
        })
    );
});

// For toon shader
// var meshToonBackSide = new THREE.Mesh(
//     this.geoLogo,
//     new THREE.ShaderMaterial({
//       "uniforms": uniforms,
//       "vertexShader": document.getElementById("shader-vertex-cartoon-edge").text,
//       "fragmentShader": document.getElementById("shader-fragment-cartoon-edge").text,
//       "side": THREE.BackSide,
//       "transparent": true,
//     })
// );
// var meshToonEdge = new THREE.Mesh(
//     this.geoLogoEdge,
//     new THREE.ShaderMaterial({
//       "uniforms": uniforms,
//       "vertexShader": document.getElementById("shader-vertex").text,
//       "fragmentShader": document.getElementById("shader-fragment-cartoon-edge").text,
//       "side": THREE.DoubleSide,
//       "transparent": true
//     })
// );

