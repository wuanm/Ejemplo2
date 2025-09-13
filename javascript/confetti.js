

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
const explosionSound = document.getElementById('explosionSound');
const iniciaCelebracion = document.getElementById('startButton');
const mañanitas = document.getElementById('mañanitas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationStarted=false;
let rocketInterval;

//variables para felicidades
let showMessage = false;
let messageOpacity = 0;
let fadingIn = true;
let messageTimer = 0;
const MESSAGE_DURATION = 200; // duración de aparición (frames)



const confettiParticles = [];
const rockets = [];

const colors = [
  '#ff0a54', '#ff477e', '#ff7096',
  '#ff85a1', '#fbb1bd', '#f9bec7',
  '#ffffff', '#ffe066', '#2ec4b6'
];




// === PARTICULA DE CONFETI ===
function ConfettiParticle(x, y, angle, speed) {
  this.x = x;
  this.y = y;
  this.width = Math.random() * 2 + 2;    // Ancho: fino
  this.height = Math.random() * 6 + 4;   // Alto: más corto
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.gravity = 0.05 + Math.random() * 0.1;
  this.angle = angle;
  this.speed = speed;
  this.opacity = 1;
  this.rotation = Math.random() * 360;
  this.rotationSpeed = (Math.random() - 0.5) * 10;

  this.update = function () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.005;
  };

  this.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  };
}

// === COHETE (ROCKET) ===
function Rocket(x) {
  this.x = x;
  this.y = canvas.height;
  this.speed = 5 + Math.random() * 2;
  this.targetY = 100 + Math.random() * 50; // Altura de explosión

  this.update = function () {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      // Cuando alcanza la altura, explota
      explodeConfetti(this.x, this.y);
      return true; // Marcar para eliminar
    }
    return false;
  };

  this.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = '#ffffff'; // Color brillante
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x - 2, this.y, 4, 15); // Rectángulo fino y largo
    ctx.restore();
  };
}



// === EXPLOSIÓN DE CONFETI ===
function explodeConfetti(x, y) {
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 8 + 2;
    confettiParticles.push(new ConfettiParticle(x, y, angle, speed));
  }

  // Si tienes sonido:
  // Reproducir desde el principio si se dispara varias veces
  explosionSound.currentTime = 0;

  

    // Reproducir el sonido
  explosionSound.play().catch(err => {
    console.warn("El navegador bloqueó el audio. Esperando interacción del usuario.");
  });

  // Mostrar texto de "Felicidades"
  showMessage = true;



}




// === LANZAR NUEVO COHETE ===
function launchRocket() {
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1; // No tan pegado a los bordes
  rockets.push(new Rocket(x));
}

// === BUCLE DE ANIMACIÓN ===
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Mostrar mensaje de "¡Felicidades!"
if (showMessage) {
  if (fadingIn) {
    messageOpacity += 0.02;
    if (messageOpacity >= 1) {
      fadingIn = false;
      messageTimer = MESSAGE_DURATION;
    }
  } else {
    if (messageTimer > 0) {
      messageTimer--;
    } else {
      messageOpacity -= 0.02;
      if (messageOpacity <= 0) {
        showMessage = false;
        messageOpacity = 0;
        fadingIn = true;
      }
    }
  }

  ctx.save();
  ctx.globalAlpha = messageOpacity;
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 20;
  ctx.fillText('¡Felicidades LILIANA!', canvas.width / 2, canvas.height / 2);
  ctx.restore();
}


  // Actualizar y dibujar cohetes
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    const exploded = r.update();
    r.draw(ctx);
    if (exploded) rockets.splice(i, 1); // Eliminar después de explotar
  }

  // Actualizar y dibujar confeti
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.update();
    p.draw(ctx);
    if (p.opacity <= 0) confettiParticles.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

// === INICIAR CICLO DE LANZAMIENTO CADA 2 SEGUNDOS ===
setInterval(launchRocket, 2000);



// Iniciar animación
animate();
