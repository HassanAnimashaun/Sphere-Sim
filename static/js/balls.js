// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10; // camera position

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Function to create a sphere
function createSphere(radius, positionX, positionY, positionZ) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshPhongMaterial({ color: color, shininess: 100 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(positionX, positionY, positionZ);
  scene.add(sphere);
  return sphere;
}

// Variables for simulation
let spheres = [];
let frameCount = 0;
let totalTime = 0;
let lastTime = performance.now(); 
let startTime = performance.now(); //current time in milliseconds
let ballsPerSecond = 5;
let testDuration = 10000;
let isTestRunning = false;
let lastBallTime = 0;

function monitorPerformance() {
  const currentTime = performance.now(); // gets current time in milliseconds
  const deltaTime = currentTime - lastTime; //time between frames
  lastTime = currentTime; //updates current frame timestamp

  frameCount++; //increment frame count
  totalTime += deltaTime; //increment total time


  // Add spheres at the specified rate 
  if (isTestRunning && currentTime - lastBallTime >= 1000 / ballsPerSecond) {
    const sphere = createSphere(1, Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    spheres.push(sphere);
    lastBallTime += 1000 / ballsPerSecond; // Prevents drift in ball creation
  }
}

// Generate a performance report
function generateReport() {
  const endTime = performance.now();
  const totalDuration = (endTime - startTime) / 1000; //converts milliseconds to seconds
  const avgFrameRate = frameCount / (totalTime / 1000); //milliseconds to seconds and divides the total frame count by this duration to calculate the average FPS.

  const reportContent = `
    <h3>Simulation Report</h3>
    <p><strong>Test Duration:</strong> ${totalDuration.toFixed(2)} seconds</p>
    <p><strong>Total Spheres Added:</strong> ${spheres.length}</p>
    <p><strong>Average Frame Rate:</strong> ${avgFrameRate.toFixed(2)} FPS</p>
  `;

  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = reportContent;
}

// Resize handling
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Start simulation
function startSimulation() {
  ballsPerSecond = parseFloat(document.getElementById("ballsPerSecond").value) || 5;
  testDuration = parseFloat(document.getElementById("testDuration").value) * 1000 || 10000;
  spheres = [];
  frameCount = 0;
  totalTime = 0;
  lastTime = performance.now();
  startTime = performance.now();
  isTestRunning = true;

  animate();
}

function animate() {
  if (isTestRunning) {
    const elapsedTime = performance.now() - startTime;

    if (elapsedTime >= testDuration) {
      isTestRunning = false;
      generateReport();
      return;
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    monitorPerformance();
  }
}

// Event listeners for play and reset
document.getElementById("play").addEventListener("click", startSimulation);
// when reset is clicked clears all speahers  
document.getElementById("reset").addEventListener("click", () => {
  spheres.forEach(sphere => scene.remove(sphere));
  spheres = [];
  document.getElementById("report").innerHTML = "";
});