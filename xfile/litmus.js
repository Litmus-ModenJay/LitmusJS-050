import * as cvc from './CVC.js';
import * as ls from './litmusSearch.js';

const button = document.querySelector('.submit');
const input = document.querySelector('#search-input');
console.log(input.value)
const output = document.querySelector('#search-output');
button.addEventListener('click', function(e){
	e.preventDefault();
	const str = input.value;
	if (str === ''){
		return;
	}
	let searchResult = '';
	searchResult = search(str);
	const doc = document.createElement('p');
	//console.log(searchResult);
	//doc.textContent = searchResult;
	doc.innerHTML = searchResult;
	output.innerHTML = doc.innerHTML;
});

function search(str){
	let first = str.charAt(0);
	let result = '';
	switch (first){
		case "#":
			if (isHexa(str) === true){
				result = 코드검색(str);
			}
			break;
		case "$":
			result = 명령어검색(str);
			break;
		default:
			result = 단어검색(str);
	}
	return result;
}

function 코드검색(str){
	let result = '';
	let v = '';
	result += `<div style="padding:15px; background-color: ${str};"></div>`
	result += 'Hexa : ' + str;
	const RGB = cvc.hexa2RGB(str);
	const rgb = cvc.hexa2rgb(str);
	const XYZ = cvc.rgb2XYZ(rgb);
	const Ypq = cvc.rgb2Ypq(rgb);
	v = RGB
	result += '<br>' + 'RGB : ' + v[0] + ', ' + v[1] + ', ' + v[2];
	v = rgb;
	result += '&nbsp; &nbsp; &nbsp; ' + 'rgb : ' + rgb[0].toFixed(5) + ', ' + rgb[1].toFixed(5) + ', ' + rgb[2].toFixed(5);
	v = cvc.rgb2HCI(rgb);
	result += '<br>' + 'HCI : ' + v[0].toFixed(2) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5);
	v = cvc.rgbParameters(rgb);
	result += '<br>' + 'rgb sum ' + v[0].toFixed(5) + ', max ' + v[1].toFixed(5) + ', min ' 
				+ v[2].toFixed(5) + ', sigma '+ v[3].toFixed(5) + ', delta '+ v[4].toFixed(5) ;
	v = cvc.rgb2HSLV(rgb);
	result += '<br>' + 'HSL : ' + v[0].toFixed(2) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5);
	result += '&nbsp; &nbsp; &nbsp; ' + 'HSV : ' + v[0].toFixed(2) + ', ' + v[3].toFixed(5) + ', ' + v[4].toFixed(5);
	v = cvc.rgb2CMYK(rgb);
	result += '<br>' + 'CMYK : ' + v[0].toFixed(5) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5) + ', ' + v[3].toFixed(5);
	v = XYZ;
	result += '<br>' + 'XYZxy : ' + v[0].toFixed(5) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5) + ', ' + v[3].toFixed(5) + ', ' + v[4].toFixed(5);
	v = cvc.XYZ2Lab(XYZ);
	result += '<br>' + 'HCLab : ' + v[0].toFixed(2) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5) + ', ' + v[3].toFixed(5) + ', ' + v[4].toFixed(5);
	v = cvc.XYZ2Luv(XYZ);
	result += '<br>' + 'HCLuv : ' + v[0].toFixed(2) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5) + ', ' + v[3].toFixed(5) + ', ' + v[4].toFixed(5);
	v = Ypq;
	result += '<br>' + 'HCYpq : ' + v[0].toFixed(2) + ', ' + v[1].toFixed(5) + ', ' + v[2].toFixed(5) + ', ' + v[3].toFixed(5) + ', ' + v[4].toFixed(5);
	result += '<br>' + 'Cell : ' + cvc.RGB2cell(RGB);
	v = cvc.Ypq2wheel(Ypq);
	result += '<br>' + 'Section : ' + v[0]; 
	result += '<br>' + 'Wheel : ' + v[1] + '&nbsp; &nbsp; &nbsp; Depth : '+ v[2]; 
	result += '<br>' + 'Group : ' + v[4]; 
	result += '<br>'
	v = ls.findNeighbor(str);
	console.log(v[1][0].name);
	if (v[0].length > 0) {
		result += '<br>' + 'Identical : ' + v[0][0].name + ' ' + v[0][0].hexa; 
	}
	if (v[1].length > 0) {
		result += '<br>' + '# of Neighbors : ' + v[1].length; 
		console.log(v[1].length, v[1][0].hexa);
		for (let i=0; i < v[1].length; i++){
			result += '<br>' + 'Neighbor : ' + v[1][i].name + ' ' + v[1][i].hexa+ ' (d = ' + v[1][i].d.toFixed(5) +')'; 
		}
	}

	return result;
}

function 명령어검색(str){
	let result = ""
	switch (str){
		case "$a": //리트머스 데이터를 인스턴스 별로 하나의 리스트로 출력
			result = ls.litmusArray();
			break;
		case "$Y":  //Hexa Ypq 변환 정합성
			let list = ls.back2Hexa();
			let count = 0;
			result  += '<br> Total # ' +  list.length + '<br>';
			list.forEach( item => {
				result += '<br>' + ' (' + count.toString() + ') '+ item[0] + ", " + item[1];
				// console.log('<br>' + ' (' + count.toString() + ') '+ item[0] + ", " + item[1])
				count ++
			})
			break;
		default:
			result = "명령어 옵션이 없습니다.";
	}
	
	return result;
}

function 단어검색(str){
	return `We will search for "${str}"`;
}

function subH(str) {
	let sub = str.substring(1,str.length);
	return sub;
}

function isHexa(str) {
	let sub = str.substring(1,str.length);
	if (sub.length === 6){
		if (/^[a-fA-F0-9]+/.test(sub)){
			return true;
		}
	}
	return false;
}
