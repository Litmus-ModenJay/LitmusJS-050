/*
Litmus Database Functions
    by COYOON
    20220209
*/
import * as cvc from './CVC.js';
import litmusDB from './LitmusDB.js'

// const jsonData= require('./litmusDB 20220214.json'); 
// const jsonData = JSON.parse(JSON.stringify(data));
// const ypqs = function () {
//     let arr = []
//     for (let i = 0; litmusDB.length; i++){
//         let ypq = cvc.rgb2Ypq(cvc.hexa2rgb(litmusDB[i].Hexa));
//         arr.push([ypq[2], ypq[3], ypq[4]]);
//     }
//     return arr
// }

function findNeighbor(hexa) {
    const radius = 0.1;
    let identical = [], neighbor = [];
    let me = cvc.rgb2Ypq(cvc.hexa2rgb(hexa));
    let d = 0.0;
    for (let i = 0; i < litmusDB.length; i++){
        let hexa = litmusDB[i].Hexa;
        let you = cvc.rgb2Ypq(cvc.hexa2rgb(hexa));
        let gap = [Math.abs(you[2]-me[2]), Math.abs(you[3]-me[3]), Math.abs(you[4]-me[4])];
        let gapMax = Math.max(...gap);
        // console.log(i,gapMax)
        if (Math.max(...gap) < radius){
            d = (gap[0]**2 + gap[1]**2+ gap[2]**2)**0.5;
            console.log(i, gapMax, d);
            if (d < 0.00001) {
                identical.push({'id':i, 'name':litmusDB[i].Name, 'hexa':hexa, 'd': d});
            } else if (d < radius) {
                neighbor.push({'id':i, 'name':litmusDB[i].Name, 'hexa':litmusDB[i].Hexa, 'd': d});
            }
        }  
    }
    let n = neighbor.sort((a,b) => a['d']-b['d']);
    console.log(neighbor, n);
    return [identical, n];
}

// 리트머스 데이터를 인스턴스 별로 하나의 리스트로 출력
function litmusArray() {
    let str = "{";
    for (let i = 0; i < litmusDB.length - 1; i++) {
        let value = cvc.rgb2Ypq(cvc.hexa2rgb(litmusDB[i].Hexa))[4].toFixed(5)
        str += '"' + value + '", ';
    }
    let valueF = cvc.rgb2Ypq(cvc.hexa2rgb(litmusDB[litmusDB.length - 1].Hexa))[4].toFixed(5)
    str += '"' + valueF + '}"';
    return str
}

//Hexa Ypq 변환 정합성
function back2Hexa() {
    let list = [];
    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
            for (let k = 0; k < 256; k++) {
                let hexa = cvc.RGB2hexa([i, j, k]);
                let rgb2 = cvc.Ypq2rgb(cvc.rgb2Ypq(cvc.RGB2rgb([i, j, k])));
                let hexa2 = cvc.rgb2hexa(rgb2);
                // let hexa2 = cvc.rgb2hexa(cvc.Ypq2rgb(cvc.rgb2Ypq(cvc.RGB2rgb([i, j, k]))));
                if (hexa !== hexa2) {
                    list.push([hexa, hexa2]);
                    console.log(hexa, hexa2, rgb2);
                }
            }
            console.log(i, j)
        }
    }
    return list;
}


export {findNeighbor, litmusArray, back2Hexa};
    
