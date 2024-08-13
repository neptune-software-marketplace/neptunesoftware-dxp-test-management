result.data = await getData();

async function  getData() {
    const entity = await entities.qa_feature_testing_db_23.findOne(req.body.id);
    return entity.REF_GITHUB_LINK, '_blank';
}

complete();

