import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(request: any): boolean {
  const authorization = request.headers["authorization"];
  console.log("AUTHORIZATION: ", authorization);
  if (!authorization || authorization !== process.env.AUTHORIZATION_TOKEN) {
    return false;
  }
  return true;
}
