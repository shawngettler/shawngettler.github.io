/**
 * Interactive sprite viewer. Loads spritesheets and lets the user walk around.
 */
(() => {

    // canvas element
    let cnv = document.createElement("canvas");
    cnv.width = 512;
    cnv.height = 448;

    let script = document.currentScript;
    script.parentElement.insertBefore(cnv, script);


    // controls
    let ink = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    let inp = new Array(ink.length).fill(false);
    window.addEventListener("keydown", (e) => {
        let k = ink.indexOf(e.key);
        if(k != -1) {
            inp[k] = true;
        }
    });
    window.addEventListener("keyup", (e) => {
        let k = ink.indexOf(e.key);
        if(k != -1) {
            inp[k] = false;
        }
    });


    // state
    let x = 0;
    let y = 0;
    let dir = 0;


    // animations
    let ani = null;
    let ans = {
        henry_idle: {
            png: "img/walk-animation-demo-idle.png",
            nfr: 1,
            cfr: 0,
            lfr: 1,
            tic: 0
        },
        henry_walk: {
            png: "img/walk-animation-demo-walk.png",
            nfr: 8,
            cfr: 0,
            lfr: 5,
            tic: 0
        }
    }

    Promise.all(Object.keys(ans).map(k =>
        fetch(ans[k].png)
        .then(r => r.blob())
        .then(b => new Promise(resolve => {
            let i = document.createElement("img");
            i.src = URL.createObjectURL(b);
            i.addEventListener("load", () => {
                ans[k].img = i;
                resolve();
            });
        }))
    ))
    .then(() => {
        init();
        run();
    });


    // init
    function init() {
        x = 0;
        y = 0;
        dir = 0;

        ani = ans.henry_idle;
    }


    // loop
    let ctx = cnv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    function run() {

        // input
        let dx = 0;
        let dy = 0;
        dy += inp[0] ? -18 : 0;
        dy += inp[1] ? 18 : 0;
        dx += inp[2] ? -24 : 0;
        dx += inp[3] ? 24 : 0;
        x += dy != 0 ? dx*0.75 : dx;
        y += dx != 0 ? dy*0.75 : dy;

        // animation
        if(dx != 0 || dy != 0) {
            ani = ans.henry_walk;
            dir = Math.round((Math.atan2(-dy, dx)/(2*Math.PI)*8 + 10) % 8);
        } else {
            ani = ans.henry_idle;
        }

        if(ani.tic == 0) {
            ani.cfr = (ani.cfr + 1) % ani.nfr;
            ani.tic = ani.lfr;
        }
        ani.tic--;

        let spr = {
            img: ani.img,
            x: dir < 5 ? dir*16 : 128 - dir*16,
            y: ani.cfr*24,
            w: 16,
            h: 24,
            s: dir < 5 ? 1 : -1
        };

        // draw
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        let gx = (x >> 4) % 64;
        let gy = (y >> 4) % 48;
        ctx.scale(2, 2);
        for(let j = 0; j < 7; j++) {
            for(let i = 0; i < 6; i++) {
                ctx.fillStyle = "#666";
                ctx.fillRect(-64-gx+i*64, -48-gy+j*48, 32, 24);
                ctx.fillRect(-64-gx+i*64+32, -48-gy+j*48+24, 32, 24);
                ctx.fillStyle = "#777";
                ctx.fillRect(-64-gx+i*64+32, -48-gy+j*48, 32, 24);
                ctx.fillRect(-64-gx+i*64, -48-gy+j*48+24, 32, 24);
            }
        }
        ctx.resetTransform();

        ctx.translate(240, 200);
        ctx.scale(2*spr.s, 2);
        ctx.drawImage(spr.img, spr.x, spr.y, spr.w, spr.h, 0, 0, spr.w*spr.s, spr.h);
        ctx.resetTransform();

        window.requestAnimationFrame(run);
    }


})();
