sap.ui.define(
  [
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
  ],
  function (
    BaseController,
    MessageToast,
    MessageBox,
    JSONModel,
    Fragment,
    formatter
  ) {
    "use strict";

    // smart table
    let _oView = null;
    let _oTable = null;
    let _oThis = null;
    let _oViewModel = new JSONModel({ edit: false });
    let _oPreqTextDialog = null;
    let _oRowSelected = null;

    return BaseController.extend("oup.pms.zpmsmgrckpt.controller.Worklist", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        _oView = this.getView();
        _oTable = _oView.byId("list-table-id").getTable();
        _oThis = this;

        // view model
        this.setModel(_oViewModel, "oViewModel");

        // table initialization
        this._tableInit();
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the button press event
       * @public
       */
      onNavPress: function (oEvent) {
        try {
          // validate row selection
          _oRowSelected = this._validateTableRowSelection();

          if (!_oRowSelected) {
            throw "error";
          }

          var oSource = oEvent.getSource();
          var sTarget = oSource.data("target");
          var oTarget = {};
          var oParams = {};

          switch (sTarget) {
            case "POI":
              // target
              oTarget.semanticObject = "ZPreviousImpression";
              oTarget.action = "manage";

              // params
              oParams.psphi = _oRowSelected.psphi;
              break;

            case "Component":
              // target
              oTarget.semanticObject = "ZComponentParentsBlock";
              oTarget.action = "manage";

              // params
              oParams.compack = "Component";
              oParams.Impression = _oRowSelected.posid;
              break;

            case "ParentsPacks":
              // target
              oTarget.semanticObject = "ZComponentParentsBlock";
              oTarget.action = "manage";

              // params
              oParams.compack = "Packs";
              oParams.Impression = _oRowSelected.posid;
              break;

            default:
              break;
          }

          if (Object.keys(oTarget).length === 0) {
            return;
          }

          this._navToTarget(oTarget, oParams);
        } catch (error) {}
      },

      onBeforeExport: function (oEvent) {
        var mExcelSettings = oEvent.getParameter("exportSettings");

        // User status
        const oUserStatus = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-usrstat_code",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "User Status",
          precision: undefined,
          property: ["usrstat_code", "usrstat_code_Text"],
          scale: undefined,
          template: "{1} ({0})",
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 18,
        };
        mExcelSettings.workbook.columns.splice(3, 0, oUserStatus);

        // Impression Owner
        const oVernr = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-vernr",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "Impression Owner",
          precision: undefined,
          property: ["vernr", "vernr_Text"],
          scale: undefined,
          template: "{1} ({0})",
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 12,
        };
        mExcelSettings.workbook.columns.splice(4, 0, oVernr);

        // Content Owner
        const oContentOwner = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-astnr",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "Content Owner",
          precision: undefined,
          property: ["astnr", "astnr_Text"],
          scale: undefined,
          template: "{1} ({0})",
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 20,
        };
        mExcelSettings.workbook.columns.splice(5, 0, oContentOwner);

        // PReq release Status
        const oReleaseStatus = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-frgco",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "PReq release Status",
          precision: undefined,
          property: ["frgco", "frgco_Text"],
          scale: undefined,
          template: "{1} ({0})",
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 20,
        };
        mExcelSettings.workbook.columns.splice(6, 0, oReleaseStatus);

        // Purchase Requisition
        const oBanfn = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-banfn",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "Purchase Requisition",
          precision: undefined,
          property: "banfn",
          scale: undefined,
          template: null,
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 12,
        };
        mExcelSettings.workbook.columns.splice(8, 0, oBanfn);

        // Bulk Deal
        const oBulkDeal = {
          columnId:
            "application-ManagerCockpit-display-component---worklist--list-table-id-bulk_deal",
          displayUnit: false,
          falseValue: undefined,
          inputFormat: null,
          label: "Bulk Deal",
          precision: undefined,
          property: ["bulk_deal", "bulk_deal_Text"],
          scale: undefined,
          template: "{1} ({0})",
          textAlign: "Begin",
          trueValue: undefined,
          type: "string",
          unitProperty: undefined,
          width: 30,
        };
        mExcelSettings.workbook.columns.splice(14, 0, oBulkDeal);
      },

      onPRNavPress: function (oEvent) {
        const oRowObject = oEvent.getSource().getBindingContext().getObject();
        const PurchaseRequisition = oRowObject.banfn;

        // target
        const oTarget = {
          semanticObject: "PurchaseRequisition",
          action: "manage",
        };

        // params
        const oParams = {
          PurchaseRequisition,
        };

        this._navToTarget(oTarget, oParams);
      },

      onPreqTextPress: async function () {
        try {
          // validate row selection
          _oRowSelected = this._validateTableRowSelection();

          if (!_oRowSelected) {
            throw "error";
          }

          if (!_oPreqTextDialog) {
            // initialize dialog
            _oPreqTextDialog = await this._loadFragment(
              `oup.pms.zpmsmgrckpt.view.fragment.PreqText`,
              this
            );

            // add view dependent
            _oView.addDependent(_oPreqTextDialog);
          }

          const dataRequested = () => _oPreqTextDialog.setBusy(true);
          const dataReceived = () => _oPreqTextDialog.setBusy(false);

          // bind element for the dialog
          _oPreqTextDialog.bindElement({
            path: `/ZPMSPREQTEXTSet(Posid='${_oRowSelected.posid}',Banfn='${_oRowSelected.banfn}')`,
            events: {
              dataRequested,
              dataReceived,
            },
          });

          // open dialog
          _oPreqTextDialog.open();
        } catch (error) {}
      },

      onPreqTextDialogCancel: () => _oPreqTextDialog.close(),

      onPreqTextDialogSave: () => {
        const fnSuccess = (_) => {
          MessageToast.show("Saved Successfully !");
          _oPreqTextDialog.close();
        };

        const fnError = (_) => {
          MessageToast.show(`Error - ${_}`);
        };

        _oView.getModel().submitChanges({
          success: fnSuccess,
          error: fnError,
        });
      },

      onSavePress: async function (_oEvent) {
        try {
          if (!_oView.getModel().hasPendingChanges()) {
            // display warning message
            MessageBox.information("There are no changes found to save", {
              styleClass: "sapUiSizeCompact",
            });

            throw "No changes found";
          }

          await this._saveChanges();

          // toggle edit property in view model
          _oViewModel.setProperty("/edit", false);

          // success message
          MessageToast.show("Saved Successfully");
        } catch (error) {
          // failed to save changes
          MessageBox.error(error, {
            styleClass: _oThis.getOwnerComponent().getContentDensityClass(),
          });
        }
      },

      onEditPress: () => _oViewModel.setProperty("/edit", true),

      onCancelPress: () => {
        if (_oView.getModel().hasPendingChanges()) {
          // display warning message
          MessageBox.warning("Cancel your changes ?", {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            styleClass: "sapUiSizeCompact",
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                // cancel the changes by resetting the model
                _oView.getModel().resetChanges();

                // toggle edit property in view model
                _oViewModel.setProperty("/edit", false);
              }
            },
          });
        } else {
          // toggle edit property in view model
          _oViewModel.setProperty("/edit", false);
        }
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      _loadFragment: (sPath, _oThis) =>
        new Promise((reslove, reject) =>
          Fragment.load({
            name: sPath,
            controller: _oThis,
          })
            .then((oFragment) => reslove(oFragment))
            .catch((oError) => reject(oError))
        ),

      _tableInit: () => {
        const _onBusyStateChanged = (oEvent) => {
          const bBusy = oEvent.getParameter("busy");
          if (!bBusy) {
            let oTpc = null;
            if (sap.ui.table.TablePointerExtension) {
              oTpc = new sap.ui.table.TablePointerExtension(_oTable);
            } else {
              oTpc = new sap.ui.table.extensions.Pointer(_oTable);
            }
            const aColumns = _oTable.getColumns();
            for (let i = aColumns.length; i >= 0; i--) {
              oTpc.doAutoResizeColumn(i);
            }
          }
        };

        // add event delegate for onafter rendering
        _oTable.addEventDelegate({
          onAfterRendering: (_) =>
            _oTable.attachBusyStateChanged(_onBusyStateChanged),
        });
      },

      _validateTableRowSelection: () => {
        try {
          const iSelectedIndex = _oTable.getSelectedIndex();

          if (iSelectedIndex === -1) {
            throw "error";
          }

          // get selected row from biniding context
          const oContext = _oTable.getContextByIndex(iSelectedIndex);
          const oData = oContext.getObject() || null;

          return oData;
        } catch (error) {
          MessageToast.show(
            _oThis.getResourceBundle().getText("worlistNoRowSelected")
          );
        }
      },

      _navToTarget: (oTarget, oParams) => {
        var sParams = "";
        for (const property in oParams) {
          sParams += `${property}=${oParams[property]}&`;
        }

        if (sParams.length > 0) {
          // remove trailing '&'
          sParams = sParams.substr(0, sParams.length - 1);
        }

        // launch the application in new tab
        sap.m.URLHelper.redirect(
          `#${oTarget.semanticObject}-${oTarget.action}?${sParams}`,
          /*new window*/ true
        );
      },

      _saveChanges: () =>
        new Promise((reslove, reject) => {
          const fnSuccess = (oDataResponse) => {
            try {
              // check for odata response status code
              const oResponse = oDataResponse.__batchResponses[0];

              const bError = parseInt(oResponse.response.statusCode) >= 400;
              if (bError) {
                // error in odata request
                reject(JSON.parse(oResponse.response.body).error.message.value);
              }

              // if no errors, resolve the promise
              reslove(oDataResponse);
            } catch (error) {
              const oChangeResponse =
                oDataResponse.__batchResponses[0].__changeResponses[0];
              const bChangeResponseError =
                parseInt(oChangeResponse.statusCode) >= 400;

              if (!bChangeResponseError) {
                reslove(oDataResponse);
              }

              // error in odata request
              reject("Failed to save the changes");
            }
          };

          const fnError = (oErrorResponse) => {
            reject(oErrorResponse);
          };

          _oView.getModel().submitChanges({
            success: fnSuccess,
            error: fnError,
          });
        }),
    });
  }
);
