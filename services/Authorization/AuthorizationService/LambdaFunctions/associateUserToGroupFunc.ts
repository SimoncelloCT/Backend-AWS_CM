/*
  Created by Simone Scionti
*/

'use strict';

import { APIGatewayProxyHandler } from "aws-lambda";
import { Utils } from "../../../../shared/Utils/Utils";
import { deserialize } from "typescript-json-serializer";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { UserXGroup } from "../../../../shared/Models/QueryModels/UserXGroup";
import { AuthorizationServiceUtils } from "../Utils/AuthorizationServiceUtils";


export const associateUserToGroup: APIGatewayProxyHandler = async (event, _context) => {
    const requestBody = Utils.getUniqueInstance().validateRequestObject(event);

    //Deserialize
    let requestedUserXGroup: UserXGroup = deserialize(requestBody, UserXGroup);

    if (!requestedUserXGroup.enoughInfoForCreate()) {
        return Utils.getUniqueInstance().getValidationErrorResponse(requestBody, requestedUserXGroup.getCreateExpectedBody());
    }

    let cognito = new CognitoIdentityServiceProvider({ signatureVersion: 'v4' });

    let params = AuthorizationServiceUtils.getCognitoParamsByUserAndGroup(requestedUserXGroup.Email, requestedUserXGroup.Group);

    try {
        const data = await cognito.adminAddUserToGroup(params).promise();
        return Utils.getUniqueInstance().getDataResponse(data);
    } catch (error) {
        return Utils.getUniqueInstance().getErrorResponse(error, params);
    }
};
