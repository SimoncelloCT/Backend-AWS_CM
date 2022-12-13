"use strict";
/*
  Created by Simone Scionti
    manager for consistent update of campus service.


*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CampusConsistentUpdateManager = void 0;
var ConsistentUpdateManagerClass_1 = require("../../../../shared/SupportClasses/AbstractClasses/ConsistentUpdateManagerClass");
var Utils_1 = require("../../../../shared/Utils/Utils");
var CampusXCompanyXUser_1 = require("../../../../shared/Models/RelationshipsRecordModels/CampusXCompanyXUser");
var typescript_json_serializer_1 = require("typescript-json-serializer");
var CampusXCompany_1 = require("../../../../shared/Models/RelationshipsRecordModels/CampusXCompany");
var Resources_1 = require("../../../../shared/Utils/Resources");
/*

TODO:
I can do better because i can query only for CampusXCompanyXUser records and :
-If i have no results so i need to query for CampusXCompany Records
- I f i have results i can use the couple (CampusName-CompanyName) to refer to CampusXCompany records.

The problem is if i don't have any user inside a company, i will not refer the CampusXCompany record and i'll leave the db inconsistent.
*/
var CampusConsistentUpdateManager = /** @class */ (function (_super) {
    __extends(CampusConsistentUpdateManager, _super);
    function CampusConsistentUpdateManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CampusConsistentUpdateManager.getUniqueInstance = function () {
        if (!CampusConsistentUpdateManager.obj)
            CampusConsistentUpdateManager.obj = new CampusConsistentUpdateManager();
        return this.obj;
    };
    CampusConsistentUpdateManager.prototype.getRels = function (item) {
        return __awaiter(this, void 0, Promise, function () {
            var CampusXCompanyParams, CampusXCompanyXUserParams, campusXCompanyRels, campusXCompanyXUserRels, campXcompItems, campXcompXuserItems, allRels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        CampusXCompanyParams = {
                            TableName: Resources_1.Resources.IP_TABLE,
                            ProjectionExpression: "CampusName,CompanyName",
                            KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
                            ExpressionAttributeNames: {
                                "#pk": "PK",
                                "#sk": "SK"
                            },
                            ExpressionAttributeValues: {
                                ":pk": "#CAMPUS<" + item.CampusName + ">",
                                ":sk": "#COMPANY"
                            }
                        };
                        CampusXCompanyXUserParams = {
                            TableName: Resources_1.Resources.IP_TABLE,
                            ProjectionExpression: "Email,CampusName,CompanyName",
                            KeyConditionExpression: "#pk = :pk",
                            ExpressionAttributeNames: {
                                "#pk": "PK"
                            },
                            ExpressionAttributeValues: {
                                ":pk": "#USER#X#CAMPUS<" + item.CampusName + ">"
                            }
                        };
                        return [4 /*yield*/, this.dynamo.query(CampusXCompanyParams).promise()];
                    case 1:
                        campusXCompanyRels = _a.sent();
                        return [4 /*yield*/, this.dynamo.query(CampusXCompanyXUserParams).promise()];
                    case 2:
                        campusXCompanyXUserRels = _a.sent();
                        campXcompItems = campusXCompanyRels.Items;
                        campXcompXuserItems = campusXCompanyXUserRels.Items;
                        allRels = campXcompXuserItems.concat(campXcompItems);
                        return [2 /*return*/, allRels];
                }
            });
        });
    };
    CampusConsistentUpdateManager.prototype.getUpdateObjects = function (rels, item, updateSchema) {
        var updateObjects = [];
        //put all rerlationships objects to update
        for (var _i = 0, rels_1 = rels; _i < rels_1.length; _i++) {
            var rel = rels_1[_i];
            var relkeys = void 0;
            //try to deserialize in the most specific model.
            var currentRelationship = void 0;
            var relationship = typescript_json_serializer_1.deserialize(rel, CampusXCompanyXUser_1.CampusXCompanyXUser);
            if (relationship.isPKDefined()) { //check if i have all pk defined. If not, it was a CampusXCompany record, so we don't have Email.
                //uses a function that put all the updatable new parameters in the instance.
                currentRelationship = relationship;
                if (updateSchema == false)
                    Utils_1.Utils.getUniqueInstance().recursivelySetUpdatedKeysForSameSchema(item, relationship);
                else
                    Utils_1.Utils.getUniqueInstance().recursivelySetUpdatedKeysForSchema(updateSchema, item, relationship);
                relkeys = {
                    PK: "#USER#X#CAMPUS<" + relationship.CampusName + ">",
                    SK: "#USER<" + relationship.Email + ">#COMPANY<" + relationship.CompanyName + ">"
                };
            }
            else {
                var relationship_1 = typescript_json_serializer_1.deserialize(rel, CampusXCompany_1.CampusXCompany);
                currentRelationship = relationship_1;
                if (updateSchema == false)
                    Utils_1.Utils.getUniqueInstance().recursivelySetUpdatedKeysForSameSchema(item, relationship_1);
                else
                    Utils_1.Utils.getUniqueInstance().recursivelySetUpdatedKeysForSchema(updateSchema, item, relationship_1);
                relkeys = {
                    PK: "#CAMPUS<" + relationship_1.CampusName + ">",
                    SK: "#COMPANY<" + relationship_1.CompanyName + ">"
                };
            }
            var objParams = {
                Update: {
                    TableName: Resources_1.Resources.IP_TABLE,
                    Key: relkeys,
                    UpdateExpression: Utils_1.Utils.getUniqueInstance().getUpdateExpression(currentRelationship),
                    ExpressionAttributeValues: Utils_1.Utils.getUniqueInstance().getExpressionAttributeValues(currentRelationship)
                }
            };
            if (Object.keys(objParams.Update.ExpressionAttributeValues).length != 0)
                updateObjects.push(objParams);
        }
        //put the company info record to update
        var campusKeys = {
            'PK': "#CAMPUS",
            'SK': "#CAMPUS_INFO<" + item.CampusName + ">"
        };
        var userParams = {
            Update: {
                TableName: Resources_1.Resources.IP_TABLE,
                Key: campusKeys,
                UpdateExpression: Utils_1.Utils.getUniqueInstance().getUpdateExpression(item),
                ExpressionAttributeValues: Utils_1.Utils.getUniqueInstance().getExpressionAttributeValues(item)
            }
        };
        updateObjects.push(userParams);
        return updateObjects;
    };
    return CampusConsistentUpdateManager;
}(ConsistentUpdateManagerClass_1.ConsistentUpdateManager));
exports.CampusConsistentUpdateManager = CampusConsistentUpdateManager;
