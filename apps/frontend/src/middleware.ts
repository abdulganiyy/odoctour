import { NextRequest, NextResponse } from "next/server";
import { isJwtExpired } from "./lib/session";
import { jwtDecode } from "jwt-decode";


const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signup",'/signin'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

    const token =  req.cookies.get('session')?.value || ''

    // console.log(token)


    const isTokenExpired = isJwtExpired(token)

    // console.log(isTokenExpired)


    // const session =  jwtDecode(token) as {userId:string}

    // console.log(session)
  
    if (isProtectedRoute && isTokenExpired) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  
    if (isPublicRoute && !isTokenExpired) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  
    return NextResponse.next();
  


}