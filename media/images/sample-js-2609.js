nab.branding = {
    fistTime: true,
    eventClickInited: false,
    openPopFolderName: false,
    currentFolder: {},
    selectedObject: {},
    selectedObjectIsAHeader: false,
    formOptions: [
        { key: "Colors/color1", label: "Primary Color 1" },
        { key: "Colors/color2", label: "Primary Color 2" },
        { key: "Colors/color3", label: "Secondary Color 1" },
        { key: "Colors/color4", label: "Secondary Color 2" },
        { key: "Colors/color5", label: "Secondary Color 3" },

        // { key: "pageBGColor", label: "Page Background" },
        // { key: "pageHeaderColor", label: "Page Header" },
        // { key: "pageFooterColor", label: "Page Footer" },
        // { key: "textColor", label: "Text" },
        // { key: "textTitleColor", label: "Title" },
        // { key: "ListTitleColor", label: "List - Title" },
        // { key: "ListIntroColor", label: "List - Intro" },
        // { key: "ListIconColor", label: "List - Icon" },
    ],

    init: function (accountId) {
        oTreeBranding.getBinding().mParameters = { arrayNames: ['subFolder'] };
        if (nab.branding.fistTime) {
            nab.branding.fistTime = false;
            nab.branding.createForm();

            boPagePreviewBranding.addEventDelegate({ // DXPP-132
                onAfterRendering: function (e) {
                    //if (!nab.branding.eventClickInited) {
                    nab.branding.eventClickInited = true;
                    boPagePreviewBranding.getDomRef().addEventListener('click', nab.branding.pageClick)
                    //console.log(e.target.id)
                    // })
                    // }
                }
            })
        }

        apiBrandingGet({
            parameters: {
                "accountid": accountId
            }
        }).then(function (data) {
            nab.branding.processingData(data);
        });
    },
    processingData: function (data) {
        nab.branding.checkIFAppAsCssDefined(data)
        nab.branding.buildTree(data)
    },
    checkIFAppAsCssDefined: function (data) {

        if (modelAppData.oData.pages !== undefined && modelAppData.oData.pages.length > 0 && modelAppData.oData.pages[0].css !== null && modelAppData.oData.pages[0].css.length > 0) {
            let css = modelAppData.oData.pages[0].css.find(a => a.componentName === "ABRBranding")
            if (css) {
                if (modelBranding.oData.length !== undefined) { // if model is inicial we will have a JS Error
                    for (const line of data) {
                        if (line.id === css.cssId) {
                            line.used = true;
                        } else {
                            line.used = false;
                        }
                    }
                }
            }
        } else {
            if (data.length !== undefined) {
                for (const line of data) {
                    line.used = false;
                }
            }
        }
        modelBranding.oData = data;
        modelBranding.refresh();

    },
    createForm: function () {
        $.each(nab.branding.formOptions, function (i, formLine) {
            let label = new sap.m.Label({ text: formLine.label });
            oSimpleFormBranding.addContent(label);

            let icon = new sap.ui.core.Icon({
                src: "sap-icon://fa-solid/square",
                size: "1.5rem",
                color: "{/" + formLine.key + "}",
                press: function (oEvent) {
                    oResponsivePopoverBranding.openBy(this)
                }
            })
            icon.addStyleClass("nabBrandingSF");
            icon.addStyleClass("sapUiTinyMarginTop");
            oSimpleFormBranding.addContent(icon);
        })
    },
    createCssString: function (cssClass, data, breakLine) {
        let crlf = "";
        if (breakLine) {
            crlf = " \n";
        }

        let cssString = "." + cssClass + "{ background-color: " + data.pageBGColor + "!important;}" + crlf;  //Page background
        cssString += "." + cssClass + " .sapMHeader-CTX { background-color: " + data.pageHeaderBGColor + "!important;}" + crlf; // Page Header background
        // cssString += "." + cssClass + " ..sapMIBar-CTX.sapMTitle{ color: " + data.pageHeaderTextColor + "!important;}" + crlf;// Page Header text
        cssString += "." + cssClass + " .sapMPanelContent{ background-color: " + data.panelBGColor + "!important;}" + crlf; //Panel background
        cssString += "." + cssClass + " .sapMPanelHdr{ background-color: " + data.panelHeaderBGColor + "!important;}" + crlf; //Panel Header background
        cssString += "." + cssClass + " .sapFCard{ background-color: " + data.cardBGColor + "!important;}" + crlf; //card background
        cssString += "." + cssClass + " .sapMFooter-CTX {background-color: " + data.barFooterBGColor + " !important;}" + crlf; // PageFooter
        cssString += "." + cssClass + " .sapMBtnDefault {background-color: " + data.buttonBGColor + "}" + crlf; // Button backgtound 

        // cssString += "." + cssClass + " .sapMBtnDefault:hover {background-color: " + data.buttonBGColorHouver + "!important; filter: brightness(170%); }" + crlf; // Button backgtound 
        // cssString += "." + cssClass + " .sapMText {color: " + data.textColor + "}" + crlf; // Text
        //  cssString += "." + cssClass + " .sapMTitle {color: " + data.textTitleColor + "}" + crlf; // Text Title
        // cssString += "." + cssClass + " .sapMText.sapMObjLTitle  {color: " + data.textTitleColor + "}" + crlf; // List Title
        //  cssString += "." + cssClass + " .sapMText.sapMObjLIntro  {color: " + data.textTitleColor + "}" + crlf; // List Intro
        //  cssString += "." + cssClass + " .sapMText.sapMObjLIcon  {color: " + data.textTitleColor + "}" + crlf; // List Icon

        return cssString;
    },
    applyCss: function (cssClass, data) {
        let css = nab.branding.createCssString(cssClass, data)
        document.getElementById(cssClass).innerHTML = css;
    },
    previewCss: function (data) {
        nab.branding.applyCss('previewPage', data)
    },
    clearPreviewCss: function () {
        nab.branding.clearCss('previewPage')
    },
    clearCss: function (cssClass) {
        document.getElementById(cssClass).innerHTML = "";
    },
    applyPageCss: function (data) {
        nab.branding.applyCss('ABRBranding', data)
    },
    clearPageCss: function () {
        nab.branding.clearCss('ABRBranding')
    },
    buildTree: function (data) {

        let tree = [];
        let rootPresent = false;

        $.each(data, function (i, css) {
            let content = css.name.split('/')
            let folder = {};
            let lastfolder = {};
            let path = "";
            let edit = true;
            $.each(content, function (k, name) {

                if (k === content.length - 1) {
                    folder.subFolder.push({
                        ...css,
                        nameTree: name,
                        type: "css",
                        path: path,
                        selected: false,
                        subFolder: [],

                    })

                } else {
                    path = path + name + "/";
                    folder = nab.media.getObject(tree, path);

                    if (folder === undefined) {
                        folder = {
                            nameTree: name,
                            type: "folder",
                            path: path,
                            selected: false,
                            subFolder: [],
                        }

                        if (k === 0) {
                            if (name === "Main") rootPresent = true;
                            if (name === "Neptune") edit = data.neptune;
                            tree.push(folder)
                        } else {
                            lastfolder.subFolder.push(folder);
                        }
                        lastfolder = folder;
                    } else {
                        if (name === "Neptune" && k === 0) edit = data.neptune;
                        lastfolder = folder;
                    }
                }
            })
        })
        if (!rootPresent) {
            tree.push({
                nameTree: "Main",
                type: "folder",
                //  folder: "Main",
                //path: nab.media.accountid + "/",
                path: "Main/",
                selected: false,
                subFolder: [],
                //files: []
            })
        }
        modeloTreeBranding.setData(tree);
    },
    addNewFolder: function (folderName) {
        let old = oTreeBranding.getSelectedItem();
        nab.branding.currentFolder.subFolder.push({
            //folder: folderName,
            nameTree: folderName,
            path: nab.branding.currentFolder.path + folderName + "/",
            selected: true,
            subFolder: [],
            type: "folder",
            // files: []
        })

        modeloTreeBranding.refresh();
        oTreeBranding.expand(oTreeBranding.indexOfItem(old))
        oTreeBranding.fireSelectionChange();
        oTreeBranding.scrollToIndex(oTreeBranding.indexOfItem(oTreeBranding.getSelectedItem()))
    },
    setScreenLayout: function () {
        layoutDefBrandingMidle.setSize("300px");
        oPageBrandingMessage.setVisible(false);
        oPanelBrandingPreview.setVisible(true);
    },
    resetScreenLayout: function () {
        layoutDefBrandingMidle.setSize("0px");
        oPageBrandingMessage.setVisible(true);
        oPanelBrandingPreview.setVisible(false);
        oTreeBranding.removeSelections();
        oButtonBrandingSave.setEnabled(false);
        oInputBrandingName.setValueState("None");
    },
    newBranding: function (selectedItem) {

        let emptydata = {
            nameTree: "",
            type: "css",
            path: "",
            selected: true,
            subFolder: [],
            Colors: {
                color1: "#f6b221",
                color2: "#033e52",
                color3: "#83c8bc",
                color4: "#ffffff",
                color5: "#f3f5f6"
            },
            accountid: modelAppData.oData.accountid,
            css: {},
            description: "",
            name: "",
            where_used: {}
        }
        let array = [];
        if (selectedItem) {
            let data = selectedItem.getBindingContext().getObject();
            emptydata.path = data.path;

            if (selectedItem.getBindingContext().getProperty("type") === "folder") {
                array = modeloTreeBranding.getContext(selectedItem.getBindingContext().sPath).getProperty("subFolder");
            } else {
                array = modeloTreeBranding.getContext(selectedItem.getBindingContext().sPath.slice(0, selectedItem.getBindingContext().sPath.lastIndexOf('/'))).getObject();
            }

        } else {
            emptydata.path = "Main/";
            array = modeloTreeBranding.getContext("/0/subFolder").getObject();
        }
        oTreeBranding.removeSelections();
        array.unshift(JSON.parse(JSON.stringify(emptydata)));
        modeloTreeBranding.refresh();
        oTreeBranding.fireSelectionChange();
        nab.branding.changed();
    },
    pageClick: function (e) {
        nab.branding.selectedObjectIsAHeader = false;
        if (e.target.id.toLowerCase().includes("header")) nab.branding.selectedObjectIsAHeader = true;
        let objName = e.target.id.split("-")[0];
        nab.branding.selectedObject = sap.ui.getCore().byId(objName.split("_")[0])

        // switch (nab.branding.selectedObject.sId) {

        //   case "boPagePreviewBranding":
        //  case "boPanel":
        //   case "boCard":
        //  case "boButton":
        //  case "boBarFooterpreview":

        oRPopoverBrandingColor.openBy(nab.branding.selectedObject);
        //     break;
        //  default:
        //  console.log(e.target.id)
        //     break;

        // }
    },
    populateList: function () {
        modeloListBrandingColors.oData = [];

        let colors = modelPanConfigBranding.oData.Colors;
        let listColor = {
            color100: "",
            color75: "",
            color50: "",
            color25: ""
        }

        for (const [key, value] of Object.entries(colors)) {
            listColor.color100 = value;
            listColor.color75 = value;//+ "bf";
            listColor.color50 = value;//+ "80";
            listColor.color25 = value;//+ "40";
            modeloListBrandingColors.oData.push(JSON.parse(JSON.stringify(listColor)));

        }
        modeloListBrandingColors.refresh();
    },
    colorSelected: function (opacity, color) {
        let css = modelPanConfigBranding.getData().css
        let transparency = "";
        switch (opacity) {
            case "100":
                transparency = "ff";
                break;
            case "80":
                transparency = "cc";
                break;
            case "60":
                transparency = "90";
                break;
            case "40":
                transparency = "66";
                break;
            default:
                transparency = "00";
                break;
        }

        switch (nab.branding.selectedObject.sId) {
            case "boPagePreviewBranding":
                if (nab.branding.selectedObjectIsAHeader) {
                    css.pageHeaderBGColor = color + transparency;
                } else {
                    css.pageBGColor = color + transparency;
                }
                break;
            case "boPanel":
                if (nab.branding.selectedObjectIsAHeader) {
                    css.panelHeaderBGColor = color + transparency;
                } else {
                    css.panelBGColor = color + transparency;
                }
                break;
            case "boCard":
                css.cardBGColor = color + transparency;
                break;
            case "boButton":
                css.buttonBGColor = color + transparency;
                css.buttonBGColorHouver = color + transparency;
                break;
            case "boBarFooterpreview":
                css.barFooterBGColor = color + transparency;

                break;
            default:

                break;

        }
        nab.branding.previewCss(css);
        nab.branding.changed();
    },
    changed: function () {
        oButtonBrandingSave.setEnabled(true);
    },
    save: function () {
        if (oInputBrandingName.getValue() === "") {
            oInputBrandingName.setValueState("Error");
            sap.m.MessageToast.show("Name is empty!!");
            return
        }

        oButtonBrandingSave.setEnabled(false);
        apiBrandingSave({ data: modelPanConfigBranding.oData }).then(function (data) {
            if (data.status !== 'Error') {
                // // debugger
                // modelPanConfigBranding.oData = data;
                modelPanConfigBranding.oData = { ...modelPanConfigBranding.oData, id: data.id, updatedAt: data.updatedAt, createdAt: data.updatedAt, createdBy: data.createdBy, updatedBy: data.updatedBy };

                modelPanConfigBranding.refresh();
                modeloTreeBranding.refresh();
                if (data.used) {
                    nab.branding.applyPageCss(data.css);
                }
            }
        });
    },
    checkUnsavedData: function () {
        if (oButtonBrandingSave.getEnabled()) {
            return true;
        }
        return false;
    },
    selectionChanged: function (active, data) {

        if (nab.branding.checkUnsavedData()) {
            data.used = false;
            modeloTreeBranding.refresh();
            modelPanConfigBranding.refresh();
            sap.m.MessageToast.show("Save or Discard the Changes first!!");
            return;
        }

        for (const line of modelBranding.oData) {
            if (line.used && line.id !== data.id) {
                line.used = false;
            } else if (line.id === data.id) {
                line.used = true;
            }
        }
        modelBranding.refresh();

        if (active) {
            nab.branding.applyPageCss(data.css);
            nab.css.addOrUpdateToAllPages("ABRBranding", "", "", data.id);

            sap.m.MessageToast.show("Branding applied!!");
        } else {
            nab.branding.clearPageCss();
            nab.css.removeFromAllPages("ABRBranding", "", "", data.id);

            sap.m.MessageToast.show("Branding removed!!");
        }
        nab.branding.processingData(modelBranding.oData);
        nab.branding.generateScreenAllPages();
    },
    generateScreenAllPages: function () {
        if (modelAppData.oData.pages.length === undefined) return;
        let currentePage = Builder.getSelectedPageId();

        let i = 0;

        var myInterval = setInterval(function () {
            if (i < modelAppData.oData.pages.length) {
                let page = modelAppData.oData.pages[i]
                page.image = modelMasterData.oData.url + modelAppData.oData.accountid + "/" + modelAppData.oData.id + "/" + page.id;
                Builder.selectPage(page.id);
                Builder.createPageImage(page);
            }
            i++;


            if (i > modelAppData.oData.pages.length) {

                Builder.selectPage(currentePage);
                Builder.setAttributes();
                window.clearInterval(myInterval);
            }
        }, 3500);
    }
}