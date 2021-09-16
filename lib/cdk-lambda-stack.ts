import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';


export class CdkLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const snsEventHandlerRole = new iam.Role(this, 'snsEventHandlerRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      roleName: 'snsEventHandlerRole',
    });

    const snsEventHandler = new lambda.Function(this, 'snsEventHandler', {
      code: lambda.Code.fromAsset(
        './functions',
        { exclude: ['node_modules/aws-sdk*'] },
      ),
      description: 'Lambda function to handle SNS event',
      functionName: 'snsEventHandlerRole',
      handler: 'index.handler',
      memorySize: 128,
      role: snsEventHandlerRole,
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(60),
    });
  }
}
