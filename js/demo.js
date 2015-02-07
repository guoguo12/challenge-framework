var current = 0;
var next = 1;
var list = [];
for (var i = 0; i < 10; i++) {
    list.push(current);
    sum = current + next;
    current = next;
    next = sum;
}
console.log(list);