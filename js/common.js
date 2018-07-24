let field = document.getElementsByClassName('field')[0];
let restart = document.getElementsByClassName('restart')[0];
let scoreField = document.getElementsByClassName('score')[0];
let score = 0;


let xhr = new XMLHttpRequest();
let size = {
	width: 4,
	height: 4
};
let image_set = [
'https://kde.link/test/0.png',
'https://kde.link/test/1.png',
'https://kde.link/test/2.png',
'https://kde.link/test/3.png',
'https://kde.link/test/4.png',
'https://kde.link/test/5.png',
'https://kde.link/test/6.png',
'https://kde.link/test/7.png',
'https://kde.link/test/8.png',
'https://kde.link/test/9.png'
];

restart.addEventListener('click', function(){
	while (field.firstChild) {
    	field.removeChild(field.firstChild);
	}
	score = 0;
	scoreField.innerText="Score: "+ score;
	fetch('https://kde.link/test/get_field_size.php')
	.then(res => res.json())
	.then(size => {
		create_field(size);
		init_field();
		shuffle();
		clickHandlerSetup(size);

	})	
});
fetch('https://kde.link/test/get_field_size.php')
.then(res => res.json())
.then(size => {
	create_field(size);
	init_field();
	shuffle();
	clickHandlerSetup(size);

})
.catch(e => console.log(e))

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
function create_field(size){
	for(let i = 0; i < size.height; i++){
		let li = document.createElement('li');
		field.appendChild(li);
		for(let j = 0; j < size.width; j++){
			var cell = document.createElement('div');
			var front = document.createElement('span');
			var back = document.createElement('span');
			front.classList.add('front');
			back.classList.add('back');
			cell.appendChild(front);
			cell.appendChild(back);
			li.appendChild(cell);
		}
	}
}

function init_field(){
	let cell_back = field.querySelectorAll('div .back');
	let count = 0;
	for(let i = 0; i < cell_back.length; i++){	
		if(i % 2 == 0) count++;
		if(count > 9) count = 0;
		cell_back[i].style.backgroundImage = "url('"+image_set[count]+"')";
	}
}
function shuffle(){
	let cell_back = field.querySelectorAll('div .back');
	let buff_img;
	for(let i = 0; i < cell_back.length; i++){
		let random = getRandomInt(0 , cell_back.length);
		buff_img = cell_back[i].style.backgroundImage;
		random_img = cell_back[random].style.backgroundImage;
		cell_back[i].style.backgroundImage = random_img;
		cell_back[random].style.backgroundImage = buff_img;
	}
}
function clickHandlerSetup(size){
	let isOpen = false;
	let cellBuff;
	let hideOnNextClick = false;
	let cell = field.querySelectorAll('div');
	for(let i = 0; i < cell.length; i++){
		cell[i].addEventListener('click', function(evt){
			if(hideOnNextClick){
				for(let j = 0; j < cell.length; j++){
					cell[j].classList.remove('open');
				}
			}
			if(isOpen==false){
				cellBuff = evt.target.parentNode;
				evt.target.parentNode.classList.add('open');
				isOpen = true;
				hideOnNextClick = false;
			}else{
				evt.target.parentNode.classList.add('open');
				if(cellBuff != evt.target.parentNode && cellBuff.lastChild.style.backgroundImage == evt.target.parentNode.lastChild.style.backgroundImage){
					cellBuff.classList.add('hidden');
					evt.target.parentNode.classList.add('hidden');
					isOpen = false;
					score++;
					scoreField.innerText="Score: "+ score;
					if(score==(size.width*size.height)/2) alert('You are win');
				}
				else{
					hideOnNextClick = true;
					isOpen = false;
				}
			}
		});
	}
}