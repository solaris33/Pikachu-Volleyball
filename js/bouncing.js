$(function(){
  var ballTimer;
  var trajTimer;
  var jumpUp;
  var dt = 1;
  var maxX = 800;
  var maxY = 600;
  // var g = 5;
  var t = 0;
  var t_p = 0;

  var maxRadius = 80;
  var playerWidth = $("#p1").width();
  var playerHeight = $("#p1").height();
  var ballRadius = $("#pika").width();
  var playerPos = $("#p1").offset();
  var ballPos = $("#pika").offset();
  var radius = 0;
  var computeXY = {x:0,y:0};

  var pika = {
    x:0,
    y:100,
    Vx: -10,
    Vy:-5,
    stop: false,
    up : false, // traj
    exc : false, // traj
    x_0: 0, // traj: inital x
    y_0: 0, // traj: intial y
    V0: 100, // traj: inital velocity
    angle: 0,
    g : 5
  };

  $("#p1").offset({
    top: maxY - 100,
    left: 300
  });

  var p1 = {
    x_0 : $("#p1").offset().left,
    y_0 : $("#p1").offset().top,
    Vx : 0,
    Vy : -100,
    up : false, // traj
    exc : false, // traj
    g : 15,
    x : 0,
    y : 0
  };



  function rules(){
    var playerPos = $("#p1").offset();
    var ballPos = $("#pika").offset();

    if (pika.x <= 0 || pika.x >= maxX){
      pika.Vx = pika.Vx * -1;
    };
    if (pika.y <= 0 || pika.y >= maxY){
      pika.Vy = pika.Vy * -1;
    };

    if (hitRadius(maxRadius,playerPos,ballPos)){
      pika.Vx = pika.Vx * -1;
      pika.Vy = pika.Vy * -1;
    }

    // embed custom global event *if keydown (return)
    pika.x = pika.x + pika.Vx * dt;
    pika.y = pika.y + pika.Vy * dt;

    update(pika.x,pika.y);
  }

  function unifyPlayer(playerName){ //adjust the reference point
    var tmp = $("#" + playerName);

    if (playerName == "p1"){
      p1.y = tmp.offset().top + playerHeight * 0.5;
      p1.x = tmp.offset().left + playerWidth * 0.8;
    };
    if (playerName == "p2"){
      p2.y = tmp.offset().top + playerHeight * 0.5;
      p2.x = tmp.offset().left + playerWidth * 0.2;
    };
  }

  function hitRadius(rad,player,ball){
    // input : Max Allowable Radius, Player Offset(), Ball Offset()
    // check if player inside radius of ball hit
    unifyPlayer("p1");

    var x = p1.x;
    var y = p1.y;

    var ballx = ball.left + ballRadius * 0.5;
    var bally = ball.top  + ballRadius * 0.5;

    radius = Math.sqrt(Math.pow(ballx-x,2) + Math.pow(bally-y,2));

    if (radius <= rad){
      console.log("THEY TOUCH!!");
      computeXY.x = ballx - x;
      computeXY.y = bally - y;
      return true;
    }
  }

  function initTraj(posObject,x,y){
    posObject.angle = Math.atan(y / x);

    posObject.Vx = posObject.V0 * Math.cos(posObject.angle);
    posObject.Vy = posObject.V0 * Math.sin(posObject.angle);
    posObject.x_0 = posObject.x;
    posObject.y_0 = posObject.y;
    if (x<0 && y<0){ // ball at 4th qua of the player
      posObject.Vx = posObject.Vx * -1;
      posObject.Vy = posObject.Vy * -1;
    } else if(x<0 && y> 0) {
      posObject.Vx = posObject.Vx * -1;
      posObject.Vy = posObject.Vy * -1;
    };
  };

  function trajectory(){ // simulate ball trajectory motion
    t+=0.25;
    pika.x = pika.x_0 + pika.Vx * t;
    pika.y = pika.y_0 + pika.Vy * t + 0.5 * pika.g * t * t;
    update(pika.x,pika.y);

    if (checkGround(pika)){
      clearInterval(trajTimer);
    };
    if(checkBoundary(pika)){
      clearInterval(trajTimer);
      t = 0;
      pika.Vx = pika.Vx * 0.2;
      pika.Vy = pika.Vy * 0.2;
      setNewBounceTimer();
    }
  }

  function trajectoryPlayer(){ // simulate JUMP of player
    t_p+=0.25;
    p1.x = p1.x_0 + p1.Vx * t_p;
    p1.y = p1.y_0 + p1.Vy * t_p + 0.5 * p1.g * t_p * t_p;
    $("#p1").offset({
      left:p1.x,
      top:p1.y
    });

    if (p1.y > maxY-120){
      clearInterval(jumpUp);
      t_p = 0;
      p1.up=false;
    }
  }

  function checkGround(ballPos){
    return ballPos.y >= maxY ? true : false
  }

  function checkBoundary(ballPos){
    if (ballPos.x<= 0 || ballPos.x >= maxX){
      pika.Vx = pika.Vx * -1;
      return true;
    };
    if (ballPos.y <= 0 || ballPos.y >= maxY){
      pika.Vy = pika.Vy * -1;
      return true;
    }
  }

  function update(x,y){
    $("#pika").offset({
      top : y,
      left : x
    });
  }

  function rulesNew(){
    var playerPos = $("#p1").offset();
    var ballPos = $("#pika").offset();

    if (pika.x<=0){
        pika.Vx = pika.Vx * -1;
        pika.x += 5;
    }else if(pika.x >= maxX){
        pika.Vx = pika.Vx * -1;
        pika.x -=5;
    };
    if (pika.y <= 0){
        pika.Vy = pika.Vy * -1;
        pika.y +=5
    }else if(pika.y >= maxY){
        pika.Vy = pika.Vy * -1;
        pika.y = pika.y - 5;
    };

    if (hitRadius(maxRadius,playerPos,ballPos)){
      pika.Vx = pika.Vx * -1;
      pika.Vy = pika.Vy * -1;
    }

    // embed custom global event *if keydown (return)
    pika.x = pika.x + pika.Vx * dt;
    pika.y = pika.y + pika.Vy * dt;

    update(pika.x,pika.y);
  }


  function setBounceTimer(){
    ballTimer = setInterval(rules,10);
  }

  function setNewBounceTimer(){
    ballTimer = setInterval(rulesNew,10);
  }

  function setTrajTimer(){ // Start Interval of Trajectory
    trajTimer = setInterval(trajectory, 10);
  }

  function jumpEvent(){
    p1.x_0 = $("#p1").offset().left;
    p1.y_0 = $("#p1").offset().top;
    jumpUp = setInterval(trajectoryPlayer, 10);
  }


  setBounceTimer();

  $(document).keydown(function(e){
    //if return (keycode=13)
    if (e.which == 13 && pika.exc == false) {
        pika.exc = true;
      if(hitRadius(150,$("#p1").offset(),$("#pika").offset())){
        console.log("HIT by Return!!!");
        console.log("At: x=" + $("#pika").offset().left + " y=" + $("#pika").offset().top);
        clearInterval(ballTimer);

        initTraj(pika, computeXY.x, computeXY.y);

        setTrajTimer();
      }
      pika.exc = false;

      // if(pika.stop == false){
      //   console.log("X = " + pika.x + " Y = " + pika.y);
      //   clearInterval(ballTimer);
      //   pika.stop = true;

      //   playerPos = $("#p1").offset();
      //   ballPos = $("#pika").offset();

      //   hitRadius(maxRadius, playerPos,ballPos);
      // }else{
      //   pika.stop = false;
      //   setBounceTimer();
      // };
    };
    if (e.which == 37){
      $("#p1").offset({
        left: $("#p1").offset().left - 20
      })
    };

    if (e.which == 39){
      $("#p1").offset({
        left: $("#p1").offset().left + 20
      })
    }

    if (e.which == 32){
      clearInterval(ballTimer);
      clearInterval(trajTimer);

    };

    if (e.which == 38 && p1.up == false){ //  && p1.up == false
      p1.up = true;
      jumpEvent();
    };

  });

});