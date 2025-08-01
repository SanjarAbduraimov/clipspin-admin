import { useAuthContext } from "@/auth/hooks/useAuthContext";

import { Link } from "../Link";

export const Navigation = () => {
  const { user } = useAuthContext();

  return (
    <nav>
      <ul className="flex gap-4">
        {user?.role === "admin" && (
          <>
            <li>
              <Link to="/requests">Requests</Link>
            </li>
            <li>
              <Link to="/">Users</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
