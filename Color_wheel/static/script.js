const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const centerX = width / 2;
const centerY = height / 2;

const radius = 380;

// --- DOM Elements ---

const tooltip = document.getElementById("color-tooltip");
const tooltipSwatch = tooltip.querySelector(".swatch");
const tooltipHex = tooltip.querySelector(".hex-text");

const preview = document.getElementById("preview");

const valName = document.getElementById("val-name");
const valHex = document.getElementById("val-hex");
const valRgb = document.getElementById("val-rgb");
const valHsl = document.getElementById("val-hsl");
const valHsv = document.getElementById("val-hsv");
const valXyz = document.getElementById("val-xyz");

const saturationSlider = document.getElementById("saturation-slider");
const saturationValue = document.getElementById("saturation-value");

const paletteTooltip = document.getElementById("palette-tooltip");

// Palette containers

const paletteContainers = {
    complementary: document.getElementById("palette-complementary"),
    analogous: document.getElementById("palette-analogous"),
    triadic: document.getElementById("palette-triadic"),
    tetradic: document.getElementById("palette-tetradic"),
    monochromatic: document.getElementById("palette-monochromatic")
};

// Last states

let lastMouseX = null;
let lastMouseY = null;

let lastHsl = [0, 0, 50];

let currentPalettes = {};


// --- Color Conversions ---

function hsvToRgb(h, s, v){

    let r, g, b;

    const i = Math.floor(h * 6);

    const f = h * 6 - i;

    const p = v * (1 - s);

    const q = v * (1 - f * s);

    const t = v * (1 - (1 - f) * s);

    switch(i % 6){

        case 0:
            r = v; g = t; b = p;
            break;

        case 1:
            r = q; g = v; b = p;
            break;

        case 2:
            r = p; g = v; b = t;
            break;

        case 3:
            r = p; g = q; b = v;
            break;

        case 4:
            r = t; g = p; b = v;
            break;

        case 5:
            r = v; g = p; b = q;
            break;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}


function rgbToHsl(r, g, b){

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s;

    const l = (max + min) / 2;

    if(max === min){

        h = s = 0;

    }else{

        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch(max){

            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;

            case g:
                h = ((b - r) / d + 2) / 6;
                break;

            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return [
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(l * 100)
    ];
}


function hslToRgb(h, s, l){

    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if(s === 0){

        r = g = b = l;

    }else{

        const hue2rgb = (p, q, t) => {

            if(t < 0) t += 1;
            if(t > 1) t -= 1;

            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;

            return p;
        };

        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;

        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}


function rgbToXyz(r, g, b){

    let rr = r / 255;
    let gg = g / 255;
    let bb = b / 255;

    const linearize = c =>
        c <= 0.04045
            ? c / 12.92
            : Math.pow((c + 0.055) / 1.055, 2.4);

    rr = linearize(rr);
    gg = linearize(gg);
    bb = linearize(bb);

    const x =
        rr * 0.4124564 +
        gg * 0.3575761 +
        bb * 0.1804375;

    const y =
        rr * 0.2126729 +
        gg * 0.7151522 +
        bb * 0.0721750;

    const z =
        rr * 0.0193339 +
        gg * 0.1191920 +
        bb * 0.9503041;

    return {
        X: x * 100,
        Y: y * 100,
        Z: z * 100
    };
}


// --- Draw HSV Wheel ---

function drawWheel(satFactor){

    const image = ctx.createImageData(width, height);

    const data = image.data;

    for(let y = 0; y < height; y++){

        for(let x = 0; x < width; x++){

            const dx = x - centerX;
            const dy = y - centerY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            const index = (y * width + x) * 4;

            if(distance <= radius){

                const angle = Math.atan2(dy, dx);

                const hue =
                    (angle + Math.PI) / (2 * Math.PI);

                const saturation =
                    (distance / radius) * satFactor;

                const rgb = hsvToRgb(
                    hue,
                    saturation,
                    1
                );

                data[index] = rgb[0];
                data[index + 1] = rgb[1];
                data[index + 2] = rgb[2];
                data[index + 3] = 255;

            }else{

                data[index + 3] = 0;
            }
        }
    }

    ctx.putImageData(image, 0, 0);
}


// --- Palette Generation ---

function generatePalettes(baseHsl, customSat = null){

    const [h, origS, l] = baseHsl;

    const s =
        customSat !== null
            ? customSat
            : origS;

    const comp = [(h + 180) % 360, s, l];

    const ana1 = [(h - 30 + 360) % 360, s, l];
    const ana2 = [(h + 30) % 360, s, l];

    const tri1 = [(h + 120) % 360, s, l];
    const tri2 = [(h + 240) % 360, s, l];

    const tet1 = [(h + 90) % 360, s, l];
    const tet2 = [(h + 180) % 360, s, l];
    const tet3 = [(h + 270) % 360, s, l];

    const mono = [
        [h, s, Math.max(0, l - 30)],
        [h, s, Math.max(0, l - 15)],
        [h, s, l],
        [h, s, Math.min(100, l + 15)],
        [h, s, Math.min(100, l + 30)]
    ];

    return {
        comp,
        ana1,
        ana2,
        tri1,
        tri2,
        tet1,
        tet2,
        tet3,
        mono
    };
}


// --- Render Palette ---

function renderPalette(container, colors){

    container.innerHTML = "";

    colors.forEach(hslArr => {

        const [h, s, l] = hslArr;

        const [r, g, b] = hslToRgb(h, s, l);

        const hex =
            ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1);

        const swatch = document.createElement("div");

        swatch.className = "palette-swatch";

        swatch.style.backgroundColor =
            `rgb(${r},${g},${b})`;

        swatch.dataset.hex = `#${hex}`;

        swatch.dataset.hsl =
            `hsl(${h}, ${s}%, ${l}%)`;

        swatch.addEventListener("mouseenter", () => {

            paletteTooltip.style.display = "block";

            paletteTooltip.textContent =
                `${swatch.dataset.hex} · ${swatch.dataset.hsl}`;
        });

        swatch.addEventListener("mousemove", (e) => {

            paletteTooltip.style.left =
                (e.clientX + 12) + "px";

            paletteTooltip.style.top =
                (e.clientY - 30) + "px";
        });

        swatch.addEventListener("mouseleave", () => {

            paletteTooltip.style.display = "none";
        });

        container.appendChild(swatch);
    });
}


// --- Update Palettes ---

function updateAllPalettes(){

    const sat =
        parseInt(saturationSlider.value, 10);

    saturationValue.textContent = sat + "%";

    if(lastHsl){

        const p = generatePalettes(lastHsl, sat);

        currentPalettes.complementary = [p.comp];

        currentPalettes.analogous = [
            p.ana1,
            p.ana2
        ];

        currentPalettes.triadic = [
            p.tri1,
            p.tri2
        ];

        currentPalettes.tetradic = [
            p.tet1,
            p.tet2,
            p.tet3
        ];

        currentPalettes.monochromatic =
            p.mono;

        renderPalette(
            paletteContainers.complementary,
            currentPalettes.complementary
        );

        renderPalette(
            paletteContainers.analogous,
            currentPalettes.analogous
        );

        renderPalette(
            paletteContainers.triadic,
            currentPalettes.triadic
        );

        renderPalette(
            paletteContainers.tetradic,
            currentPalettes.tetradic
        );

        renderPalette(
            paletteContainers.monochromatic,
            currentPalettes.monochromatic
        );
    }
}


// --- Copy Palette ---

function copyPalette(paletteKey){

    const colors =
        currentPalettes[paletteKey];

    if(!colors) return;

    const hexList = colors.map(hslArr => {

        const [r, g, b] =
            hslToRgb(...hslArr);

        return "#" +
            ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1);
    });

    const cssText = hexList.join(", ");

    navigator.clipboard.writeText(cssText)
        .then(() => {

            const btn = document.querySelector(
                `.copy-btn[data-palette="${paletteKey}"]`
            );

            if(btn){

                const originalText = btn.innerHTML;

                btn.innerHTML = "✅ Copied!";

                btn.style.color = "#4cafaf";

                setTimeout(() => {

                    btn.innerHTML = originalText;

                    btn.style.color = "";

                }, 1200);
            }

        }).catch(err => {

            alert("Copy error: " + err);
        });
}


// --- Copy Buttons ---

document.querySelectorAll(".copy-btn")
    .forEach(btn => {

        btn.addEventListener("click", (e) => {

            e.stopPropagation();

            const palette =
                btn.dataset.palette;

            copyPalette(palette);
        });
    });


// --- Slider Event ---

function onSliderChange(){

    const satFactor =
        parseInt(saturationSlider.value, 10) / 100;

    drawWheel(satFactor);

    if(lastMouseX !== null && lastMouseY !== null){

        updateColorFromPosition(
            lastMouseX,
            lastMouseY
        );
    }

    updateAllPalettes();
}

saturationSlider.addEventListener(
    "input",
    onSliderChange
);


// --- Update Color ---

function updateColorFromPosition(realX, realY){

    const dx = realX - centerX;
    const dy = realY - centerY;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if(distance > radius){

        tooltip.style.display = "none";

        return;
    }

    const angle = Math.atan2(dy, dx);

    const hue =
        (angle + Math.PI) / (2 * Math.PI);

    const saturationRaw = distance / radius;

    const value = 1;

    const pixel = ctx.getImageData(
        Math.round(realX),
        Math.round(realY),
        1,
        1
    ).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex =
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1);

    tooltipSwatch.style.backgroundColor =
        `rgb(${r},${g},${b})`;

    tooltipHex.textContent = `#${hex}`;

    tooltip.style.display = "flex";

    preview.style.backgroundColor =
        `rgb(${r},${g},${b})`;

    const hsl = rgbToHsl(r, g, b);

    const xyz = rgbToXyz(r, g, b);

    valHex.textContent = `#${hex}`;

    valRgb.textContent = `${r}, ${g}, ${b}`;

    valHsl.textContent =
        `${hsl[0]}°, ${hsl[1]}%, ${hsl[2]}%`;

    valHsv.textContent =
        `${Math.round(hue * 360)}°, ${
            Math.round(
                saturationRaw *
                parseInt(saturationSlider.value)
            ) / 100 * 100
        }%, ${Math.round(value * 100)}%`;

    valXyz.textContent =
        `${xyz.X.toFixed(1)}, ${
            xyz.Y.toFixed(1)
        }, ${
            xyz.Z.toFixed(1)
        }`;

    lastHsl = hsl;

    updateAllPalettes();

    clearTimeout(window.colorTimeout);

    window.colorTimeout = setTimeout(async () => {

        const response =
            await fetch(`/color/${hex}`);

        const color =
            await response.json();

        valName.textContent = color.name;

    }, 40);
}


// --- Canvas Coordinates ---

function getRealCoordinates(e){

    const rect =
        canvas.getBoundingClientRect();

    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}


// --- Mouse Events ---

canvas.addEventListener("mousemove", (e) => {

    const { x, y } =
        getRealCoordinates(e);

    lastMouseX = x;
    lastMouseY = y;

    const dx = x - centerX;
    const dy = y - centerY;

    if(Math.sqrt(dx*dx + dy*dy) > radius){

        tooltip.style.display = "none";

        return;
    }

    tooltip.style.left =
        (e.clientX + 15) + "px";

    tooltip.style.top =
        (e.clientY - 40) + "px";

    updateColorFromPosition(x, y);
});


canvas.addEventListener("mouseleave", () => {

    tooltip.style.display = "none";

    lastMouseX = null;
    lastMouseY = null;

    paletteTooltip.style.display = "none";
});


// --- Initialize ---

drawWheel(1);

saturationSlider.value = 100;

saturationValue.textContent = "100%";

updateAllPalettes();