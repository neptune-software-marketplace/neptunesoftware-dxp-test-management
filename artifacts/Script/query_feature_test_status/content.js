const data = await entities.qa_issue_status_feature_db.find({
    select: [],
    order: {
        STATUS_ID: "DESC",
    },
    take: 100,
    cache: false,
});
var out = [];
for (let i = 0; i < data.length; i++) {
    out.push({
        key: data[i].STATUS_ID,
        text: data[i].STATUS,
    });
}
result.data = out;
complete();
