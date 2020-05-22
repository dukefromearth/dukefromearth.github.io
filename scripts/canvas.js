
function DeviceInfo() {
  const _w = window;
  const _s = window.screen;
  const _b = document.body;
  const _d = document.documentElement;

  return {
    screenWidth() {
      return Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0);
    },
    screenHeight() {
      return Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0);
    },
    screenRatio() {
      return this.screenWidth() / this.screenHeight();
    },
    screenCenterX() {
      return this.screenWidth() / 2;
    },
    screenCenterY() {
      return this.screenHeight() / 2;
    },
    mouseX(e) {
      return Math.max(0, e.pageX || e.clientX || 0);
    },
    mouseY(e) {
      return Math.max(0, e.pageY || e.clientY || 0);
    },
    mouseCenterX(e) {
      return this.mouseX(e) - this.screenCenterX();
    },
    mouseCenterY(e) {
      return this.mouseY(e) - this.screenCenterY();
    },
  };
};

let deviceInfo = DeviceInfo();

function mindRunner() {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Svg = Matter.Svg,
    Common = Matter.Common,
    Vertices = Matter.Vertices,
    counter = 0,
    render, runner, world, engine, mouse, mouseConstraint, head, pulley1, pulley2;

  function createEngine() {
    engine = Engine.create();
    engine.constraintIterations = 1;
    world = engine.world;
  }

  function createRenderer() {
    // create renderer
    render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: Math.max(300, deviceInfo.screenWidth() - 20),
        height: deviceInfo.screenHeight() - 20,
        hasBounds: true,
        wireframeBackground: '#222',
        enabled: true,
        wireframes: false,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
      }
    });
    Render.setPixelRatio(render, 2)
    Render.run(render);
  }

  function createRunner() {
    runner = Runner.create();
    Runner.run(runner, engine);
    render.options.wireframeBackground = 'transparent';
    render.options.background = '#fff';
    let container = document.getElementById('pt');
    container.appendChild(render.canvas);
  }

  function addMouseControl() {
    mouse = Mouse.create(render.canvas)
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true
        }
      }
    });
    World.add(world, mouseConstraint);
  }

  function createChain(quantity, width, height, globalX, globalY, color, isInfinite) {
    let group = Body.nextGroup(true);
    let chain;
    let boxes = [];
    let stiffness = 0.8;
    let w = width;
    let h = height;

    for (let i = 0; i < quantity; i++) {
      let x = globalX;
      let y = globalY - i * height;
      boxes.push(Bodies.rectangle(x, y, w, h,
        {
          render: {
            fillStyle: color,
            sprite: {
              texture: 'img/headbang/bookedge/bookedge-2.png',
              xScale: 0.25,
              yScale: 0.25,
              xOffset: (i % 2 == 0) ? Math.random() * 0.2 : Math.random() * -0.2
            }
          },
          isStatic: true
        }));
    }

    chain = Composite.create({ bodies: boxes });

    Composites.chain(chain, 0, -0.5, 0, 0.5, {
      stiffness: stiffness,
      length: 0,
      render: {
        visible: false,
        type: 'line',
        strokeStyle: 'red',
        lineWidth: 4
      }
    });

    return chain;
  }

  function createInfinteChain(quantity, globalX, globalY, radius, color) {
    globalX -= 150;
    let group = Body.nextGroup(true);
    let ang = 0;
    let chain;
    let boxes = [];
    let stiffness = 0.3;
    let scale = globalX / globalY;
    let w = 5;
    let h = 50;

    for (let i = 0; i < quantity; i++) {
      let x = Math.cos(ang) * radius + globalX;
      let y = Math.sin(ang) * radius / 3 + globalY;//Math.sin(ang) * radius + globalY;
      boxes.push(Bodies.rectangle(x, y, w, h, {
        collisionFilter: { group: group },
        render: {
          fillStyle: 'black'
        }
      })); // 
      ang += 2 * Math.PI / quantity;
    }

    chain = Composite.create({ bodies: boxes });

    Composites.chain(chain, 0.5, -0.5, 0.5, 0.5, {
      stiffness: stiffness,
      length: 0,
      render: {
        type: 'line',
        strokeStyle: 'black',
        lineWidth: 4
      }
    });

    Composite.add(chain, Constraint.create({
      bodyA: chain.bodies[chain.bodies.length - 1],
      bodyB: chain.bodies[0],
      pointA: { x: w / 2, y: -(h / 2) },
      pointB: { x: w / 2, y: h / 2 },
      stiffness: stiffness,
      length: 0,
      render: {
        type: 'line',
        strokeStyle: 'black',
        lineWidth: 4
      }
    }));

    return chain;
  }

  function createPulley() {
    let maxDistance = Math.min(600, deviceInfo.screenWidth());
    let r = Math.max(50, maxDistance / 10);
    let p1Pos = { x: deviceInfo.screenCenterX() - maxDistance / 2 + r / 2, y: r * 1.5 };
    let p2Pos = { x: deviceInfo.screenCenterX() + maxDistance / 2 - r / 2, y: r * 1.5 }
    let pulleys = [];
    pulley1 = Bodies.polygon(p1Pos.x, p1Pos.y, 10, r, {
      friction: 10,
      render: { sprite: { texture: "img/headbang/gear.png", xScale: r * 2 / 500, yScale: r * 2 / 500 } }
    });
    pulley2 = Bodies.polygon(p2Pos.x, p2Pos.y, 10, r, {
      friction: 10,
      render: { sprite: { texture: "img/headbang/gear.png", xScale: r * 2 / 500, yScale: r * 2 / 500 } }
    });

    pulleys.push(pulley1, pulley2);
    let pulleySystem = Composite.create({ bodies: pulleys });

    Composite.add(pulleySystem, Constraint.create({
      bodyA: pulleySystem.bodies[0],
      pointB: { x: p1Pos.x, y: p1Pos.y },
      render: { visible: false }
    }))

    Composite.add(pulleySystem, Constraint.create({
      bodyA: pulleySystem.bodies[1],
      pointB: { x: p2Pos.x, y: p2Pos.y },
      render: { visible: false }
    }))
    let dist = Math.sqrt(Math.pow(p1Pos.x - p2Pos.x, 2) + Math.pow(p1Pos.y - p2Pos.y, 2)) + r;

    World.add(world, pulleySystem);

    return createInfinteChain(dist / 30, (p1Pos.x + p2Pos.x) / 2, (p1Pos.y + p2Pos.y) / 2, maxDistance - r * 4, 'blue');
  }

  function addHead(x, y, neck) {
    let components = [];
    var headComponents;

    head = Bodies.rectangle(x, y, 150, 150, {
      render: {
        sprite: {
          texture: 'img/headbang/profile_silhouette.png',
          xScale: 1.5,
          yScale: 1.5
        }
      },
      mass: 10
    })

    components.push(head);

    headComponents = Composite.create({ bodies: components });

    Composite.add(headComponents, Constraint.create({
      bodyA: headComponents.bodies[0],
      bodyB: neck.bodies[neck.bodies.length - 1],
      pointA: { x: 30, y: 70 },
      pointB: { x: 0, y: - 10 },
      render: {
        visible: false
      }
    }))
    World.add(world, headComponents);
  }

  function addFloor() {
    let floor = Bodies.rectangle(deviceInfo.screenCenterX(), deviceInfo.screenHeight() - deviceInfo.screenHeight() / 20, deviceInfo.screenWidth(), deviceInfo.screenHeight() / 20, {
      isStatic: true,
      render: {
        visible: false
      }
    });
    World.add(world, floor);
  }

  function addLightbulb() {
    let lightbulb = Bodies.circle(deviceInfo.screenWidth() / 2 + 150, deviceInfo.screenHeight() - 250, 25, {
      render: {
        sprite: {
          texture: 'img/headbang/lightbulb.png',
          xScale: 1,
          yScale: 1
        }
      },
      mass: 4
    });

    lightbulb.force.y = -0.18;
    lightbulb.force.x = Math.random() * 0.02 + 0.01;
    lightbulb.angle = (Math.random() * 0.6)
    World.add(world, [lightbulb])
  }

  function getFist(x, y, group) {
    let fist = Bodies.rectangle(x, y, 50, 50, {
      render: {
        sprite: {
          texture: 'img/headbang/hand.png',
          xScale: .75,
          yScale: .75
        },
      },
      mass: 10,
      collisionFilter: { group: group }
    });
    return Composite.create({ bodies: [fist] });
  }

  function getComputer(x, y) {
    let computer = Bodies.rectangle(x, y, 50, 300, {
      render: {
        sprite: {
          texture: 'img/headbang/computer.png',
          xScale: .75,
          yScale: .75
        }
      },
      isStatic: true
    });
    return [computer]//Composite.create({ bodies: [computer] });
  }

  function setup() {
    createEngine();
    createRenderer();
    createRunner();
    addMouseControl();
    addFloor();

    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouse.element.addEventListener("mousedown", addLightbulb);
    mouse.element.addEventListener("touchstart", addLightbulb);

    // Create Neck
    let w = 100;
    let h = 15;
    let quantity = 3;
    let x = deviceInfo.screenWidth() / 2 + 150;
    let y = deviceInfo.screenHeight() - 2 * deviceInfo.screenHeight() / 20 + 15;
    let neck = createChain(quantity, w, h, x, y, 'blue');

    Composite.add(neck, Constraint.create({
      bodyA: neck.bodies[0],
      pointB: { x: x, y: y },
      render: {
        visible: false
      }

    }))

    let group = Body.nextGroup(true);
    let lHand = getFist(x - 150, y - 50, group);
    let rHand = getFist(x - 150, y - 50, group);

    Composite.add(lHand, Constraint.create({
      bodyA: lHand.bodies[0],
      pointB: { x: x, y: y },
      render: {
        visible: false
      }
    }))

    Composite.add(rHand, Constraint.create({
      bodyA: rHand.bodies[0],
      pointB: { x: x, y: y },
      render: {
        visible: false
      }
    }))

    addHead(x - 30, y - 110, neck);

    let computer = getComputer(x - 275, y - 80);


    World.add(world, computer);
    World.add(world, [lHand, rHand]);
    World.add(world, neck);


    let pulley;
    setTimeout(function () {
      pulley = createPulley();
      World.add(world, pulley);
      Events.on(engine, 'beforeUpdate', function (event) {
        let lH = lHand.bodies[0];
        lH.force.y = - Math.sin(counter / 3) / 20;
        lH.angle = Math.PI + Math.atan2(lH.position.y - y, lH.position.x - x);
        let rH = rHand.bodies[0];
        rH.force.y = + Math.sin(counter / 2) / 20;
        rH.angle = Math.PI + Math.atan2(lH.position.y - y, lH.position.x - x);

        if (pulley) {
          pulley1.angle += 0.0005;
          pulley2.angle += 0.0005;
        }

        if (counter % 200 === 0) {
          addLightbulb();
        }

        counter++;
      });
    }, 1000);




  }

  setup();

  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: deviceInfo.screenWidth(), y: deviceInfo.screenHeight() }
  });

  // return context if needed
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };
}

let runner = mindRunner();

// Resize only when width is changed, but not height.
$(window).resize(function () {

  if (Math.abs(runner.canvas.width / 2 - deviceInfo.screenWidth()) > 30 && runner) {
    runner.stop();
    $('canvas').remove();
    runner = mindRunner();
  }
});
