var url = "/trips";
console.log(url);

d3.json(url, function(trace){
    var data = [trace];
    console.log(data);
})