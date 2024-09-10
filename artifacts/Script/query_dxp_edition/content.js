const data = await entities.qa_neptune_dxp_edition.createQueryBuilder("alias")
    .where("alias.VERSION_ID <> :VERSION_ID", {VERSION_ID: "NE"})
    .getMany();

var out = [];
for (let i = 0; i < data.length; i++) {
    out.push({
        key: data[i].VERSION_ID,
        text: data[i].VERSION,
    });
}
result.data = out;
complete();