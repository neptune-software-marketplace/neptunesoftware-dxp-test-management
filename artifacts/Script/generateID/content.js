result.data = generateID();
console.log(result.data);
complete();

function generateID() {
    var minm = 10000;
    var maxm = 99999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}