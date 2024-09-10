const data = [
    "Engineering",
    "Customer Success",
    "Intern",
    "Product"
]
var out = [];
for (let i = 0; i < data.length; i++) {
    out.push({
        key: data[i],
        text: data[i],
    });
}
result.data = out;
complete();