/**
 * Interactive figure of a vector being projected onto a plane perpendicular to
 * the z axis.
 */
(() => {

    // svg element
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 400);
    svg.setAttribute("height", 272);

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/svg-figure.css";
    svg.appendChild(link);

    let script = document.currentScript;
    script.parentElement.insertBefore(svg, script);


    // grid
    let x0 = 72;
    let y0 = 136;

    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(grid);

    let xline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    xline.setAttribute("points", (x0-64)+","+y0+" "+(x0+320)+","+y0);
    xline.classList.add("grid-major");
    grid.appendChild(xline);

    let xmask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    xmask.setAttribute("x", x0-64-16);
    xmask.setAttribute("y", y0+16-12);
    xmask.setAttribute("width", 32);
    xmask.setAttribute("height", 16);
    xmask.classList.add("grid-label-mask");
    grid.appendChild(xmask);

    let xlbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xlbl.setAttribute("x", x0-64);
    xlbl.setAttribute("y", y0+16);
    xlbl.classList.add("grid-label");
    xlbl.classList.add("grid-label-horizontal-axis");
    xlbl.textContent = "+z";
    grid.appendChild(xlbl);

    let yline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    yline.setAttribute("points", x0+","+(y0-128)+" "+x0+","+(y0+128));
    yline.classList.add("grid-major");
    grid.appendChild(yline);

    let ymask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    ymask.setAttribute("x", x0-36);
    ymask.setAttribute("y", y0-128-8);
    ymask.setAttribute("width", 32);
    ymask.setAttribute("height", 16);
    ymask.classList.add("grid-label-mask");
    grid.appendChild(ymask);

    let ylbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    ylbl.setAttribute("x", x0-8);
    ylbl.setAttribute("y", y0-128);
    ylbl.classList.add("grid-label");
    ylbl.classList.add("grid-label-vertical-axis");
    ylbl.textContent = "+y";
    grid.appendChild(ylbl);


    // arc and plane
    let planegr = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    planegr.setAttribute("points", (x0+128*Math.cos(Math.PI/8))+","+(y0-128)+" "+(x0+128*Math.cos(Math.PI/8))+","+(y0+128));
    planegr.classList.add("grid-minor");
    grid.appendChild(planegr);

    let plane = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    plane.setAttribute("points", (x0+128*Math.cos(Math.PI/8))+","+(y0-128*Math.sin(Math.PI/8))+" "+(x0+128*Math.cos(Math.PI/8))+","+(y0+128*Math.sin(Math.PI/8)));
    plane.classList.add("polyline-1");
    grid.appendChild(plane);

    let nmask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nmask.setAttribute("x", (x0+128*Math.cos(Math.PI/8))-16);
    nmask.setAttribute("y", y0+16-12);
    nmask.setAttribute("width", 32);
    nmask.setAttribute("height", 16);
    nmask.classList.add("grid-label-mask");
    grid.appendChild(nmask);

    let nlbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    nlbl.setAttribute("x", (x0+128*Math.cos(Math.PI/8)));
    nlbl.setAttribute("y", y0+16);
    nlbl.classList.add("grid-label");
    nlbl.classList.add("grid-label-horizontal-axis");
    nlbl.textContent = "-N";
    grid.appendChild(nlbl);

    let arc = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    let arcpts = "";
    for(let i = -16; i < 17; i++) {
        arcpts += (x0+256*Math.cos(i/16*Math.PI/6))+","+(y0+256*Math.sin(i/16*Math.PI/6))+" ";
    }
    arc.setAttribute("points", arcpts);
    arc.classList.add("polyline-2");
    grid.appendChild(arc);

    let lblvals = ["+H/2", "-H/2"]
    for(let i = -1; i <= 1; i+=2) {
        let mask = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        mask.setAttribute("x", (x0+128*Math.cos(Math.PI/8))-36);
        mask.setAttribute("y", (y0+i*128*Math.sin(Math.PI/8))-8);
        mask.setAttribute("width", 32);
        mask.setAttribute("height", 16);
        mask.classList.add("grid-label-mask");
        grid.appendChild(mask);
        let lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", (x0+128*Math.cos(Math.PI/8))-8);
        lbl.setAttribute("y", (y0+i*128*Math.sin(Math.PI/8)));
        lbl.classList.add("grid-label");
        lbl.classList.add("grid-label-vertical-axis");
        lbl.textContent = lblvals[(i+1)>>1];
        grid.appendChild(lbl);
    }


    // view vector
    let viewvec = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(viewvec);

    let viewline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    viewline.classList.add("polyline-1");
    viewline.classList.add("polyline-dash");
    viewvec.appendChild(viewline);

    let viewht = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    viewht.classList.add("polyline-1");
    viewht.classList.add("polyline-dash");
    viewvec.appendChild(viewht);

    let viewint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    viewint.setAttribute("r", 4);
    viewint.classList.add("polygon-1");
    viewvec.appendChild(viewint);

    function viewdraw(th) {
        viewline.setAttribute("points", x0+","+y0+" "+(x0+256*Math.cos(th))+","+(y0-256*Math.sin(th)));
        viewht.setAttribute("points", (x0+256*Math.cos(th))+","+y0+" "+(x0+256*Math.cos(th))+","+(y0-256*Math.sin(th)));
        viewint.setAttribute("cx", x0+128*Math.cos(Math.PI/8));
        viewint.setAttribute("cy", y0-128*Math.cos(Math.PI/8)*Math.tan(th));
    }

    let vvcp = {
        x: x0+256,
        y: y0,
        move: (e) => {
            let th = Math.atan2(-(e.offsetY - y0), e.offsetX - x0);
            th = th < -Math.PI/8 ? -Math.PI/8 : th > Math.PI/8 ? Math.PI/8 : th;
            vvcp.x = x0 + 256*Math.cos(th);
            vvcp.y = y0 - 256*Math.sin(th);
        },
        update: () => {
            let th = Math.atan2(-(vvcp.y - y0), vvcp.x - x0);
            viewdraw(th);
        }
    }
    vvcp.update();


    // control points
    let cpactive = null;
    let cps = [ vvcp ];

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
