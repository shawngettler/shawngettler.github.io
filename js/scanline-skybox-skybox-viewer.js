/**
 * Interactive skybox viewer. Loads a panorama and lets the user look around.
 */
(() => {

    // canvas element
    let cnv = document.createElement("canvas");
    cnv.width = 512;
    cnv.height = 448;

    let script = document.currentScript;
    script.parentElement.insertBefore(cnv, script);


    // interface
    let ex = 0;
    let ey = 0;
    cnv.addEventListener("mousemove", (e) => {
        if(e.buttons == 1) {
            ex += Math.floor(e.movementX);
            ey += Math.floor(e.movementY);
            ey = ey > 127 ? 127 : ey < -127 ? -127 : ey;
            draw();
        }
    });

    let scr = document.createElement("canvas");
    scr.width = 256;
    scr.height = 224;

    let img = document.createElement("canvas");
    img.width = 1024;
    img.height = 1024;

    let scrdata, imgdata;
    function init() {
        scrdata = scr.getContext("2d").createImageData(scr.width, scr.height);
        imgdata = img.getContext("2d").getImageData(0, 0, img.width, img.height);
    }

    let ctx = cnv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    function draw() {
        let ox = -ex;
        let oy = -ey;
        let cx = ox - 128;
        let cy = 128;
        for(let sy = 0; sy < 224; sy++) {
            let a = 0.875*(Math.cos(-oy/1024*(2*Math.PI)) - (1-sy/112)*Math.sin(-oy/1024*(2*Math.PI)));
            let b = 0.875*(Math.sin(-oy/1024*(2*Math.PI)) + (1-sy/112)*Math.cos(-oy/1024*(2*Math.PI)));
            let k1 = 1/(2*Math.PI) * ((1+a*a)*Math.atan(1/a) - a);
            let k2 = 1/(2*Math.PI) * (-2*Math.sqrt(b*b+a*a)*Math.atanh(b/Math.sqrt(b*b+a*a)/Math.sqrt(a*a+1)) + 2*Math.atan(b/Math.sqrt(a*a+1)) + 2*b*Math.asinh(1/a));

            let ma = Math.floor(3/256*1024*k1 * 256);
            let md = Math.floor((-1/2*1024*k2 - oy)/(sy + cy - oy) * 256);

            for(let sx = 0; sx < 256; sx++) {
                let bx = (ma*(sx+cx-ox) >> 8) + ox;
                let by = (md*(sy+cy-oy) >> 8) + oy;

                let px = ((by & 0x03ff) << 10) | (bx & 0x03ff);
                scrdata.data[(sy*256+sx)*4+0] = imgdata.data[px*4+0];
                scrdata.data[(sy*256+sx)*4+1] = imgdata.data[px*4+1];
                scrdata.data[(sy*256+sx)*4+2] = imgdata.data[px*4+2];
                scrdata.data[(sy*256+sx)*4+3] = imgdata.data[px*4+3];
            }
        }
        scr.getContext("2d").putImageData(scrdata, 0, 0);

        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.scale(2, 2);
        ctx.drawImage(scr, 0, 0);
        ctx.resetTransform();
    }


    // image
    function load() {
        fetch("/img/scanline-skybox-background.png")
        .then(r => r.blob())
        .then(b => new Promise(resolve => {
            let i = document.createElement("img");
            i.src = URL.createObjectURL(b);
            i.addEventListener("load", () => {
                img.getContext("2d").drawImage(i, 0, 0);
                resolve();
            });
        }))
        .then(() => {
            init();
            draw();
        });
    }
    load();

})();
