/*
Color Vector Conversion
    color functions in Javascript
    by COYOON
    20220209
*/

function hexa2RGB(hexa) {
    let RGB = [0,0,0];
    for (let i=0; i<3; i++){
        RGB[i] = parseInt(hexa.substring(2*i+1,2*i+3), 16);
    }
    return RGB;
}

function hexa2rgb(hexa) {
    let rgb = [0.0,0.0,0.0];
    for (let i=0; i<3; i++){
        rgb[i] = parseFloat(parseInt(hexa.substring(2*i+1,2*i+3), 16))/255;
    }
    return rgb;
}

function RGB2rgb(RGB) {
    let rgb = [0.0,0.0,0.0];
    for (let i=0; i<3; i++){
        rgb[i] = parseFloat(RGB[i])/255;
    }
    return rgb;
}

function rgb2RGB(rgb) {
    let RGB = [-1, -1, -1];
    for (let i=0; i<3; i++){
        if (rgb[i] >= 0 && rgb[i] <= 1) {
            RGB[i] = parseInt(Math.round(rgb[i] * 255));
        }
    }
    return RGB;
}

function RGB2hexa(RGB) {
    let pre = '#';
    if (RGB[0] < 0 || RGB[1] < 0 || RGB[2] < 0){
        pre = '@';
    }
    let hexa = (pre + ("0" +RGB[0].toString(16)).slice(-2) + ("0" +RGB[1].toString(16)).slice(-2) + ("0" +RGB[2].toString(16)).slice(-2)).toUpperCase()
    return hexa;
}

function rgb2hexa(rgb) {
    return RGB2hexa(rgb2RGB(rgb));
}

function rgbParameters(rgb){
    const sum = rgb.reduce((a, b) => a + b);
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const sigma = max + min;
    const delta = max - min;
    return [sum, max, min, sigma, delta];
}

function RGB2cell(RGB) {
    let cell = '';
    for (let i=0; i<3; i++){
        cell += (parseInt(RGB[i]/32) + 1).toString();
    }
    return cell;
}

export {hexa2RGB, hexa2rgb, RGB2hexa, rgb2hexa, RGB2rgb, rgb2RGB, rgbParameters, RGB2cell};

function rgb2HSLV(rgb) {
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const sigma = max + min;
    const delta = max - min;
    const L = sigma/2.0;
    const V = max
    let HSLV = [0.0, 0.0, L, 0.0, V];
    if (delta !== 0){
        switch (max){
            case rgb[0]:
                HSLV[0] = ((rgb[1]-rgb[2])/delta % 6) * 60;
                break;
            case rgb[1]:
                HSLV[0] = ((rgb[2]-rgb[0])/delta % 6 + 2) * 60;
                break;
            default:
                HSLV[0] = ((rgb[0]-rgb[1])/delta % 6 + 4) * 60;
        }
        if (HSLV[0] < 0.0){
            HSLV[0] += 360;
        }
        HSLV[1] = delta / (1 - Math.abs(2*L - 1));
        if (max){
            HSLV[3] = delta / V;
        }
    }
    return HSLV;
}

function rad2deg(rad) {
    return rad * (180.0 / Math.PI);
}

function deg2rad(deg) {
    return deg * (Math.PI /180.0);
}

function rgb2HCI(rgb) {
    const x = (2*rgb[0] - rgb[1] - rgb[2])/2.0;
    const y = (rgb[1] - rgb[2]) * Math.sqrt(3.0) / 2.0;
    const I = (rgb[0] + rgb[1] + rgb[2])/3.0;
    const C = Math.sqrt(x*x + y*y);
    let H = 0.0;
    if (Math.abs(x) > 0.00001 || Math.abs(y) > 0.00001){
        if (y < 0 ){
            H = rad2deg(Math.atan2(y,x)) + 360;
        } else {
            H = rad2deg(Math.atan2(y,x));
        }
    }
    return [H, C, I];
}

function rgb2CMYK(rgb){
    const k = 1 - Math.max(...rgb);
    let CMYK = [0.0, 0.0, 0.0, k]
    if (k !== 1) {
        CMYK[0] = (1 - rgb[0] - k) / (1 - k)
        CMYK[1] = (1 - rgb[1] - k) / (1 - k)
        CMYK[2] = (1 - rgb[2] - k) / (1 - k)
    }
    return CMYK;
}

export {rgb2HSLV, rgb2HCI, rgb2CMYK};

function rgb2XYZ(rgb, profile){
    let rgbL = [0.0, 0.0, 0.0];
    for (let i=0; i<3; i++){
        if (rgb[i] < 0.04045){
            rgbL[i] = rgb[i] / 12.92;
        } else {
            rgbL[i] = ((rgb[i] + 0.055) / 1.055) ** 2.4;
        }
    }
    const r = rgbL[0];
    const g = rgbL[1];
    const b = rgbL[2];
    let X, Y, Z;
    switch (profile){
        case 'AdobeRGB':
            X = 0.5767309*r + 0.1855540*g + 0.1881852*b;
            Y = 0.2973769*r + 0.6273491*g + 0.0752741*b;
            Z = 0.0270343*r + 0.0706872*g + 0.9911085*b;
            break;
        case 'CIERGB':
            X = 0.4887180*r + 0.3106803*g + 0.2006017*b;
            Y = 0.1762044*r + 0.8129847*g + 0.0108109*b;
            Z = 0.0000000*r + 0.0102048*g + 0.9897952*b;
            break;
        default:
            X = 0.4124564*r + 0.3575761*g + 0.1804375*b;
            Y = 0.2126729*r + 0.7151522*g + 0.0721750*b;
            Z = 0.0193339*r + 0.1191920*g + 0.9503041*b;
    }
    const I = X + Y + Z;
    let x, y;
    if (I === 0){
        x = 0.0; y = 0.0;
    } else {
        x = X / I, y = Y / I;
    }
    return [X, Y, Z, I, x, y];
}

function XYZ2rgb(XYZ){
    const X = XYZ[0];
    const Y = XYZ[1];
    const Z = XYZ[2];
    let r, g, b;
    r = 3.2404542*X + (-1.5371385)*Y + (-0.4985314)*Z;
    g = (-0.9692660)*X + 1.8760108*Y + 0.0415560*Z;
    b = 0.0556434*X + (-0.2040259)*Y + 1.0572252*Z;
    const rgbL = [r, g, b];
    let rgb = [0.0, 0.0, 0.0];
    for (let i=0; i<3; i++){
        if (rgbL[i] <= 0.0031308){
            rgb[i] = rgbL[i] / 12.92;
        } else {
            rgbL[i] = (rgbL[i])**(1/2.4)*1.055 - 0.055;
        }
        if (Math.abs(rgb[i]) < 0.000001) {
            rgb[i] = 0.0;
        }
        if (Math.abs(rgb[i] - 1.0) < 0.000001) {
            rgb[i] = 1.0;
        }
    }
    return rgb;
}

function f(value){
    const delta = 6/29;
    let transform = 1.0;
    if (value > delta**3.0){
        transform = value**(1.0/3.0);
    } else {
        transform = value / 3 / (delta**2.0) + 4 / 29;
    }    
    return transform;
}

function fInv(value){
    const delta = 6/29;
    let transform = 1.0;
    if (value > delta){
        transform = value**3.0;
    } else {
        transform = (value - 4/29) * 3 * (delta**2.0);
    }
    return transform;
}

function XYZ2Lab(XYZ) {
    const X = XYZ[0];
    const Y = XYZ[1];
    const Z = XYZ[2];
    const Xn = 0.95043;
    const Yn = 1.00000;
    const Zn = 1.08889;
    let L = 0.0000001;
    let a = 0.0, b = 0.0;
    if (X+Y+Z !== 0) {
        L = (116 * f(Y/Yn) - 16) / 100;
        a = (500 * (f(X/Xn) - f(Y/Yn))) / 100;
        b = (200 * (f(Y/Yn) - f(Z/Zn))) / 100;
    }
    let H = 0.0;
    if (Math.abs(a) > 0.0001 || Math.abs(b) > 0.0001) {
        if (b < 0) {
            H = rad2deg(Math.atan2(b,a)) + 360;
        } else {
            H = rad2deg(Math.atan2(b,a));
        }
    }
    let C = Math.sqrt(a*a + b*b);
    return [H, C, L, a, b];
}

function XYZ2Luv(XYZ) {
    const X = XYZ[0];
    const Y = XYZ[1];
    const Z = XYZ[2];
    const Xn = 0.95043;
    const Yn = 1.0000;
    const Zn = 1.0888;
    const xn = Xn / (Xn + Yn + Zn);
    const yn = Yn / (Xn + Yn + Zn);
    const un = 4*xn / ((-2)*xn + 12*yn + 3);
    const vn = 9*yn / ((-2)*xn + 12*yn + 3);
    let L = 0.0000001;
    let u = 0.0, v = 0.0, ua = 0.0, va = 0.0;
    if (X+Y+Z !== 0) {
        L = (116 * f(Y/Yn) - 16) / 100;
        u = 4 * X / (X + 15*Y + 3*Z);
        v = 9 * Y / (X + 15*Y + 3*Z);
        ua = 13 * L * (u-un);
        va = 13 * L * (v-vn);
    }
    let H = 0.0;
    if (Math.abs(ua) > 0.0001 || Math.abs(va) > 0.0001) {
        if (va < 0) {
            H = rad2deg(Math.atan2(va,ua)) + 360;
        } else {
            H = rad2deg(Math.atan2(va,ua));
        }
    }
    let C = Math.sqrt(ua*ua + va*va);
    return [H, C, L, ua, va];
}

export {rgb2XYZ, XYZ2Lab, XYZ2Luv};

function rgb2Ypq(rgb) {
    const Y = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2];
    const p = rgb[0]-0.5*rgb[1]-0.5*rgb[2];
    const q = 0.8660254*rgb[1]-0.8660254*rgb[2];
    let H = 0.0;
    if (Math.abs(p) > 0.0001 || Math.abs(q) > 0.0001) {
        if (q < 0) {
            H = rad2deg(Math.atan2(q,p)) + 360;
        } else {
            H = rad2deg(Math.atan2(q,p));
        } 
    }
    let C = Math.sqrt(p*p + q*q);
    return [H, C, Y, p, q];
}

function Ypq2rgb(Ypq) {
    let rgb = [0.0, 0.0, 0.0]
    rgb[0] = Ypq[2] + 0.701*Ypq[3] - 0.2730867*Ypq[4]
    rgb[1] = Ypq[2] - 0.299*Ypq[3] + 0.3042636*Ypq[4]
    rgb[2] = Ypq[2] - 0.299*Ypq[3] - 0.850437*Ypq[4]
    for (let i = 0; i < 3; i++) {
        if (rgb[i] > 1 && rgb[i] < 1.0000001) { rgb[i] = 1 }
        if (rgb[i] < 0 && rgb[i] > -0.0000001) { rgb[i] = 0 }
    }
    
    return [rgb[0], rgb[1], rgb[2]]
}

function HCY2Ypg(HCY) {
    const p = HCY[1]*math.cos(rad2deg(HCY[0]));
    const q = HCY[1]*math.sin(math.radians(HCY[0]));
    return [HCY[0], HCY[1], HCY[2], p, q];
}

function HCY2hexa(HCY) {
    return rgb2hexa(Ypq2rgb(HCY2Ypg(HCY)));
}

function hexa2Ypq(hexa) {
    return rgb2Ypq(hexa2rgb(hexa));
}

function Ypq2hexa(Ypq) {
    return rgb2hexa(Ypq2rgb(Ypq));
}

function Ypq2wheel(Ypq) {
    let Href = [8.4,39.7,61.9,93.7,132.7,174.2,187.7,213.7,248.1,284.8,313.7,340.7,368.4];
    let Cref = [0.0,0.028,0.058,0.265,0.504,0.728,0.836,1.0001];
    let Yref = [0.0000,0.264,0.412,0.6,0.753,0.944,1.0001];

    let H = Ypq[0], C = Ypq[1], Y = Ypq[2];
    if (H < Href[0]) {
        H += 360;
    }
    let sH = 'ac', sC = '', sY = '';
    
    let c = 0;
    while (C >= Cref[c+1]) {
        c++;
    }
    sC = c.toString();
    let y = 0;
    while (Y >= Yref[y+1]) {
        y++;
    }
    sY = y.toString();
    let h = 0;
    while (H >= Href[h]) {
        h++;
    }
    if (h === Href.length -1) {
        h = 0;
    }
    if (c !== 0) {
        sH = ('0'+ h.toString()).slice(-2);
    }
    let section = 'H' + sH + 'C' + sC + 'Y' + sY;

    const Wref = ['Red','Orange','Yellow','Lime','Green','Sea','Cyan','Sky',
                'Blue','Violet','Purple','Rose'];
    const Dref = [['Black','Dark Gray','Gray','Gray','Light Gray','White'],
                ['Black Dark','Dark Gray','Gray','Gray','Light Gray','White Pale'],
                ['Dark','Dark','Dull','Soft','Pale','Pale'],
                ['Dark','Dark','Dull','Soft','Pale','Pale'],
                ['Deep','Deep','Strong','Strong','Light','Light'],
                ['Deep','Deep','Strong','Strong','Light','Light'],
                ['Vivid','Vivid','Vivid','Vivid','Vivid','Vivid']];

    let wheel = 'Achromatic', depth = Dref[0][y], mode= 'Dark';
    if (sH !== 'ac') {
        wheel = Wref[h];
        depth = Dref[c][y];
    }
    if (y >= 3) {
        mode = 'Light';
    } 
    if (y === 2 && c === 6 && h >=  4 && h <= 6) {
        mode = 'Light';
    }


    const Supernova = ['Empty','Red','Orange','Yellow','Green','Blue','Purple','Pink','Brown','Gray','White','Black'];
    const Agroup = [11,9,9,9,9,10];
    const Cgroup = [[[11,9,9,9,7,10],[8,8,8,7,7,7],[8,8,7,7,7,0],[1,1,7,7,7,0],[1,1,1,0,0,0],[1,1,0,0,0,0]],
                [[11,9,9,9,9,10],[8,8,8,8,2,2],[8,8,8,8,2,2],[8,8,2,2,2,0],[8,2,2,2,2,0],[0,2,2,2,0,0]],
                [[11,9,9,9,9,10],[8,8,8,8,3,3],[8,8,8,8,3,3],[0,8,8,3,3,3],[0,8,3,3,3,3],[0,0,0,3,3,0]],
                [[11,9,9,9,9,10],[4,4,4,4,4,4],[4,4,4,4,4,4],[0,4,4,4,4,4],[0,4,4,4,4,0],[0,0,0,4,4,0]],
                [[11,9,9,9,9,10],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,0],[0,4,4,4,4,0],[0,4,4,4,0,0]],
                [[11,9,9,9,9,10],[4,4,4,4,4,4],[4,4,4,4,4,4],[4,4,4,4,4,0],[0,4,4,4,4,0],[0,0,4,4,0,0]],
                [[11,9,9,9,9,10],[4,4,5,5,5,5],[4,4,5,5,5,5],[4,4,5,5,5,0],[0,4,5,5,5,0],[0,0,5,5,0,0]],
                [[11,9,9,9,9,10],[5,5,5,5,5,5],[5,5,5,5,5,0],[5,5,5,5,5,0],[5,5,5,5,0,0],[0,5,5,0,0,0]],
                [[11,9,9,9,9,10],[5,5,5,5,5,5],[5,5,5,5,5,0],[5,5,5,5,0,0],[5,5,5,0,0,0],[5,5,0,0,0,0]],
                [[11,9,9,9,9,10],[6,6,6,6,6,6],[6,6,6,6,6,0],[6,6,6,6,0,0],[6,6,6,0,0,0],[6,6,0,0,0,0]],
                [[11,9,9,9,9,10],[6,6,6,6,6,6],[6,6,6,6,6,0],[6,6,6,6,6,0],[6,6,6,6,0,0],[0,6,6,0,0,0]],
                [[11,9,9,9,7,10],[6,6,6,7,7,7],[6,6,6,7,7,0],[1,6,7,7,0,0],[1,1,7,0,0,0],[0,7,0,0,0,0]]];
    
    let group = Supernova[Agroup[y]];
    if (sH !== 'ac'){
        group = Supernova[Cgroup[h][c-1][y]];
    }

    return [section, wheel, depth, mode, group]
}


export {rgb2Ypq, Ypq2wheel, Ypq2rgb, hexa2Ypq, Ypq2hexa};
    
    

