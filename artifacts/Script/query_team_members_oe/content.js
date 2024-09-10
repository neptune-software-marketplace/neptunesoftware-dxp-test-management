const data = await entities.qa_team_members_db.find({
    select: [],
    where: {
        ACTIVE: 1, // Show only active members assigned in OE
        DXP_VERSION: "OE",
    },
    order: {
        NAME: "ASC"
    },
    take: 100,
    cache: false,
});
var out = [];
for (let i = 0; i < data.length; i++) {
    out.push({
    key: data[i].USER_ID,
    text: data[i].NAME
})
}
result.data = out;
complete();