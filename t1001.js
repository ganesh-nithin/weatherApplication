import myJson from '/Assets/files/data.json' assert {type: 'json'};

var str='';
for(let key in myJson){
    str += '<option value="'+myJson[key].cityName+'" />';
}

var my_list=document.getElementById("cities");
my_list.innerHTML = str;

function changeIcon(city){
    let image=document.getElementById("city-img");
    image.src = "/Assets/Icons for cities/"+city.toLowerCase()+".svg";
}

function changeCity(){
    let city = document.getElementById("input-city");
    let cityVal = city.value;
    let isCorrect = false;
    for(let key in myJson){
        if(myJson[key].cityName == cityVal){
            isCorrect = true;
            city.className = "";
            changeIcon(cityVal);
        }
    }
    if(!isCorrect){
        city.className = "incorrect";
    }
}

document.getElementById("input-city").addEventListener("change", changeCity);