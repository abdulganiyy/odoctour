import { NextRequest, NextResponse } from "next/server";
import { isJwtExpired } from "./lib/session";


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
  
    if (isProtectedRoute && isTokenExpired) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  
    if (isPublicRoute && !isTokenExpired) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  
    return NextResponse.next();
  


}