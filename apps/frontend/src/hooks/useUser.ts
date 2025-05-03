import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

function getCookie(name:string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const token = getCookie("session");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error:any) {
        console.error("Invalid token", error);
        setError(error.message)
      }
    }
    setLoading(false);
  }, []);

  return { user, loading, error };
}
