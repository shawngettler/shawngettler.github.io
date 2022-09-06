/**
 * Interactive figure of a perspective view mapped onto a rectangular lat/lon
 * projection. The viewport adjusts shape based on the view center.
 */
(() => {

    // svg element
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 536);
    svg.setAttribute("height", 272);

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/svg-figure.css";
    svg.appendChild(link);

    let script = document.currentScript;
    script.parentElement.insertBefore(svg, script);


    // grid
    let x0 = 268;
    let y0 = 136;

    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(grid);

    for(let i = -8; i <= 8; i++) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("points", (x0+i*32)+","+(y0-4*32)+" "+(x0+i*32)+","+(y0+4*32));
        line.classList.add(i == 0 ? "grid-major" : "grid-minor");
        grid.appendChild(line);
    }
    for(let i = -4; i <= 4; i++) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("points", (x0-8*32)+","+(y0+i*32)+" "+(x0+8*32)+","+(y0+i*32));
        line.classList.add(i == 0 ? "grid-major" : "grid-minor");
        grid.appendChild(line);
    }

    let lblvals = ["-\u03c0", "-\u03c0/2", "0", "\u03c0/2", "\u03c0"]
    for(let i = -2; i <= 2; i++) {
        let mask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        mask.setAttribute("x", x0+i*128-16);
        mask.setAttribute("y", y0+16-12);
        mask.setAttribute("width", 32);
        mask.setAttribute("height", 16);
        mask.classList.add("grid-label-mask");
        grid.appendChild(mask);
        let lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", x0+i*128);
        lbl.setAttribute("y", y0+16);
        lbl.classList.add("grid-label");
        lbl.classList.add("grid-label-horizontal-axis");
        lbl.textContent = lblvals[i+2];
        grid.appendChild(lbl);
    }
    for(let i = -1; i <= 1; i+=2) {
        let mask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        mask.setAttribute("x", x0-36);
        mask.setAttribute("y", y0+i*128-8);
        mask.setAttribute("width", 32);
        mask.setAttribute("height", 16);
        mask.classList.add("grid-label-mask");
        grid.appendChild(mask);
        let lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", x0-8);
        lbl.setAttribute("y", y0+i*128);
        lbl.classList.add("grid-label");
        lbl.classList.add("grid-label-vertical-axis");
        lbl.textContent = lblvals[2-i];
        grid.appendChild(lbl);
    }


    // viewport
    let vpbox = document.createElementNS("http://www.w3.org/2000/svg", "g");
    vpbox.setAttribute("id", "vpbox");
    svg.appendChild(vpbox);

    let vpboxl = document.createElementNS("http://www.w3.org/2000/svg", "use");
    vpboxl.setAttribute("href", "#vpbox");
    vpboxl.setAttribute("transform", "translate(-512,0)");
    svg.appendChild(vpboxl);
    let vpboxr = document.createElementNS("http://www.w3.org/2000/svg", "use");
    vpboxr.setAttribute("href", "#vpbox");
    vpboxr.setAttribute("transform", "translate(512,0)");
    svg.appendChild(vpboxr);

    let vpline = [];
    for(let i = 0; i < 10; i++) {
        vpline[i] = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        vpline[i].classList.add("polyline-1");
        vpbox.appendChild(vpline[i]);
    }

    function vpdraw(th0, ph0) {
        const vppos = (xn, yn, ph0, th0) => {
            let th = Math.atan(xn/(0.875*(Math.cos(ph0)-yn*Math.sin(ph0)))) + th0;
            let ph = Math.atan((Math.sin(ph0)+yn*Math.cos(ph0))/(Math.cos(ph0)-yn*Math.sin(ph0))/Math.sqrt(Math.pow(xn/(0.875*(Math.cos(ph0)-yn*Math.sin(ph0))), 2)+1));
            return { x: th, y: ph };
        };

        for(let i = 0; i < 5; i++) {
            let pts = "";
            for(let s = -32; s <= 32; s++) {
                let p = vppos(s/32, (i-2)/2, ph0, th0);
                pts += (x0-512*p.x/2/Math.PI)+","+(y0+512*p.y/2/Math.PI)+" ";
            }
            vpline[i].setAttribute("points", pts);
        }
        for(let i = 0; i < 5; i++) {
            let pts = "";
            for(let s = -16; s <= 16; s++) {
                let p = vppos((i-2)/2, s/16, ph0, th0);
                pts += (x0-512*p.x/2/Math.PI)+","+(y0+512*p.y/2/Math.PI)+" ";
            }
            vpline[i+5].setAttribute("points", pts);
        }
    }

    vpboxcp = {
        x: x0,
        y: y0,
        move: (e) => {
            vpboxcp.x = e.offsetX < x0-256 ? x0-256 : e.offsetX > x0+256 ? x0+256 : e.offsetX;
            vpboxcp.y = e.offsetY < y0-63 ? y0-63 : e.offsetY > y0+63 ? y0+63 : e.offsetY;
        },
        update: () => {
            let th0 = -(vpboxcp.x-x0)/512*2*Math.PI;
            let ph0 = (vpboxcp.y-y0)/512*2*Math.PI;
            vpdraw(th0, ph0);
        }
    }
    vpboxcp.update();


    // control points
    let cpactive = null;
    let cps = [ vpboxcp ];

    let controls = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(controls);

    for(let cp of cps) {
        let control = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        control.setAttribute("cx", cp.x);
        control.setAttribute("cy", cp.y);
        control.setAttribute("r", 8);
        control.classList.add("control");
        controls.appendChild(control);
        cp.control = control;

        control.addEventListener("mouseover", () => {
            control.classList.add("control-hover");
        });
        control.addEventListener("mouseout", () => {
            if(cpactive != cp) {
                control.classList.remove("control-hover");
            }
        });
        control.addEventListener("mousedown", (e) => {
            if(e.buttons == 1) {
                cpactive = cp;
            }
        });
    }

    svg.addEventListener("mouseup", () => {
        if(cpactive != null) {
            cpactive.control.classList.remove("control-hover");
        }
        cpactive = null;
    });
    svg.addEventListener("mousemove", (e) => {
        if(cpactive != null) {
            cpactive.move(e);
            cpactive.update();
            cpactive.control.setAttribute("cx", cpactive.x);
            cpactive.control.setAttribute("cy", cpactive.y);
        }
    });

})();
