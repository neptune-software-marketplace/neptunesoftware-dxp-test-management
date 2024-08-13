var arrData = [
    {
        recID: "EE48B89F-2921-4B76-AFB4-B257AF55DC39",
        reportedBy: "rommel",
        createdAt: "1655287017634"
    },
    {
        recID: "6E3BB157-F328-4CAD-BB87-3032EC5CC9FA",
        reportedBy: "rommel",
        createdAt: "1654805970124"
    },
    {
        recID: "D2531638-E9BB-4351-A351-10874C87A30F",
        reportedBy: "rommel",
        createdAt: "1665053653407"
    },
    {
        recID: "F2022FB3-E98B-4BBA-9247-458D364DD551",
        reportedBy: "rommel",
        createdAt: "1660306660326"
    },
    {
        recID: "85BC7DA4-CE70-4C2A-A67E-920E5FC48F9C",
        reportedBy: "rommel",
        createdAt: "1660306300296"
    },
    {
        recID: "F4AF2CB5-C92C-46F2-B839-A0FAF2E5C9ED",
        reportedBy: "rommel",
        createdAt: "1655415284970"
    },
    {
        recID: "8D9CD9D4-DF3E-46C6-8D1E-C95221FEE549",
        reportedBy: "rommel",
        createdAt: "1655972940313"
    },
    {
        recID: "158A7F1C-715D-4192-BD34-59B489B9D760",
        reportedBy: "rommel",
        createdAt: "1665052771549"
    },
    {
        recID: "CA73D15B-C64E-406C-A9D8-A64564233AA2",
        reportedBy: "jordi.aixela",
        createdAt: "1665390908411"
    },
    {
        recID: "049BB259-CFAE-4D86-91BC-83FAA98881AD",
        reportedBy: "lloyd.trevarthen",
        createdAt: "1655209463588"
    },
    {
        recID: "CDD16F19-114A-4EAE-BA1F-92C5DD462079",
        reportedBy: "rommel",
        createdAt: "1665052033451"
    },
    {
        recID: "312CE209-37E2-4CB2-B96B-AA8FBA47F588",
        reportedBy: "jordi.aixela",
        createdAt: "1665144766869"
    }
]
for (var i=0; i<arrData.length; i++) {
    await entities.qa_reported_issues_db.update(arrData[i].recID, {"createdBy": arrData[i].reportedBy + "@neptune-software.com"});
    await entities.qa_reported_issues_db.update(arrData[i].recID, {"createdAt": arrData[i].createdAt});
}
complete();