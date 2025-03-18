var cvs=document.querySelector("#mycanvas");
var ctx = cvs.getContext("2d");
var frames = 0;
var DEGREE = Math.PI /180;
var sprite =new Image();
sprite.src ="img/sprite.png";
var SCORE = new  Audio();
SCORE.src = "audio/score.wav";
var DIE = new  Audio();
DIE.src = "audio/die.wav";


var FLAP = new  Audio();
FLAP.src = "audio/flap.wav";


var HIT = new  Audio();
HIT.src = "audio/hit.wav";


var START = new  Audio();
START.src = "audio/start.wav";







var state = {
    current :0,
    getReady :0,
    game : 1,
    gameOver : 2
}
function clickHandler(){
   switch(state.current){
    case state.getReady :
        START.play();
        state.current  =state.game;
        break;
        case state.game :
        FLAP.play();   
        birds.flap();
           
            break;    
            default : 
            state.current = state.getReady;
            birds.speed = 0;
           birds. rotation = 0;
           pipes.position = [];
           score.value = 0;

            break;

   }
}
document.addEventListener("click", clickHandler)
document.addEventListener("keydown", function(e){
    if(e.which == 32){
        clickHandler();
    }
})

var bg ={
    sx :0,
    sy :0,
    width :275,
    height :300,
    x : 0,
    y: cvs.height -300,
    draw :function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x,this.y,this.width,this.height)
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x + this.width,this.y,this.width,this.height)
    }
}
var fg ={
    sx :276,
    sy :0,
    width :224,
    height :112,
    x : 0,
    dx : 2,
    y: cvs.height -112,
    draw :function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x,this.y,this.width,this.height)
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x + this.width,this.y,this.width,this.height)
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x + this.width +this.width,this.y,this.width,this.height)
    },
    update :function(){
if(state.current == state.game){
    this.x = (this.x -this.dx) % (this.width/2)
}
    }
}
var score = {
 best : parseInt(localStorage.getItem("best") )|| 0 ,
 value : 0,
 draw :function(){
    ctx.fillStyle = "#FFF"
    ctx.strokeStyle = "#000"
    if(state.current == state.game){
        ctx.lineWidth = 2;
        ctx.font = "35px IMPACT";
        ctx.fillText(this.value ,cvs.width/2,50)
        ctx.strokeText(this.value ,cvs.width/2,50)
    }else if(state.current == state.gameOver){
      ctx.font ="25px IMPACT"
      ctx.fillText(this.value ,315,245)
      ctx.strokeText(this.value ,315,245)
      ctx.fillText(this.best ,315,290)
      ctx.strokeText(this.best ,315,290)
    }
 }
}
var pipes = {
    top : {
        sx :553,
        sy : 0,
    },
    buttom :{
        sx :502,
        sy : 0,
    },
    width :53,
    height : 400,
    dx : 2,
    gap : 100,
    maxYpos : -150,
    position : [

    ],
    draw :function(){
    for(var i = 0; i<this.position.length;i++){
        var p = this.position[i]
        var topYp = p.y;
        var botyp = p.y + this.height + this.gap; 
        ctx.drawImage(sprite,this.top.sx,this.top.sy,this.width,this.height,p.x,topYp,this.width,this.height)
        ctx.drawImage(sprite,this.buttom.sx,this.buttom.sy,this.width,this.height,p.x,botyp,this.width,this.height)

    }
    },
    update : function(){
if (state.current != state.game) return;
if (frames % 100 ==0){
this.position.push({
    x :cvs.width ,
    y: this.maxYpos * (Math.random() + 1)
    
})
}
for(var i = 0 ; i < this.position.length;i++){
var p =this.position[i]
p.x -= this.dx 
var botyp = p.y + this.height + this.gap; 
if(birds.x + birds.raduis > p.x && birds.x - birds.raduis < p.x + this.width && birds.y + birds.raduis >p.y && 
    birds.y - birds.raduis < p.y + this.height){
        HIT.play();


        state.current = state.gameOver
    }
 if(birds.x + birds.raduis > p.x && birds.x - birds.raduis < p.x + this.width && birds.y + birds.raduis >botyp && 
    birds.y - birds.raduis < botyp + this.height){
        HIT.play();

        state.current = state.gameOver
        }

if(p.x  + this.width <= 0 ){
    this.position.shift( )
    SCORE.play();
    score.value += 1;
    score.best = Math.max(score.value , score.best);
    localStorage.setItem("best", score.best);
}
}
    }

}
var birds ={
    animation: [
 {sx :276,
    sy :112},
 {sx :276,
    sy :139},
 {sx :276,
    sy :164},
    {sx :276,
        sy :139},
    ],
    width :34,
    height :26,
    x : 50,
    y: 150,
    animationIndex :0,
    speed :0,
    gravity :0.25,
    jump : 4.6,
    raduis  : 12,
    
    rotation : 0,
    draw :function(){
        var birds = this.animation[this.animationIndex]
        ctx.save()
        ctx.translate(this.x,this.y)
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,birds.sx,birds.sy,this.width,this.height,-this.width/2,-this.height/2,this.width,this.height)
        ctx.restore()
       
    },
   
    update :function(){
        var period = state.current == state .getReady ? 30 :5;
this.animationIndex += frames % period == 0 ? 1 : 0
this.animationIndex  = this.animationIndex % 4 
  if (state.current == state.getReady) {
    this.y = 150;
  }else{
    this.speed +=this.gravity
    this.y += this.speed 
    if (this.speed < this.jump) {
        this.rotation = -25 *DEGREE
    }else{
        this.rotation = 90*DEGREE

    }
  }
  if(this.y + this.height / 2 >= cvs.height - fg.height){
    this.y = cvs.height - fg.height - this.height /2
    this.animationIndex = 1;
    if(state.current == state.game){
        DIE.play();
      state.current =  state.gameOver
      console.log("y")
    }
  }
  
  
},
flap :function(){
    this.speed = -this.jump
   }
}

var getReady ={
    sx :0,
    sy :228,
    width :173,
    height :152,
    x : cvs.width/2 - 173/2,
    y: 200,
    draw :function(){
       if (state.current ==state.getReady) {
        ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x,this.y,this.width,this.height)
       }
       
    }
}
var over ={
    sx :175,
    sy :228,
    width :225 ,
    height :202,
    x : cvs.width/2 - 225/2,
    y: 150,
    draw :function(){
        if (state.current ==state.gameOver) {
            ctx.drawImage(sprite,this.sx,this.sy,this.width,this.height,this.x,this.y,this.width,this.height) 
        }
        
       
    }
}
function draw (){
    
ctx.fillStyle = "black"
ctx.fillRect(0,0,cvs.width,cvs.height)
bg.draw()
pipes.draw()
fg.draw()
birds.draw()
getReady.draw()
over.draw()
score.draw()
}

function update(){
birds.update()
fg.update()
pipes.update()
}
function animate(){
    update();
    draw();
    frames ++;
    
    
    requestAnimationFrame(animate)
}
animate();